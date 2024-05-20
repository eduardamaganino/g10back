const db = require("../../models");
const Demografica = db.demograficas;

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

validaCamposRequeridosDemografica = (req) => {
    const camposRequeridosEmpty = new Array();
   
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade Demografica
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }
    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosDemografica(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    // Create a Demografica
    const demografica = new Demografica({     
      codPergDemografica: req.body.codPergDemografica ? req.body.codPergDemografica : null,
      descPergDemografica: req.body.descPergDemografica ? descPergDemografica : null,
      tipoPergDemografica: req.body.tipoPergDemografica ? req.body.tipoPergDemografica : null, 
      perguntaNoRelatorio: req.body.perguntaNoRelatorio ? req.body.perguntaNoRelatorio : null,
      respostaPergDemografica: req.body.respostaPergDemografica ? req.body.respostaPergDemografica.id : [],   
    });

    // Save demografica in the database
    demografica
        .save(demografica)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Demografica."
            });
        });
};

// Procura por todas as entidades do tipo Demografica
exports.findAll = (req, res) => {
  var condition = {};

  const codPergDemografica = req.query.codPergDemografica;
  if (codPergDemografica) {
      condition.codPergDemografica = { $regex: new RegExp(codPergDemografica), $options: "i" };
  }

  Demografica.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Algum erro desconhecido ocorreu ao buscar Demografica."
      });
    });
};

// Busca a entidade Demografica por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Demografica.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "A entidade Demografica com id " + id + " não encontrada!" });
        else res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao buscar a entidade Demografica com o id " + id + "."
        });
      });
};

// Altera uma entidade Demografica
exports.update = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosEmpresa(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    Demografica.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Demografica com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Demografica com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Demografica com o id " + id + "."
        });
      });
};

// Remove a entidade Demografica por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Demografica.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Demografica com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Demografica com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Demografica com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Demografica
exports.deleteAll = (req, res) => {

  Demografica.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? 'Demograficas' : 'Demografica'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Demografica."
        });
      });
};

exports.createResposta = async (req, res) => {
  const demograficaID = req.params.id;

  try {
    const demografica = await Demografica.findById(demograficaID);
    
    if (!demografica) {
      return res.status(404).send({
        message: `Demografica with id ${demograficaID} not found.`
      });
    }

    // Verifique se já existe uma resposta do mesmo usuário
    const hasExistingResponse = demografica.respostaPergDemografica.some(respostaPergDemografica => respostaPergDemografica.usuario === req.body.usuario);
    if (hasExistingResponse) {
      return res.status(400).send({
        message: "Nao pode ser salva mais de uma resposta com o mesmo usuario."
      });
    }

    // Crie um novo objeto de resposta
    const novaResposta = {
      answerPergDemografica: req.body.answerPergDemografica,
      usuario: req.body.usuario,
      quemRespondeu: req.body.quemRespondeu
    };

    // Adicione a nova resposta à pergunta
    demografica.respostaPergDemografica.push(novaResposta);

    // Salve as alterações
    await demografica.save();

    res.send(demografica);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error adding resposta to demografica.'
    });
  }
};

exports.createAlternativa = async (req, res) => {
  try {
    const demograficaId = req.params.id;
    const alternativa = {
      codAlterPergDemografica: req.body.codAlterPergDemografica,
      descAlterPergDemografica: req.body.descAlterPergDemografica
    };
    const demografica = await Demografica.findById(demograficaId);
    if (!demografica) {
      return res.status(404).send({
        message: `Demografica with id ${demograficaId} not found.`
      });
    }
    demografica.alternativaPergDemografica.push(alternativa);
    await demografica.save();
    res.send(demografica);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error adding alternativa to demografica.'
    });
  }
};

exports.groupRespostas = async (req, res) => {
  const id = req.params.id;
  const demografica = await Demografica.findById(id);
  try {
    if (!demografica) {
      return res.status(404).json({ message: "A entidade demografica com id " + id + " não encontrada!" });
    }

    const descPergDemografica = demografica.descPergDemografica;

    const _aggregate = [
      {
        $match: {
          _id: new ObjectId(id.toString())
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
          _id: "$respostaPergDemografica.answerPergDemografica",          
          answer: { $first: "$respostaPergDemografica.answerPergDemografica" },
          count: { $sum: 1 },
          countEntrevistado: {
            $sum: {
              $cond: [
                { $eq: ["$respostaPergDemografica.quemRespondeu", "entrevistado"] },
                1,
                0
              ]
            }
          },
          countEntrevistador: {
            $sum: {
              $cond: [
                { $eq: ["$respostaPergDemografica.quemRespondeu", "entrevistador"] },
                1,
                0
              ]
            }
          },
        }
      },
      {
        $project: {
          _id: 0,
          answer: 1,
          countEntrevistado: 1,
          countEntrevistador: 1,
          count: 1
        }
      }
    ];
    
    const data = await Demografica.aggregate(_aggregate);
    
    if (!data || !data.length) {
      return res.status(404).json({ message: "A entidade demografica com id " + id + " não encontrada!" });
    }

    const result = {
      descPergDemografica: descPergDemografica,
      respostaPergDemografica: data,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Erro ao buscar a entidade demografica com o id " + id + ": " + err.message
    });
  }
};

