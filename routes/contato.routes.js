module.exports = app => {
    const contatos = require("../app/controllers/contato.controller.js");
    var router = require("express").Router();
    const teste = require("../teste")
    const uploadContato = require("../upload-contato")
    var router = require("express").Router(); 

    router.post("/:id", teste.teste);
    // Create a new Contato with csv
    router.post("/upload/:id", uploadContato.teste);
    // Create a new Contato
    router.post("/", contatos.create);
    // Retrieve all contatos
    router.get("/", contatos.findAll);
    // Retrieve a single Contato with id
    router.get("/:id", contatos.findOne);
    // Update a Contato with id
    router.put("/:id", contatos.update);
    // Delete a Contato with id
    router.delete("/:id", contatos.delete);
    // Create a new Contato
    router.delete("/", contatos.deleteAll);
    app.use('/api/contatos', router);
  };