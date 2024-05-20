const ws = require('ws');
const express = require("express");
const cors = require("cors"); 
const app = express();

var corsOptions = { 
  origin: "http://localhost:8081"
  //origin: "http://127.0.0.1:8081"
}; 

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json({
  limit: '100kb'
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://eduardadudavaz:vjPjNbBjYlcRsN3T@cluster0.sjjshrq.mongodb.net');

// mongoose -> conectada com o servidor tenant
//

// simple route
app.get("/", (req, res) => { 
  res.json({ message: "Welcome to application." }); 
}); 

//Declara Pergunta rotas
require("./routes/pergunta.routes")(app); 

//Declara Enquete rotas
require("./routes/enquete.routes")(app); 

//Declara Resposta rotas
require("./routes/resposta.routes")(app); 

//Declara Transmissao rotas
require("./routes/transmissao.routes")(app); 

//Declara Contato rotas
require("./routes/contato.routes")(app); 

//Declara Empresa rotas
require("./routes/empresa.routes")(app); 

require("./routes/demografica.routes")(app); 
require("./routes/log.routes")(app); 


//Declara Companyapplicationtoken rotas
require("./routes/companyapplicationtoken.routes")(app);


const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => console.log(message));
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});