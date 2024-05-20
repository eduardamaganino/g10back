const db = require("../../models");
const Enquete = db.enquetes;
const Pergunta = db.perguntas;
const Transmissao = db.transmissoes;
const Demografica = db.demograficas;
//Mongoose Import
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


validaCamposRequeridosEnquete = (req) => {
    const camposRequeridosEmpty = new Array();
    if (!req.body.nome) {
        camposRequeridosEmpty.push("nome");
    }
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade Enquete
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosEnquete(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    // Create a Enquete
    const enquete = new Enquete({
        nome: req.body.nome ? req.body.nome : null,
        ativa: req.body.ativa ? req.body.ativa : null,
        dataHoraInicio: req.body.dataHoraInicio ? req.body.dataHoraInicio : null,
        dataHoraFinal: req.body.dataHoraFinal ? req.body.dataHoraFinal : null,
        entrevistado: req.body.entrevistado ? req.body.entrevistado : null,
        pesoEntrevistado: req.body.pesoEntrevistado ? req.body.pesoEntrevistado : null,
        entrevistador: req.body.entrevistador ? req.body.entrevistador : null,
        pesoEntrevistador: req.body.pesoEntrevistador ? req.body.pesoEntrevistador : null,
        numResposta: req.body.numResposta ? req.body.numResposta : null,
        dividirEmBlocos: req.body.dividirEmBlocos ? req.body.dividirEmBlocos : null,
        showAlternativas: req.body.showAlternativas ? req.body.showAlternativas: null,
        nameEntrevistado: req.body.nameEntrevistado ? req.body.nameEntrevistado : null,
        nameEntrevistador: req.body.nameEntrevistador ? req.body.nameEntrevistador : null,
        pergunta: req.body.pergunta ? req.body.pergunta.id : [],
        transmissao: req.body.transmissao ? req.body.transmissao.id : [],
        demografica: req.body.demografica ? req.body.demografica.id : [],
    });

    // Save Enquete in the database
    enquete
        .save(enquete)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Enquete."
            });
        });
};

// Procura por todas as entidades do tipo Enquete
exports.findAll = (req, res) => {
    var condition = {};

    const nome = req.query.nome;
    if (nome) {
        condition.nome = { $regex: new RegExp(nome), $options: "i" };
    }

    Enquete.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Enquete."
        });
      });
};

// Busca a entidade Enquete por id
exports.findOne = (req, res) => {

    const id = req.params.id;

    Enquete.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "A entidade Enquete com id " + id + " não encontrada!" });
        else res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao buscar a entidade Enquete com o id " + id + "."
        });
      });
};

exports.findOneAggregate = (req, res) => {
  const id = req.params.id;

  let _aggregate = [];
  _aggregate.push(
    {
      $match : { "_id" : new ObjectId(id.toString()) }
    },
    {
      $lookup:{
          from: 'perguntas',
          "pipeline":[
            {
                $lookup:{
                    from: 'opcaorespostas',//Nome da tabela que vai pegar os dados
                    localField: 'opcaoResposta',//Nome do campo da tabela atual que ele vai pegar o ID pra ir na outra tabela
                    foreignField: '_id',
                    as: 'opcaoResposta'//nome do campo que irá aparecer o dado obtido dessa outra tabela
                },
            },
            {
              $project: {
                _id: 1,
                codigoPergunta: 1,
                descricao:1,
                tipoPergunta:1,
                obrigatoria:1,
                outro:1,
                alternativa: 1,
                bloco:1,
                opcaoResposta:1,
                resposta:1,
                createdAt:1,
                updatedAt:1,
              }
            },
          ],
          localField: 'pergunta',
          foreignField: '_id',
          as: 'pergunta'
      },
    },
    
  );

  Enquete.aggregate(_aggregate).then(data => {
    if (!data){
      res.status(404).send({ message: "A entidade Enquete com id " + id + " não encontrada!" });
    } else {
      res.send(data[0]);
    } 
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Erro desconhecido ocorreu ao buscar a entidade Enquete com o id " + id + "."
    });
  });
}

exports.findOneAggregateDemografica = (req, res) => {
  const id = req.params.id;

  let _aggregate = [];
  _aggregate.push(
    {
      $match: { "_id": new ObjectId(id) } // No need to convert to string and then back to ObjectId
    },
    {
      $lookup:{
          from: 'demograficas',
          "pipeline":[
            {
              $project: {
                _id: 1,
                codPergDemografica: 1,
                descPergDemografica: 1,
                tipoPergDemografica: 1,
                perguntaNoRelatorio: 1,
                respostaPergDemografica: 1,
                alternativaPergDemografica: 1,
              }
            },
          ],
          localField: 'demografica',
          foreignField: '_id',
          as: 'demografica'
      },
    },
  );

  Enquete.aggregate(_aggregate).then(data => {
    if (!data || data.length === 0) {
      res.status(404).send({ message: "A entidade Enquete com id " + id + " não encontrada!" });
    } else {
      res.send(data[0]);
    }
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Erro desconhecido ocorreu ao buscar a entidade Enquete com o id " + id + "."
    });
  });
};

// Altera uma entidade Enquete
exports.update = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosEnquete(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    Enquete.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Enquete com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Enquete com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Enquete com o id " + id + "."
        });
      });
};

