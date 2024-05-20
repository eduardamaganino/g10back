module.exports = app => {
    const respostas = require("../app/controllers/resposta.controller.js"); 
    var router = require("express").Router(); 
    // Create a new Resposta 
    router.post("/", respostas.create); 
    // Retrieve all respostas 
    router.get("/", respostas.findAll); 
    // Retrieve a single Resposta with id 
    router.get("/:id", respostas.findOne); 
    // Update a Resposta with id 
    router.put("/:id", respostas.update); 
    // Delete a Resposta with id 
    router.delete("/:id", respostas.delete); 
    // Create a new Resposta 
    //router.delete("/", respostas.deleteAll); 
    app.use('/api/respostas', router); 
  }; 
