const db = require("../../models");
const Pergunta = db.perguntas;
const Demografica = db.demograficas;
const Enquete = db.enquetes;
const Resposta = db.respostas;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

validaCamposRequeridosPergunta = (req) => {
    const camposRequeridosEmpty = new Array();
  
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade Pergunta
exports.create = (req, res) => {
    // Validate request
    if (!req.body.descricao) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosPergunta(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

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
       /* alternativa: [
          {
            codigoAlternativa: req.body.alternativa && req.body.alternativa.codigoAlternativa ? req.body.alternativa.codigoAlternativa : null,
            descricaoAlternativa: req.body.alternativa && req.body.alternativa.descricaoAlternativa ? req.body.alternativa.descricaoAlternativa : null
          }
        ],*/
        alternativa: req.body.alternativa ? req.body.alternativa : [],
        resposta: req.body.resposta ? req.body.resposta.id : [],
    });

    // Save Pergunta in the database
    pergunta
        .save(pergunta)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Pergunta."
            });
        });
};

// Procura por todas as entidades do tipo Pergunta
exports.findAll = (req, res) => {
    var condition = {};

    const codigoPergunta = req.query.codigoPergunta;
    if (codigoPergunta) {
        condition.codigoPergunta = { $regex: new RegExp(codigoPergunta), $options: "i" };
    }

    Pergunta.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Pergunta."
        });
      });
};

// Busca a entidade Pergunta por id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Pergunta.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "A entidade Pergunta com id " + id + " não encontrada!" });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erro desconhecido ocorreu ao buscar a entidade Pergunta com o id " + id + "."
      });
    });
};

// Altera uma entidade Pergunta
exports.update = (req, res) => {
  console.log(req.params.id)
    // Validate request
    if (!req.params.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosPergunta(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    Pergunta.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Pergunta com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Pergunta com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Pergunta com o id " + id + "."
        });
      });
};

// Remove a entidade Pergunta por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Pergunta.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Pergunta com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Pergunta com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Pergunta com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Pergunta
exports.deleteAll = (req, res) => {

    Pergunta.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? 'Perguntas' : 'Pergunta'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Pergunta."
        });
      });
};

// Procura por entidade Pergunta onde o campo booleano obrigatoria seja true
exports.findAllObrigatoria = (req, res) => {

    Pergunta.find({ obrigatoria: true })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Pergunta por obrigatoria true."
        });
      });
};
/*
exports.createOpcaoResposta = (req, res) => {
  const id = req.params.id;

  const opcaoResposta = new OpcaoResposta({
    codigo: req.body.codigo ? req.body.codigo : null,
    opcao: req.body.opcao ? req.body.opcao : null,
  });

  // Save opcaoResposta in the database
  opcaoResposta
      .save(opcaoResposta)
      .then(data => {
        Pergunta
        .findById(id)
        .then(pergunta => {
            if (!pergunta) {
                res.status(404).send({
                    message: `A entidade Item com id ${id} não encontrada, por isso não pode ser atualizada!`
                });
            } else {
              console.log(pergunta.opcaoResposta);
              pergunta.opcaoResposta.push(data.id);
                 res.send(pergunta);
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
  
};*/
/*
exports.createResposta = (req, res) => {
  const id = req.query.pergunta;
  const currentIDUser = req.query.user;
  console.log(currentIDUser)

  const resposta = new Resposta({
    usuario: req.body.usuario ? req.body.usuario : null,
    resposta: req.body.resposta ? req.body.resposta : null,
    idPergunta: req.body.idPergunta ? req.body.idPergunta : null,
  });

  Pergunta.findById(id).then(data => {
    teste = data.resposta;
    teste.forEach(idResposta => {
      Resposta.findById(idResposta).then(respostaEncontrada => {
        //console.log("resposta"+respostaEncontrada)
        if(respostaEncontrada.usuario == currentIDUser){
          console.log('entrou')
          res.status(500).send({
            message:"Nao pode ser salva mais de uma resposta com o mesmo usuario."
            
        });
        //console.log(currentIDUser)
        }
      })
    })
  })

  // Save resposta in the database
  resposta
      .save(resposta)
      .then(data => {
        Pergunta
        .findById(id)
        .then(pergunta => {
            if (!pergunta) {
                res.status(404).send({
                    message: `A entidade Item com id ${id} não encontrada, por isso não pode ser atualizada!`
                });
            } else {
                console.log(pergunta.resposta);
                pergunta.resposta.push(data.id);
                  res.send(pergunta);
              
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
};*/
/*
exports.findOpcaoResposta = (req, res) => {
  const id = req.params;
  Pergunta.findById(id).then( data => {
    res.send(data.opcaoResposta);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Algum erro desconhecido ocorreu ao buscar Pergunta por obrigatoria true."
    });
});
}*/

