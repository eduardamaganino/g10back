module.exports = app => {
    const demograficas = require("../app/controllers/demografica.controller.js");
    const uploadDemografica = require("../upload-demografica")

    var router = require("express").Router();
    router.get("/groupDemo/:id", demograficas.groupRespostas);
    router.post("/respostaDemografica/:id", demograficas.createResposta);
    router.post("/alternativaDemografica/:id", demograficas.createAlternativa);
    router.post("/uploadDemografica/:id", uploadDemografica.teste);

    // Create a new Contato
    router.post("/", demograficas.create);
    // Retrieve all contatos
    router.get("/", demograficas.findAll);
    // Retrieve a single Contato with id
    router.get("/:id", demograficas.findOne);
    // Update a Contato with id
    router.put("/:id", demograficas.update);
    // Delete a Contato with id
    router.delete("/:id", demograficas.delete);
    // Create a new Contato
    router.delete("/", demograficas.deleteAll);
    app.use('/api/demograficas', router);
  };