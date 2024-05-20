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

exports.teste = async(req, res) => {
    const id = req.params.id;

    Enquete.findById(id)
      .then(async data => {
        if (!data) {
            res.status(404).send({ message: "A entidade Enquete com id " + id + " não encontrada!" });
        } else {
          const arrayPerguntas = [];
          const nameEntrevistado = data.nameEntrevistado;
          const nameEntrevistador = data.nameEntrevistador;
          const promises = data.pergunta.map(async (pergunta) => {
              const idPergunta = pergunta.toString();
              const resultado = await funcaosimilarpremiada(idPergunta, req.params.colocado, nameEntrevistado, nameEntrevistador);
              arrayPerguntas.push(resultado);
          });
  
          await Promise.all(promises);

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

async function funcaosimilarpremiada(id, colocado, nameEntrevistado, nameEntrevistador){
  const pergunta = await Pergunta.findById(id);
  if (!pergunta) {
      return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
  }

  const _aggregate = [
    {
      $match: {
        _id: new ObjectId(id.toString()),
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
        count: { $sum: 1 },
        usuarios: { $push: "$resposta.usuario" }
      }
    },
    {
      $sort: {
        count: -1 
      }
    },
    {
      $project: {
        _id: 0,
        answer: "$_id",
        count: 1,
        usuarios: 1
      }
    },
  
  ];
  let respostaMaisVotada = '';

  const data = await Pergunta.aggregate(_aggregate);
  if (data[colocado - 1] !== undefined) {
    let resposta = data[colocado - 1];
    if (resposta.answer === "Não sabe") {
      resposta = data[colocado];
    }
    respostaMaisVotada = resposta.answer;
    const _usuarios = resposta.usuarios;
      const _aggregate2 = [
        {
            $match: {
                "respostaPergDemografica.usuario": { $in: _usuarios },
                "perguntaNoRelatorio": "true",
                "respostaPergDemografica.answerPergDemografica": { $exists: true }
            }
        },
        {
            $unwind: "$respostaPergDemografica"
        },
        {
            $unwind: "$respostaPergDemografica.answerPergDemografica"
        },
        {
            $group: {
                _id: {
                    descPergDemografica: "$descPergDemografica",
                    answer: "$respostaPergDemografica.answerPergDemografica"
                },
                count: { $sum: 1 }, // Conta o número de ocorrências de cada resposta
                countEntrevistado: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$respostaPergDemografica.quemRespondeu", "entrevistado"] },
                      then: 1,
                      else: 0
                    }
                  }
                },
                countEntrevistador: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$respostaPergDemografica.quemRespondeu", "entrevistador"] },
                      then: 1,
                      else: 0
                    }
                  }
                }
            }
        },
        {
          $sort: {
            count: -1 
          }
        },
        {
          $group: {
              _id: "$_id.descPergDemografica",
              answers: {
                  $push: {
                      answer: "$_id.answer",
                      count: "$count",
                      countEntrevistado: "$countEntrevistado",
                      countEntrevistador: "$countEntrevistador"
                  }
              }
          }
      },
      {
          $project: {
              descPergDemografica: "$_id",
              answers: "$answers" 
          }
      }
      
    ];
    

      return new Promise((resolve, reject) => {
        Demografica.aggregate(_aggregate2)
            .then(data2 => {
                const result = {
                    respostaPremiada: respostaMaisVotada,
                    respostasDemograficas: data2,
                    descricaoPergunta: pergunta.descricao, // Correção do typo
                    codigoPergunta: pergunta.codigoPergunta,
                    nameEntrevistado: nameEntrevistado,
                    nameEntrevistador: nameEntrevistador
                };

                resolve(result); // Resolve a promessa com o resultado
            })
            .catch(err => {
                reject(err); // Rejeita a promessa com o erro
            });
    });
  }
}



async function gerarPDF(arrayPerguntas, nomeEnquete) {
    console.log('Gerando PDF...');
    
    // Crie um novo documento jsPDF
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Defina a margem e outras configurações do documento
    const margin = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = margin;

    // Adicione o título do relatório
    doc.setFontSize(24);
    doc.text(`Relatório ${nomeEnquete}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Itere sobre cada pergunta no array
    arrayPerguntas.forEach(result => {
        if (result) {
            const descPerg = result.descricaoPergunta;
            const respPremiada = result.respostaPremiada;
            const nameEntrevistado = result.nameEntrevistado;
            const nameEntrevistador = result.nameEntrevistador;

            // Adicione a descrição da pergunta e a resposta premiada
            doc.setFontSize(16);
            doc.text(`Categoria: ${descPerg}`, pageWidth / 2, currentY, { align: 'center' });
            currentY += 10;
            doc.setFontSize(14);
            doc.text(`Resposta premiada: ${respPremiada}`, pageWidth / 2, currentY, { align: 'center' });
            currentY += 10;

            // Adicione as descrições demográficas e suas tabelas
            result.respostasDemograficas.forEach((demografica, i) => {
                const descPergDemo = demografica.descPergDemografica;
                const answers = demografica.answers;

                doc.setFontSize(12);
                doc.text(`${i + 1}. ${descPergDemo}:`, pageWidth / 2, currentY, { align: 'center' });
                currentY += 10;

                // Crie os dados da tabela
                const tableData = answers.map(answer => [answer.answer, answer.count.toString(), answer.countEntrevistado.toString(), answer.countEntrevistador.toString()]);

                // Adicione a tabela ao documento
                doc.autoTable({
                    head: [['Resposta', 'Quantidade', nameEntrevistado, nameEntrevistador]],
                    body: tableData,
                    startY: currentY,
                    theme: 'grid',
                    margin: { top: margin },
                    styles: { overflow: 'linebreak' }
                });

                currentY = doc.autoTable.previous.finalY + 10; // Atualize a posição Y
            });

            currentY += 10; // Adicione um espaço entre as perguntas
        }
    });

    // Salve o PDF em um arquivo
    const pastaPDFs = path.join(__dirname, '..', 'pdfs');
    const pdfPath = path.join(pastaPDFs, 'document.pdf');
    doc.save(pdfPath);

    return pdfPath;
}





exports.baixar = (req, res) => {
  const file = req.params.file;
  const fileLocation = path.join(__dirname, '../pdfs', file);
  res.sendFile(fileLocation);
}





