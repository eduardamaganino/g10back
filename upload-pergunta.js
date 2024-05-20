const csv=require('csvtojson');
const db = require("./models");
const Pergunta = db.perguntas;
const Enquete = db.enquetes;

const multer = require('multer');
const path = require('path');

const csvFilePath = './uploads/pergunta.csv';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `./uploads/`));
    },
    filename: (req, file, cb) => {
        cb(null, 'pergunta.csv');
    }
});

exports.teste = async(req, res) => {
    const upload = multer({ storage: storage }).single('file');
    const id = req.params.id;
    upload(req, res, err => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
    });
    console.log(csvFilePath);
    let previousPergunta = String;

    
    try {
        await csv({
            header: true
        })
        .fromFile(csvFilePath)
        .then( async(jsonObj)=>{

            for (const pergunta of jsonObj) {

                if(pergunta.tipo == "P"){
                    //console.log(pergunta)
                    const perguntaSalva = await this.salvarPergunta(pergunta);
                    await Enquete.findOneAndUpdate({_id:id},{$push:{pergunta: perguntaSalva._id}});
                    previousPergunta = perguntaSalva._id;
                }else{
                    //console.log("é alternativa")
                    const alternativaSalva = await this.saveAlternativa(pergunta, previousPergunta);
                }

            }  
        });
        res.status(200).send({
            message: `Deu bom!`
        });
    } catch (error) {
        res.status(404).send({
            message: `Deu ruim!` + error
        });
    }
}

exports.salvarPergunta = async(pergunta) => {
    try {
        if(pergunta.bloco == "A"){
            pergunta.bloco = 1; 
        }else if(pergunta.bloco == "B"){
            pergunta.bloco = 2;
        }
        const _pergunta = new Pergunta({
             codigoPergunta: pergunta.codigo ? pergunta.codigo : null,
             descricao: pergunta.descricao ? pergunta.descricao : null,
             tipoPergunta: pergunta.tipoPergunta ? pergunta.tipoPergunta : null,
             obrigatoria: pergunta.obrigatoria ? pergunta.obrigatoria : null,
             outro: pergunta.outro ? pergunta.outro : null,
             bloco: pergunta.bloco ? pergunta.bloco : null, 
        });
        console.log(_pergunta)
        const novaPergunta = await _pergunta.save(_pergunta);
        return novaPergunta;
        
    } catch (error) {
        console.log("Erro ao salvar pergunta! "+erro);
        return null;
    }
    
}
/*
exports.salvarAlternativa= async(alternativa, idEnquete) => {
    let aux = 0;
    Enquete.findOne({_id: idEnquete})
    .then(data => {
        for (let i = 0; i < data.pergunta.length; i++) {
            Pergunta.findOne({_id: data.pergunta[i]})
            .then(pergunta=> {
                if(pergunta.codigoPergunta == alternativa.perguntaAlternativa){
                    this.saveAlternativa(alternativa, pergunta._id)
                    return;
                }
            })
          }        
    })
    .catch(err => {
        console.log("Erro desconhecido ocorreu ao buscar a entidade Enquete com o id " + idEnquete + ".");
    });
}*/

exports.saveAlternativa = async(alternativaEncontrada, idPergunta) => {
    console.log(alternativaEncontrada)
    console.log(idPergunta)

    try {
        const alternativa = {
          codigoAlternativa: alternativaEncontrada.codigo,
          descricaoAlternativa: alternativaEncontrada.descricao
        };
        const pergunta = await Pergunta.findById(idPergunta);
        if (!pergunta) {
            console.log( `Pergunta with id ${idPergunta} not found.`)
        }
        pergunta.alternativa.push(alternativa);
        await pergunta.save();
      } catch (error) {
        console.log(error);
        console.log( 'Error adding alternativa to pergunta.')
      }

}
