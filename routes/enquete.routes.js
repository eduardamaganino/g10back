module.exports = app => {
  const enquetes = require("../app/controllers/enquete.controller.js"); 
  var router = require("express").Router();
  const relatorioPremiada = require("../relatorioPremiada.js") 
  const relatorioAllCategorias = require("../relatorioAllCategorias.js")
  const relatorioAllRespostas = require("../relatorioAllRespostas.js")
  
  router.get("/pdfpremiada/:id/:colocado", relatorioPremiada.teste);
  router.get("/pdfcategorias/:id", relatorioAllCategorias.pegarEnquete);
  router.get("/pdfallresp/:id", relatorioAllRespostas.pegarEnquete);
  
  router.get("/pdfs/:file", relatorioPremiada.baixar);
  router.get("/aggregateDemografica:id", enquetes.findOneAggregateDemografica);

  //Test
  router.get("/aggregate:id", enquetes.findOneAggregate);

  // Create a new Enquete 
  router.post("/", enquetes.create); 
  // Retrieve all enquetes 
  router.get("/", enquetes.findAll); 
  // Retrieve a single Enquete with id 
  router.get("/:id", enquetes.findOne); 
  // Update a Enquete with id 
  router.put("/:id", enquetes.update); 
  // Delete a Enquete with id 
  router.delete("/:id", enquetes.delete); 
  // Create a new Enquete 
  router.delete("/", enquetes.deleteAll); 
  router.post("/transmissao/:id", enquetes.createTransmissao);
  router.post("/demografica/:id", enquetes.createDemografica);

  router.post("/:id", enquetes.createPergunta);
  
  app.use('/api/enquetes', router);
}; 