exports.createAlternativa = async (req, res) => {
  try {
    const perguntaId = req.params.id;
    const alternativa = {
      codigoAlternativa: req.body.codigoAlternativa,
      descricaoAlternativa: req.body.descricaoAlternativa
    };
    const pergunta = await Pergunta.findById(perguntaId);
    if (!pergunta) {
      return res.status(404).send({
        message: `Pergunta with id ${perguntaId} not found.`
      });
    }
    pergunta.alternativa.push(alternativa);
    await pergunta.save();
    res.send(pergunta);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error adding alternativa to pergunta.'
    });
  }
}

exports.updateAlternativa = async (req, res) => {
  try {
    const perguntaID = req.body.id;
    const alternativaNova =  req.body.alternativa;

    Pergunta.findById(perguntaID);
    if(!pergunta){
      return res.status(404).send({
        message: `Pergunta with id ${perguntaId} not found.`
      });
    }

    // Verifique se os dados necessários estão presentes na solicitação
    if (!alternativaNova.codigoAlternativa || !alternativaNova.descricaoAlternativa) {
      return res.status(400).json({ message: 'Parâmetros inválidos.' });
    }

    // Encontre a alternativa pelo códigoAlternativa no banco de dados
    const alternativa = await pergunta.alternativa.findOne({ codigoAlternativa });

    // Verifique se a alternativa existe
    if (!alternativa) {
      return res.status(404).json({ message: 'Alternativa não encontrada.' });
    }

    // Atualize a descrição da alternativa
    alternativa.descricaoAlternativa = descricaoAlternativa;

    // Salve a alternativa atualizada no banco de dados
    await alternativa.save();

    // Responda com a alternativa atualizada
    return res.status(200).json({ message: 'Alternativa atualizada com sucesso.', alternativa });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Erro ao atualizar a alternativa.' });
  }
};

exports.findAlternativas = async (req, res) => {
  // Validate request
  const id = req.params.id;

  Pergunta.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "A entidade Pergunta com id " + id + " não encontrada!" });
      else res.send(data.alternativa);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erro desconhecido ocorreu ao buscar as alternativas com o id " + id + " da Pergunta."
      });
    });
}

exports.createResposta = async (req, res) => {
  const perguntaId = req.params.id;

  try {
    const pergunta = await Pergunta.findById(perguntaId);
    
    if (!pergunta) {
      return res.status(404).send({
        message: `Pergunta with id ${perguntaId} not found.`
      });
    }

    // Verifique se já existe uma resposta do mesmo usuário
    const hasExistingResponse = pergunta.resposta.some(resposta => resposta.usuario === req.body.usuario);
    if (hasExistingResponse) {
      return res.status(400).send({
        message: "Nao pode ser salva mais de uma resposta com o mesmo usuario."
      });
    }

    // Crie um novo objeto de resposta
    const novaResposta = {
      answer: req.body.answer,
      usuario: req.body.usuario,
      quemRespondeu: req.body.quemRespondeu
    };

    // Adicione a nova resposta à pergunta
    pergunta.resposta.push(novaResposta);

    // Salve as alterações
    await pergunta.save();

    res.send(pergunta);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error adding resposta to pergunta.'
    });
  }
};