// Remove a entidade Enquete por id
exports.delete = (req, res) => {
  const id = req.params.id;

    Enquete.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Enquete com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Enquete com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Enquete com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Enquete
exports.deleteAll = (req, res) => {

    Enquete.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? 'Enquetes' : 'Enquete'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Enquete."
        });
      });
};

// Procura por entidade Enquete onde o campo booleano ativa seja true
exports.findAllAtiva = (req, res) => {

    Enquete.find({ ativa: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Enquete por ativa true."
        });
      });
};

// Procura por entidade Enquete onde o campo booleano entrevistadorInsereResposta seja true
exports.findAllEntrevistadorInsereResposta = (req, res) => {

    Enquete.find({ entrevistador: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Enquete por entrevistadorInsereResposta true."
        });
      });
};

// Procura por entidade Enquete onde o campo booleano entrevistadoInsereResposta seja true
exports.findAllEntrevistadoInsereResposta = (req, res) => {

    Enquete.find({ entrevistado: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Enquete por entrevistadoInsereResposta true."
        });
      });
};

exports.createPergunta = (req, res) => {
  const id = req.params.id;

     // Create a Pergunta
     const pergunta = new Pergunta({
      codigoPergunta: req.body.codigoPergunta ? req.body.codigoPergunta : null,
      // sequenciaFormulario: req.body.sequenciaFormulario ? req.body.sequenciaFormulario : null,
       descricao: req.body.descricao ? req.body.descricao : null,
       //textoExplicativo: req.body.textoExplicativo ? req.body.textoExplicativo : null,
       tipoPergunta: req.body.tipoPergunta ? req.body.tipoPergunta : null,
       obrigatoria: req.body.obrigatoria ? req.body.obrigatoria : null,
       bloco: req.body.bloco ? req.body.bloco : null,
       outro: req.body.outro ? req.body.outro : null,
       alternativa: req.body.alternativa ? req.body.alternativa : [],
       resposta: req.body.resposta ? req.body.resposta.id : [],
      
  });

  // Save Pergunta in the database
  pergunta
      .save(pergunta)
      .then(data => {
        Enquete
        .findById(id)
        .then(enquete => {
            if (!enquete) {
                res.status(404).send({
                    message: `A entidade Item com id ${id} não encontrada, por isso não pode ser atualizada!`
                });
            } else {
              console.log(enquete.pergunta);
                enquete.pergunta.push(data.id);
                 res.send(enquete);
            }
          })
        .catch(err => {
           res.status(500).send({
               message:
                   err.message || "Erro desconhecido ocorreu ao alterar a entidade Item com o id " + id + "."
           });
        });  
      })
      .catch(err => {
          res.status(500).send({
              message:
              err.message || "Ocorreu um erro de servidor ao tentar salvar Pergunta."
          });
      });
};

exports.createTransmissao = (req, res) => {
  const id = req.params.id;
     // Create a Transmissao
     const transmissao = new Transmissao({
      nome: req.body.nome ? req.body.nome : null,
      assunto: req.body.assunto ? req.body.assunto : null,
      mensagem: req.body.mensagem ? req.body.mensagem : null,
      emailRemetente: req.body.emailRemetente ? req.body.emailRemetente : null,   
      
  });
  console.log(transmissao);
  // Save transmissao in the database
  transmissao
      .save(transmissao)
      .then(data => {
        Enquete
        .findById(id)
        .then(enquete => {
            if (!enquete) {
                res.status(404).send({
                    message: `A entidade Item com id ${id} não encontrada, por isso não pode ser atualizada!`
                });
            } else {
              console.log(enquete.transmissao);
                enquete.transmissao.push(data.id);
                 res.send(enquete);
            }
          })
        .catch(err => {
           res.status(500).send({
               message:
                   err.message || "Erro desconhecido ocorreu ao alterar a entidade Item com o id " + id + "."
           });
        });  
      })
      .catch(err => {
          res.status(500).send({
              message:
              err.message || "Ocorreu um erro de servidor ao tentar salvar Pergunta."
          });
      });
};

exports.createDemografica= (req, res) => {
  const id = req.params.id;
  // Create a Demografica
  const demografica = new Demografica({
    codPergDemografica: req.body.codPergDemografica ? req.body.codPergDemografica : null,
    descPergDemografica: req.body.descPergDemografica ? req.body.descPergDemografica : null,
    tipoPergDemografica: req.body.tipoPergDemografica ? req.body.tipoPergDemografica : null,
    perguntaNoRelatorio: req.body.perguntaNoRelatorio ? req.body.perguntaNoRelatorio : null, 
    respostaPergDemografica: req.body.respostaPergDemografica ? req.body.respostaPergDemografica.id : [],
       
  });

  console.log(demografica);
  // Save demografica in the database
           
  demografica
      .save(demografica)
      .then(data => {
        Enquete
        .findById(id)
        .then(enquete => {
            if (!enquete) {
                res.status(404).send({
                    message: `A entidade Item com id ${id} não encontrada, por isso não pode ser atualizada!`
                });
            } else {
              console.log(enquete.demografica);
                enquete.demografica.push(data.id);
                 res.send(enquete);
            }
          })
        .catch(err => {
           res.status(500).send({
               message:
                   err.message || "Erro desconhecido ocorreu ao alterar a entidade Item com o id " + id + "."
           });
        });  
      })
      .catch(err => {
          res.status(500).send({
              message:
              err.message || "Ocorreu um erro de servidor ao tentar salvar Pergunta."
          });
      });
};



