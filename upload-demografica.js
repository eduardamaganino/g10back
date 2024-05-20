const csv=require('csvtojson');
const db = require("./models");
const Demografica = db.demograficas;
const Enquete = db.enquetes;

const multer = require('multer');
const path = require('path');

const csvFilePath = './uploads/demografica.csv';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `./uploads/`));
    },
    filename: (req, file, cb) => {
        cb(null, 'demografica.csv');
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
    let previousDemografica = String;

    
    try {
        await csv({
            header: true
        })
        .fromFile(csvFilePath)
        .then( async(jsonObj)=>{

            for (const demografica of jsonObj) {

                if(demografica.tipo == "D"){
                    //console.log(pergunta)
                    const demograficaSalva = await this.salvarDemografica(demografica);
                    await Enquete.findOneAndUpdate({_id:id},{$push:{demografica: demograficaSalva._id}});
                    previousDemografica = demograficaSalva._id
                }else{
                    //console.log("é alternativa")
                    const alternativaSalva = await this.saveAlternativa(demografica, previousDemografica);
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

exports.salvarDemografica = async(demografica) => {
    try {
        const _demografica = new Demografica({
            codPergDemografica: demografica.codigo ? demografica.codigo : null,
            descPergDemografica: demografica.descricao ? demografica.descricao : null,
            tipoPergDemografica: demografica.tipoPergunta ? demografica.tipoPergunta : null,
             
        });
        console.log(_demografica)
        const novaDemografica = await _demografica.save(_demografica);
        return novaDemografica;
        
    } catch (error) {
        console.log("Erro ao salvar demografica! "+erro);
        return null;
    }
    
}
/*
exports.salvarAlternativa= async(alternativa, idEnquete) => {
    let aux = 0;
    Enquete.findOne({_id: idEnquete})
    .then(data => {
        for (let i = 0; i < data.demografica.length; i++) {
            Demografica.findOne({_id: data.demografica[i]})
            .then(demografica=> {
                if(demografica.codPergDemografica == alternativa.perguntaAlternativa){
                    this.saveAlternativa(alternativa, demografica._id)
                    return;
                }
            })
          }        
    })
    .catch(err => {
        console.log("Erro desconhecido ocorreu ao buscar a entidade Enquete com o id " + idEnquete + ".");
    });
}*/

exports.saveAlternativa = async(alternativaEncontrada, idDemografica) => {
    console.log(alternativaEncontrada)
    console.log(idDemografica)

    try {
        const alternativa = {
            codAlterPergDemografica: alternativaEncontrada.codigo,
            descAlterPergDemografica: alternativaEncontrada.descricao
        };
        const demografica = await Demografica.findById(idDemografica);
        if (!demografica) {
            console.log( `Demografica with id ${idDemografica} not found.`)
        }
        demografica.alternativaPergDemografica.push(alternativa);
        await demografica.save();
      } catch (error) {
        console.log(error);
        console.log( 'Error adding alternativa to Demografica.')
      }

}
