const db = require("../../models");
const Empresa = db.empresas;

validaCamposRequeridosEmpresa = (req) => {
    const camposRequeridosEmpty = new Array();
    if (!req.body.nome) {
      camposRequeridosEmpty.push("nome");
    }
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade Empresa
exports.create = (req, res) => {
    // Validate request
    if (!req.body.nome) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }
    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosEmpresa(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    // Create a Empresa
    const empresa = new Empresa({
        nome: req.body.nome ? req.body.nome : null,
        cnpj: req.body.cnpj ? req.body.cnpj : null,
        email: req.body.email ? req.body.email : null,
        telefone: req.body.telefone ? req.body.telefone : null,
    });

    // Save Empresa in the database
    empresa
        .save(empresa)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Empresa."
            });
        });
};

// Procura por todas as entidades do tipo Empresa
exports.findAll = (req, res) => {
  var condition = {};

  const nome = req.query.nome;
  if (nome) {
      condition.nome = { $regex: new RegExp(nome), $options: "i" };
  }

  Empresa.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Algum erro desconhecido ocorreu ao buscar Empresa."
      });
    });
};

// Busca a entidade Empresa por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Empresa.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "A entidade Empresa com id " + id + " não encontrada!" });
        else res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao buscar a entidade Empresa com o id " + id + "."
        });
      });
};

// Altera uma entidade Empresa
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

    Empresa.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Empresa com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Empresa com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Empresa com o id " + id + "."
        });
      });
};

// Remove a entidade Empresa por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Empresa.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Empresa com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Empresa com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Empresa com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Empresa
exports.deleteAll = (req, res) => {

    Empresa.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? 'Empresas' : 'Empresa'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Empresa."
        });
      });
};