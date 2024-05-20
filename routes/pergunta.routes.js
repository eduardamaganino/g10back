module.exports = app => {
  const perguntas = require("../app/controllers/pergunta.controller.js"); 
  var router = require("express").Router(); 
  const uploadPergunta = require("../upload-pergunta")
  const uploadResposta = require("../upload-resposta")

  var router = require("express").Router(); 

  router.get("/premiada/:id/:colocado", perguntas.premiado);
  router.get("/getRespostas/:id", perguntas.getQuestionWithResponses);
  router.get("/group/:id/:numResp/:pesoEntrevistado/:pesoEntrevistador", perguntas.groupRespostas);
  // Update a Pergunta with id
  router.post("/alternativa/:id", perguntas.createAlternativa);
  router.post("/resposta/:id", perguntas.createResposta);
  //upload tratar isso dentro de um arquivo
  router.post("/upload/:id", uploadPergunta.teste);
  router.post("/uploadResposta/:id", uploadResposta.teste);
  // Create a new Pergunta 
  router.post("/", perguntas.create); 
  // Retrieve all perguntas 
  router.get("/", perguntas.findAll);
  // Retrieve a single Pergunta with id
  router.get("/:id", perguntas.findOne);
  // Update a Pergunta with id
  router.put("/:id", perguntas.update);
  router.put("/updateResposta/:id/:novaResposta", perguntas.updatedResposta);
  router.put("/updateRespostaAll/:id", perguntas.updatedAllRespostas);
  router.put("/updateAlternativa/:id", perguntas.updateAlternativa)
  // Delete a Pergunta with id
  router.delete("/:id", perguntas.delete);
  // Create a new Pergunta
  router.delete("/", perguntas.deleteAll);
  //colocar o segundo id
  router.get("/alternativaFind/:id", perguntas.findAlternativas);
  app.use('/api/perguntas', router);
};
