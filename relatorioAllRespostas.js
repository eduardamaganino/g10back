const db = require("./models");
const mongoose = require('mongoose');
const perguntaController = require('./app/controllers/pergunta.controller')
const Pergunta = db.perguntas;
const Enquete = db.enquetes;
const Demografica = db.demograficas;
const Resposta = db.respostasNovas;
var router = require("express").Router();
const ObjectId = mongoose.Types.ObjectId;
const PDFDocument = require("pdfkit-table");
const fs = require('fs');
const path = require('path');
const { time, count } = require("console");
const { jsPDF } = require("jspdf");
require('jspdf-autotable');

exports.pegarEnquete = async(req, res) => {
  const id = req.params.id;

  Enquete.findById(id)
    .then(async data => {
      if (!data) {
          res.status(404).send({ message: "A entidade Enquete com id " + id + " não encontrada!" });
      } else {
        const arrayPerguntas = [];
        const nameEntrevistado = data.nameEntrevistado;
        const nameEntrevistador = data.nameEntrevistador;
        const pesoEntrevistado = data.pesoEntrevistado;
        const pesoEntrevistador = data.pesoEntrevistador;
        const promises = data.pergunta.map(async (pergunta) => {
            const idPergunta = pergunta.toString();
            const resultado = await gerarAggregate(idPergunta, nameEntrevistado, nameEntrevistador, pesoEntrevistado, pesoEntrevistador);
            arrayPerguntas.push(resultado);
        });
        await Promise.all(promises);

        // Ordenando o array pelo campo 'codigo'

        arrayPerguntas.sort(function(a, b) {
          return a.codigoPergunta - b.codigoPergunta;
        });

        gerarPDF(arrayPerguntas, data.nome)
            .then(fileName => {
                console.log(`PDF gerado com sucesso: ${fileName}`);
                res.send({ arrayPerguntas, fileName: path.basename(fileName) });
            })
            .catch(error => {
                console.error('Erro ao gerar PDF:', error);
                res.status(500).send('Erro ao gerar o relatório em PDF');
            }); 
          }
        })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erro desconhecido ocorreu ao buscar a entidade Enquete com o id " + id + "."
      });
    });
}


async function gerarAggregate(id, nameEntrevistado, nameEntrevistador, pesoEntrevistado, pesoEntrevistador){
    const pergunta = await Pergunta.findById(id);
    if (!pergunta) {
        return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
    }

    const descricaoPergunta = pergunta.descricao;
    const codigoPergunta = pergunta.codigoPergunta;
          
    const _aggregate = [
        {
          $match: {
            _id: new ObjectId(id.toString())
          }
        },
        {
          $unwind: "$resposta"
        },
        {
          $unwind: "$resposta.answer"
        },
        {
          $group: {
            _id: "$resposta.answer",
            answer: { $first: "$resposta.answer" },
            count: { $sum: 1 },
            countEntrevistado: {
              $sum: {
                $cond: {
                  if: { $eq: ["$resposta.quemRespondeu", "entrevistado"] },
                  then: 1,
                  else: 0
                }
              }
            },
            countEntrevistador: {
              $sum: {
                $cond: {
                  if: { $eq: ["$resposta.quemRespondeu", "entrevistador"] },
                  then: 1,
                  else: 0
                }
              }
            }
          }
        },
        {
          $project: {
            answer: 1,
            count: 1,
            countEntrevistado: 1,
            countEntrevistador: 1,
            countPeso: {
              $add: [
                {
                  $multiply: ["$countEntrevistado", parseFloat(pesoEntrevistado)]
                },
                {
                  $multiply: ["$countEntrevistador", parseFloat(pesoEntrevistador)]
                }
              ]
            }
          }
        },
        {
          $sort: { count: -1 } // Ordena as respostas pela contagem decrescente
        },
        {
          $addFields: {
            countAdjusted: {
              $cond: { 
                if: { $eq: ["$answer", "Não sabe"] },
                then: -1,
                else: "$count"
              }
            }
          }
        },
        {
          $sort: { countAdjusted: -1 } // Ordena novamente, movendo "Não sabe" para a última posição
        },
        {
          $project: {
            countAdjusted: 0 // Remove o campo temporário countAdjusted
          }
        }
    ];
    
    try {
        const data = await Pergunta.aggregate(_aggregate);
        
        const respostas = data.map(item => ({
            answer: item.answer,
            count: item.count,
            countEntrevistado: item.countEntrevistado,
            countEntrevistador: item.countEntrevistador,
            countPeso: item.countPeso
        }));
        
        const result = {
            codigoPergunta: codigoPergunta,
            descricao: descricaoPergunta,
            respostas: respostas,
            nameEntrevistado: nameEntrevistado,
            nameEntrevistador: nameEntrevistador
        };
        
        return result;
    } catch (error) {
        throw error;
    }
}


async function gerarPDF(arrayPerguntas, nomeEnquete) {
    console.log('Gerando PDF...');

    // Crie um novo documento jsPDF
    const doc = new jsPDF();

    // Defina a margem e outras configurações do documento
    const margin = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Defina a posição inicial do conteúdo
    let currentY = margin;

    // Adicione o título do relatório
    doc.setFontSize(24);
    doc.text(`Relatório ${nomeEnquete}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10; // Aumente a posição Y

    // Itere sobre cada pergunta no array
    arrayPerguntas.forEach(result => {
        if (result) {
            const descPerg = result.descricao;
            const respostas = result.respostas;

            // Adicione a descrição da pergunta como cabeçalho da seção
            doc.setFontSize(16);
            doc.text(`Categoria: ${descPerg}`, pageWidth / 2, currentY, { align: 'center' });
            currentY += 10; // Aumente a posição Y

           // Inicialize os totais
           let totalEntrevistado = 0;
           let totalEntrevistador = 0;
           let totalCount = 0;
           let totalPeso = 0;

           // Itere sobre cada resposta para calcular os totais
           respostas.forEach(answer => {
               totalEntrevistado += parseInt(answer.countEntrevistado);
               totalEntrevistador += parseInt(answer.countEntrevistador);
               totalCount += parseInt(answer.count);
               totalPeso += parseFloat(answer.countPeso);
           });

           // Crie os dados da tabela
           const tableData = respostas.map(answer => {
               return [answer.answer, answer.countEntrevistado.toString(), answer.countEntrevistador.toString(), answer.count.toString(), answer.countPeso.toFixed(2).replace('.', ',')];
           });

           doc.autoTable({
            head: [['Resposta', result.nameEntrevistado, result.nameEntrevistador, 'Total', 'Total %']],
            body: tableData,
            startY: currentY,
            theme: 'grid',
            margin: { top: margin },
            styles: { overflow: 'linebreak' }
        });

        // Adicione uma linha extra com os totais ao final da tabela
        doc.autoTable({
            head: [['Total', totalEntrevistado.toString(), totalEntrevistador.toString(), totalCount.toString(), totalPeso.toFixed(2).replace('.', ',')]],
            startY: doc.autoTable.previous.finalY,
            theme: 'grid',
            margin: { top: margin },
            styles: { fontStyle: 'bold' }
        });

        // Ajuste a posição Y para o próximo conteúdo
        currentY = doc.autoTable.previous.finalY + 20;
        }
    });

    // Salve o PDF em um arquivo
    const pastaPDFs = path.join(__dirname, '..', 'pdfs');
    const pdfPath = path.join(pastaPDFs, 'relatorioInteiro.pdf');
    doc.save(pdfPath);

    return pdfPath;
}