exports.groupRespostas = async (req, res) => {
  const id = req.params.id;
  const numResp = parseInt(req.params.numResp); 
  const pesoEntrevistado = parseFloat(req.params.pesoEntrevistado);
  const pesoEntrevistador = parseFloat(req.params.pesoEntrevistador);

  try {
    const pergunta = await Pergunta.findById(id);
    if (!pergunta) {
      return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
    }

    const descricaoPergunta = pergunta.descricao;

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
          idResposta: { $addToSet: "$resposta._id" }, // Usando $addToSet para criar um array de IDs únicos
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
        $facet: {
          topAnswers: [
            { $sort: { count: -1 } },
            { $limit: numResp }
          ],
          otherAnswers: [
            { $skip: numResp }
          ]
        }
      },
      {
        $project: {
          resposta: {
            $concatArrays: [
              "$topAnswers",
              [
                {
                  idResposta: "$idResposta", // Adicionando o array de IDs de resposta ao conjunto de resultados
                  answer: "Outros",
                  count: {
                    $sum: "$otherAnswers.count"
                  },
                  countEntrevistado: {
                    $sum: "$otherAnswers.countEntrevistado"
                  }, 
                  countEntrevistador: {
                    $sum: "$otherAnswers.countEntrevistador"
                  }, 
                },
                {
                  answer: "Não Respondeu",
                  count: {
                    $sum: {
                      $cond: {
                        if: { $eq: ["$answer", "Não Respondeu"] },
                        then: "$count",
                        else: 0
                      }
                    }
                  },
                  countEntrevistado: {
                    $sum: {
                      $cond: {
                        if: {
                          $and: [
                            { $eq: ["$answer", "Não Respondeu"] },
                            { $eq: ["$resposta.quemRespondeu", "entrevistado"] }
                          ]
                        },
                        then: "$count",
                        else: 0
                      }
                    }
                  },
                  countEntrevistador: {
                    $sum: {
                      $cond: {
                        if: {
                          $and: [
                            { $eq: ["$answer", "Não Respondeu"] },
                            { $eq: ["$resposta.quemRespondeu", "entrevistador"] }
                          ]
                        },
                        then: "$count",
                        else: 0
                      }
                    }
                  }
                }
              ]
            ]
          },
          descricao: descricaoPergunta,
        }
      },
      {
        $addFields: {
          resposta: {
            $concatArrays: [
              { $filter: { input: "$resposta", cond: { $ne: ["$$this.answer", "Outros"] } } },
              { $filter: { input: "$resposta", cond: { $eq: ["$$this.answer", "Outros"] } }
              }
            ]
          }
        }
      },
      {
        $addFields: {
          resposta: {
            $map: {
              input: "$resposta",
              as: "item",
              in: {
                idResposta: "$$item.idResposta", // Mantendo o array de IDs de resposta
                answer: "$$item.answer",
                count: "$$item.count",
                countEntrevistado: "$$item.countEntrevistado",
                countEntrevistador: "$$item.countEntrevistador",
                countPeso: {
                  $add: [
                    {
                      $multiply: ["$$item.countEntrevistado", pesoEntrevistado]
                    },
                    {
                      $multiply: ["$$item.countEntrevistador", pesoEntrevistador]
                    }
                  ]
                }
              }
            }
          }
        }
      }
    ];
    
    const data = await Pergunta.aggregate(_aggregate);
    
    if (!data || !data.length) {
      return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
    }

    const result = {
      descricao: data[0].descricao,
      resposta: data[0].resposta,
      idPerg: id, // Adicionando o ID da pergunta
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao buscar a entidade pergunta com o id " + id + ": " + err.message
    });
  }
};


