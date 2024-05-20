// const db = require("../../companyapplicationtoken.model.js");
const mongoose = require("mongoose"); 
const companyapplicationtoken = require("../../models/companyapplicationtoken.model")(mongoose); 
// const Companyapplicationtoken = db.companyapplicationtoken;

// Procura por todas as entidades do companyapplicationtoken
exports.findAll = (req, res) => {
    var condition = {};

    companyapplicationtoken.find(condition)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algum erro desconhecido ocorreu ao buscar Companyapplicationtoken."
        });
      });
};