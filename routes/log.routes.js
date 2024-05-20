module.exports = app => {
    const logs = require("../app/controllers/log.controller.js");
    var router = require("express").Router();
    var router = require("express").Router(); 

    // Create a new Contato
    router.post("/", logs.create);
    // Retrieve all contatos
    router.get("/", logs.findAll);
    // Retrieve a single Contato with id
    router.get("/:id", logs.findOne);
    // Update a Contato with id
    router.put("/:id", logs.update);
    // Delete a Contato with id
    router.delete("/:id", logs.delete);
    // Create a new Contato
    router.delete("/", logs.deleteAll);
    router.get("/findIdPerg/:idPerg", logs.findByIdPerg);
    app.use('/api/logs', router);
  };