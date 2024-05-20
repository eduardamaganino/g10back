 const mongoose = require("mongoose"); 
 mongoose.Promise = global.Promise; 
 const db = {}; 
 db.mongoose = mongoose; 

 //Declara Pergunta
 db.perguntas = require("./pergunta.model.js")(mongoose); 

 //Declara Enquete
 db.enquetes = require("./enquete.model.js")(mongoose); 

 //Declara Resposta
 db.respostas = require("./resposta.model.js")(mongoose); 
 db.respostasNovas = require("./respostaNova.model.js")(mongoose); 
 db.demoNovas = require("./demoNova.model.js")(mongoose); 

 //Declara Transmissao
 db.transmissoes = require("./transmissao.model.js")(mongoose); 

 //Declara Contato
 db.contatos = require("./contato.model.js")(mongoose); 

 //Declara Contato
 db.empresas = require("./empresa.model.js")(mongoose); 

 //Declara Demografica
 db.demograficas = require("./demografica.model.js")(mongoose); 

 db.logs = require("./log.model.js")(mongoose); 



 module.exports = db;
