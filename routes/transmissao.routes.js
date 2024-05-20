module.exports = app => {
    const transmissoes = require("../app/controllers/transmissao.controller.js");
    var router = require("express").Router(); 

    router.post("/emails/:id", transmissoes.sendEmails);
    
    // Create a new transmissoes 
    router.post("/", transmissoes.create); 
    // Retrieve all transmissoes 
    router.get("/", transmissoes.findAll); 
    // Retrieve a single transmissoes with id 
    router.get("/:id", transmissoes.findOne); 
    // Update a transmissoes with id 
    router.put("/:id", transmissoes.update); 
    // Delete a transmissoes with id 
    router.delete("/:id", transmissoes.delete); 
    // Create a new transmissoes 
    router.delete("/", transmissoes.deleteAll); 
    // Create a new Contatos
    router.post("/:id", transmissoes.createContato);
    app.use('/api/transmissoes', router); 
  }; 
