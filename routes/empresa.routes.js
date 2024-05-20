module.exports = app => {
    const empresas = require("../app/controllers/empresa.controller.js"); 
    var router = require("express").Router(); 
    // Create a new Empresa 
    router.post("/", empresas.create); 
    // Retrieve all Empresa 
    router.get("/", empresas.findAll); 
    // Retrieve a single Empresa with id 
    router.get("/:id", empresas.findOne); 
    // Update a Empresa with id 
    router.put("/:id", empresas.update); 
    // Delete a Empresa with id 
    router.delete("/:id", empresas.delete); 
    // Create a new Empresa 
    router.delete("/", empresas.deleteAll); 
    app.use('/api/empresas', router); 
  }; 
