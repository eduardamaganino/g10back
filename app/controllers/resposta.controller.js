const db = require("../../models");
const Resposta = db.respostas;

validaCamposRequeridosResposta = (req) => {
    const camposRequeridosEmpty = new Array();
    if (!req.body.resposta) {
        camposRequeridosEmpty.push("resposta");
    }
    /*
    if (!req.body.usuario) {
        camposRequeridosEmpty.push("usuario");
    }*/
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade Resposta
exports.create = (req, res) => {
    // Validate request
    if (!req.body.resposta) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosResposta(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    // Create a Resposta
    const resposta = new Resposta({
        resposta: req.body.resposta ? req.body.resposta : null,
        usuario: req.body.usuario ? req.body.usuario : null,
        idPergunta: req.body.idPergunta ? req.body.idPergunta : null,
    });

    // Save Resposta in the database
    resposta
        .save(resposta)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Resposta."
            });
        });
};

// Procura por todas as entidades do tipo Resposta
exports.findAll = (req, res) => {
    var condition = {};

    Resposta.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Resposta."
        });
      });
};

// Busca a entidade Resposta por id
exports.findOne = (req, res) => {
    // Validate request
    /*if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }*/

    const id = req.params.id;

    Resposta.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "A entidade Resposta com id " + id + " não encontrada!" });
        else res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao buscar a entidade Resposta com o id " + id + "."
        });
      });
};

// Altera uma entidade Resposta
exports.update = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosResposta(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    Resposta.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Resposta com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Resposta com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Resposta com o id " + id + "."
        });
      });
};

// Remove a entidade Resposta por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Resposta.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Resposta com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Resposta com id ${id} foi excluída com sucesso.`
          });
        }
      })
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Resposta."
        }