exports.getQuestionWithResponses = async (req, res) => {
  const id = req.params.id;

  try {
    const pergunta = await Pergunta.findById(id);
    if (!pergunta) {
      return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
    }

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
        $group: {
          _id: "$_id",
          descricao: { $first: "$descricao" },
          resposta: { $push: "$resposta" }
        }
      }
    ];

    const data = await Pergunta.aggregate(_aggregate);

    if (!data || !data.length) {
      return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
    }

    const result = {
      perguntaId: pergunta._id.toString(), // Acesse o _id diretamente do objeto pergunta
      descricao: data[0].descricao,
      resposta: data[0].resposta,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao buscar a entidade pergunta com o id " + id + ": " + err.message
    });
  }
};

/*
exports.premiado = async (req, res) => {
  const id = req.params.id;
  const colocado = req.params.colocado;

  const pergunta = await Pergunta.findById(id);
  if (!pergunta) {
    return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
  }

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
  const results = [];
  let respostaMaisVotada = '';

  const data = await Pergunta.aggregate(_aggregate);
  //console.log(data[colocado - 1])
  const groupedDemograficas = {};
  if (data[colocado - 1] !== undefined) {
    const resposta =  data[colocado - 1]
      const users = resposta.usuarios;
      respostaMaisVotada = resposta.answer;

      for(let user of users){
        const demograficas = await findDemograficasWithRespostaId(user);
        for(let answer in demograficas){
          /*if(demograficas[answer][0].perguntaNoRelatorio == 'true'){
            const key = demograficas[answer][0].descricaoDemografica;
            if(!groupedDemograficas[key]){
              groupedDemograficas[key] = [];
            }
            groupedDemograficas[key].push(...demograficas[answer]);
          }
          const key = demograficas[answer][0].descricaoDemografica;
            if(!groupedDemograficas[key]){
              groupedDemograficas[key] = [];
            }
            groupedDemograficas[key].push(...demograficas[answer]);
          
        }
        console.log(groupedDemograficas)
      }
    
  }

  const agrupado = agrupando(groupedDemograficas);
  results.push({demograficas: agrupado, descricaoPergunta: pergunta.descricao, mostVotedAnswer: respostaMaisVotada});

  return res.status(200).json(results);
};*/

exports.premiado = async (req, res) => {
  const id = req.params.id;
  const colocado = req.params.colocado;

  const pergunta = await Pergunta.findById(id);
  if (!pergunta) {
    return res.status(404).json({ message: "A entidade pergunta com id " + id + " não encontrada!" });
  }

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
  const results = [];
  let respostaMaisVotada = '';

  const data = await Pergunta.aggregate(_aggregate);
  const groupedDemograficas = {};
  if (data[colocado - 1] !== undefined) { 
      const resposta =  data[colocado - 1]
      respostaMaisVotada = resposta.answer;
      const _usuarios = resposta.usuarios;

      const _aggregate2 = [
  {
    $match: {
      "respostaPergDemografica.usuario": { $in: _usuarios },
      "perguntaNoRelatorio": 'true'
    }
  },
  {
    $match: {
      "respostaPergDemografica.answerPergDemografica": { $exists: true }
    }
  },
  {
    $unwind: "$respostaPergDemografica.answerPergDemografica"
  },
  {
    $group: {
      _id: "$respostaPergDemografica.answerPergDemografica",
      answer: {$first: "$respostaPergDemografica.answerPergDemografica"},
      count: { $sum: 1},

    }
  },
  {
    $project: {
      data: {
        descPergDemografica: "$_id",
        answers: "$answers"
      },
      descPergDemografica: "descPergDemografica",
      respostaMaisVotada: resposta.answer
    }
  },

];
      const data2 = await Demografica.aggregate(_aggregate2);
      console.log(data2);

      const response = {
        data: data2,
        respostaMaisVotada: respostaMaisVotada,
        descricaoPergunta: pergunta.descricaoPergunta
      };

      res.send(response);

        //mandar um array com esse ultimo data e o respostaMaisVotada
  }

}

