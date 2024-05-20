module.exports = app => {
    const respostasPerguntas = require("../app/controllers/respostaPergunta.controller.js"); 
    var router = require("express").Router(); 
    // Create a new RespostaPergunta 
    router.post("/", respostasPerguntas.create); 
    // Retrieve all respostasPerguntas 
    router.get("/", respostasPerguntas.findAll); 
    // Retrieve a single RespostaPergunta with id 
    router.get("/:id", respostasPerguntas.findOne); 
    // Update a RespostaPergunta with id 
    router.put("/:id", respostasPerguntas.update); 
    // Delete a RespostaPergunta with id 
    router.delete("/:id", respostasPerguntas.delete); 
    // Create a new RespostaPergunta 
    router.delete("/", respostasPerguntas.deleteAll); 
    app.use('/api/respostasPerguntas', router); 
  }; 
