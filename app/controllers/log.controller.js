const db = require("../../models");
const Logs = db.logs;

validaCamposRequeridosLog = (req) => {
    const camposRequeridosEmpty = new Array();
    if (!req.body.editor) {
      camposRequeridosEmpty.push("editor");
  }
    return camposRequeridosEmpty;
}
// Cria e salva um novo documento para a entidade log
exports.create = (req, res) => {
  // Função para obter o endereço IP do cliente
  const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  };

  // Validate request
  if (!req.body.editor) {
    res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
    return;
  }

  // Validate required fields
  const camposRequeridosEmpty = validaCamposRequeridosLog(req);
  if (camposRequeridosEmpty.length > 0) {
    res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
    return;
  }

  // Get client IP address
  const ip = getClientIp(req);

  // Create a Contato
  const log = new Logs({
    editor: req.body.editor ? req.body.editor : null,
    dataHora: req.body.dataHora ? req.body.dataHora : null,
    tipoEvento: req.body.tipoEvento ? req.body.tipoEvento : null,
    idAlterado: req.body.idAlterado ? req.body.idAlterado : null,
    nomeCampo: req.body.nomeCampo ? req.body.nomeCampo : null,
    tabela: req.body.tabela ? req.body.tabela : null,
    valorAntigo: req.body.valorAntigo ? req.body.valorAntigo : null,
    valorNovo: req.body.valorNovo ? req.body.valorNovo : null,
    ip: ip // Adiciona o IP capturado ao log
  });

  // Save Contato in the database
  log.save(log)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocorreu um erro de servidor ao tentar salvar log."
      });
    });
};



// Procura por todas as entidades do tipo log
exports.findAll = (req, res) => {
    var condition = {};

    Logs.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Contato."
        });
      });
};

// Busca a entidade log por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Logs.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "A entidade Contato com id " + id + " não encontrada!" });
        else res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao buscar a entidade Contato com o id " + id + "."
        });
      });
};

// Altera uma entidade Contato
exports.update = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridoslog(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    Logs.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade validaCamposRequeridoslog com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade validaCamposRequeridoslog com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade validaCamposRequeridoslog com o id " + id + "."
        });
      });
};

// Remove a entidade Log por id
exports.delete = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    const id = req.params.id;

    Logs.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Logs com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Logs com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Logs com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Logs
exports.deleteAll = (req, res) => {

    Logs.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? 'Logs' : 'Logs'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Logs."
        });
      });
};

exports.findByIdPerg = (req, res) => {
  const idPerg = req.params.idPerg;

  Logs.find({idAlterado: idPerg})
    .then(data => {
      if (!data)
        res.status(404).send({ message: "A entidade Logs com idPerg " + idPerg + " não encontrada!" });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Erro desconhecido ocorreu ao buscar a entidade Logs com o idPerg " + idPerg + "."
      });
    });
}