exports.updatedResposta = async (req, res) => {
  try {
    // Validate request
    if (!req.params.id) {
      res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
      return;
    }

    const idResposta = req.params.id;
    const novaResposta = req.params.novaResposta;
    console.log(novaResposta)
    
    // Encontre a pergunta com base no ID da resposta
    const pergunta = await Pergunta.findOne({ 'resposta._id': idResposta });

    if (!pergunta) {
      console.error('Resposta não encontrada.');
      return;
    }

    // Encontre a resposta dentro da pergunta
    const resposta = pergunta.resposta.find(r => r._id.toString() === idResposta);

    if (!resposta) {
      console.error('Resposta não encontrada.');
      return;
    }

    // Atualize a resposta com a nova resposta
    resposta.answer = novaResposta;

    // Salve as mudanças no banco de dados
    await pergunta.save();

    console.log('Resposta atualizada com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar a resposta:', error);
  }
};

exports.updatedAllRespostas = async (req, res) => {
  try {
    const idPergunta = req.params.id;
    const novaResposta = req.body.novaResposta;
    const antigaResposta = req.body.antigaResposta;
    const idsRespostas = req.body.id;

    console.log('novaResposta:', novaResposta);
    console.log('antigaResposta:', antigaResposta);
    // Encontre a pergunta com base no ID
    const pergunta = await Pergunta.findById(idPergunta);

    if (!pergunta) {
      console.error('Pergunta não encontrada.');
      return res.status(404).send({ message: 'Pergunta não encontrada.' });
    }

    // Atualize todas as respostas que possuem a resposta antiga
    pergunta.resposta.forEach((resposta) => {
      if (resposta.answer === antigaResposta) {
        console.log('Resposta antiga encontrada:', resposta);
        resposta.answer = novaResposta;
      }
    });

    // Salve o documento atualizado
    await pergunta.save();

    console.log('Respostas atualizadas com sucesso.');
    res.status(200).send({ message: 'Respostas atualizadas com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar as respostas:', error);
    res.status(500).send({ message: 'Erro ao atualizar as respostas.' });
  }
};


async function findDemograficasWithRespostaId(idUsuario) {
  const resultados = await Demografica.find({}).exec();
  const groupedResponses = resultados.reduce((acumulador, documento) => {
    const shownorelatorio = documento.perguntaNoRelatorio;
    const respostasCompleta = documento.respostaPergDemografica;
    for(let resposta of respostasCompleta){
      if(resposta.usuario == idUsuario){
        const responseObj = {
          resposta: resposta.answerPergDemografica,
          descricaoDemografica: documento.descPergDemografica,
          perguntaNoRelatorio: shownorelatorio
        };
        if(acumulador[documento.descPergDemografica]) {
          acumulador[documento.descPergDemografica].push(responseObj);
          acumulador[documento.descPergDemografica].count = (acumulador[documento.descPergDemografica].count || 0) + 1;
        } else {
          acumulador[documento.descPergDemografica] = [responseObj];
          acumulador[documento.descPergDemografica].count = 1;
        }
      }
    }
    return acumulador;
  }, {});
  return groupedResponses;
}

function agrupando(groupedDemograficas) {
  const groupedResponses = {};
  for (let key in groupedDemograficas) {
    const responses = groupedDemograficas[key];
    const grouped = responses.reduce((accumulator, response) => {
      const { resposta } = response;
      if (accumulator[resposta]) {
        accumulator[resposta].count++;
      } else {
        accumulator[resposta] = { resposta, count: 1 };
      }
      return accumulator;
    }, {});
    groupedResponses[key] = Object.values(grouped);
  }
  return groupedResponses;
}

