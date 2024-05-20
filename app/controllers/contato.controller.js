const db = require("../../models");
const Contato = db.contatos;

validaCamposRequeridosContato = (req) => {
    const camposRequeridosEmpty = new Array();
    if (!req.body.email) {
      camposRequeridosEmpty.push("email");
  }
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade Contato
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
    return;
}
    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosContato(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    // Create a Contato
    const contato = new Contato({
        email: req.body.email ? req.body.email : null,
        nome: req.body.nome ? req.body.nome : null,
        telefone: req.body.telefone ? req.body.telefone : null,
    });

    // Save Contato in the database
    contato
        .save(contato)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Contato."
            });
        });
};

// Procura por todas as entidades do tipo Contato
exports.findAll = (req, res) => {
    var condition = {};

    Contato.find(condition)
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

// Busca a entidade Contato por id
exports.findOne = (req, res) => {
    

    const id = req.params.id;

    Contato.findById(id)
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
    const camposRequeridosEmpty = validaCamposRequeridosContato(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    Contato.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Contato com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Contato com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Contato com o id " + id + "."
        });
      });
};

// Remove a entidade Contato por id
exports.delete = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    const id = req.params.id;

    Contato.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Contato com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Contato com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Contato com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Contato
exports.deleteAll = (req, res) => {

    Contato.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? 'Contatos' : 'Contato'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Contato."
        });
      });
};