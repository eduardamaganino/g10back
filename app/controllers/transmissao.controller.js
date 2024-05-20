const db = require("../../models");
const Transmissao = db.transmissoes;
const Contato = db.contatos;
const contatosController = require("./contato.controller");
const emails = require("../../emails");
const Enquete = db.enquetes;

const mongoose = require('mongoose');

validaCamposRequeridosTransmissao = (req) => {
    const camposRequeridosEmpty = new Array();
    if (!req.body.nome) {
        camposRequeridosEmpty.push("nome");
    }
    return camposRequeridosEmpty;
}

// Cria e salva um novo documento para a entidade Transmissao
exports.create = (req, res) => {
   // Validate request
    if (!req.body.nome) {
      res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
      return;
  }
    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosTransmissao(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    // Create a Transmissao
    const transmissao = new Transmissao({
        nome: req.body.nome ? req.body.nome : null,
        assunto: req.body.assunto ? req.body.assunto : null,
        mensagem: req.body.mensagem ? req.body.mensagem : null,
        emailRemetente: req.body.emailRemetente ? req.body.emailRemetente : null,
        contato: req.body.contato ? req.body.contato : [],
    });

    // Save Transmissao in the database
    transmissao
        .save(transmissao)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro de servidor ao tentar salvar Transmissao."
            });
        });
};

// Procura por todas as entidades do tipo Transmissao
exports.findAll = (req, res) => {
    var condition = {};

    Transmissao.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Transmissao."
        });
      });
};

// Busca a entidade Transmissao por id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Transmissao.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "A entidade Transmissao com id " + id + " não encontrada!" });
        else res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao buscar a entidade Transmissao com o id " + id + "."
        });
      });
};

// Altera uma entidade Transmissao
exports.update = (req, res) => {
    // Validate request
    if (!req.body.id) {
        res.status(400).send({ message: "Conteúdo não pode ser vazio!" });
        return;
    }

    // Validate required fields
    const camposRequeridosEmpty = validaCamposRequeridosTransmissao(req);
    if (camposRequeridosEmpty.length > 0) {
        res.status(400).send({ message: "Campos requeridos ("+camposRequeridosEmpty.join(",") + ") não podem ser vazios!" });
        return;
    }

    const id = req.params.id;

    Transmissao.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Transmissao com id ${id} não encontrada, por isso não pode ser atualizada!`
          });
        } else res.send({ message: `A entidade Transmissao com id ${id} foi alterada com sucesso.` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao alterar a entidade Transmissao com o id " + id + "."
        });
      });
};

// Remove a entidade Transmissao por id
exports.delete = (req, res) => {
    const id = req.params.id;

    Transmissao.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `A entidade Transmissao com id ${id} não encontrada, por isso não pode ser excluida!`
          });
        } else {
          res.send({
            message: `A entidade Transmissao com id ${id} foi excluída com sucesso.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao excluir a entidade Transmissao com o id " + id + "."
        });
      });
};

// Exclui todos os registros da entidade Transmissao
exports.deleteAll = (req, res) => {

    Transmissao.deleteMany({})
      .then(data => {
        res.send({
          message: `${data.deletedCount} ${data.deletedCount > 1 ? 'Transmissoes' : 'Transmissao'}  foram excluídas!`
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao excluir todas as entidades Transmissao."
        });
      });
};

exports.createContato = (req, res) => {
  const id = req.params.id;
  
     // Create o Contato
  const contato = new Contato({
    email: req.body.email ? req.body.email : null,
    nome: req.body.nome ? req.body.nome : null,
    telefone: req.body.telefone ? req.body.telefone : null,   
  });
  
  // Save Contato in the database
  contato
      .save(contato)
      .then(data => {
        Transmissao
        .findById(id)
        .then(transmissao => {          
            if (!transmissao) {
                res.status(404).send({
                    message: `A entidade Item com id ${id} não encontrada, por isso não pode ser atualizada!`
                });
            } else {
              transmissao.contato.push(data.id);
              res.send(transmissao);
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
              err.message || "Ocorreu um erro de servidor ao tentar salvar Contato."
          });
      });    
};

exports.sendEmails = async(req, res) => {
  let idEnquete = req.params.id;
  let transmissao = req.body;
  let arrayIdContato = req.body.contato;
  var listEmails = [];
  var listNomes = [];
  var listIDs = [];

  for  (i = 0; i < arrayIdContato.length; i++) {
   await Contato.findById(arrayIdContato[i])
      .then(data => {
        if (!data){
          res.status(404).send({ message: "A entidade Contato com id " + id + " não encontrada!" });
        } else {
         listEmails[i] = data.email;
         listNomes[i] = data.nome;
         listIDs[i] = data.id;
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Erro desconhecido ocorreu ao buscar a entidade Contato com o id " + id + "."
        });
      });
    }
   emails.enviandoEmails(transmissao, idEnquete, listEmails, listIDs, listNomes);

}