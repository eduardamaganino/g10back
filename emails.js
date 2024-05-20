const nodemailer = require("nodemailer"); //declarei a biblioteca
const db = require("./models");
const enqueteController = require("./app/controllers/enquete.controller");
const Enquete = db.enquetes;

const mongoose = require('mongoose');


exports.enviandoEmails = async(transmissao, idEnquete, listEmails, listIDs, listNomes ) => {

    let assunto = transmissao.assunto;
    let mensagem = transmissao.mensagem;
    let emailRemetente = transmissao.emailRemetente;


    let transporter = nodemailer.createTransport({
        //dados da conta usada para enviar os emails
        host: "SMTP.office365.com",  
        port: 587,
        secure: false,
        auth: {
            user: emailRemetente,
            pass: "#EdMa7760",
        }
    }); 

        for (let i=0; i < listEmails.length; i++){
            let email = listEmails[i];
            let nome = listNomes[i];
            let id = listIDs[i];
            let link = idEnquete+"/"+id;
            

           await transporter.sendMail({
                from: "Eduarda Vaz <eduardadudavaz@hotmail.com>",
                to: email,
                subject: assunto,
                //html: "Olá "+ nome +" "+ mensagem + " este é o link <a href="+ link"",
                html: 'Ola '+ nome + ', '+ 
                mensagem + '<p>Click <a href="http://localhost:8081/resposta/' + link + '">here</a> to reset your password</p>'
                //html: "",
                //text: 'nome: ' + nome + ' Email: ' + email + ' -- mensagem: ' +msg,
            }).then(messege => {
                console.log(messege);
            }).catch(err => {
                console.log(err);
            }); 

        }
  
        
}

