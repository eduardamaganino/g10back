const csv=require('csvtojson');
const db = require("./models");
const Pergunta = db.perguntas;
const Enquete = db.enquetes;
const Demografica = db.demograficas;
const Resposta = db.respostasNovas;

const multer = require('multer');
const path = require('path');

const csvFilePath = './uploads/Respostas59-116.csv';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `./uploads/`));
    },
    filename: (req, file, cb) => {
        cb(null, 'Respostas59-116.csv');
    }
});

exports.teste = async(req, res) => {
    const upload = multer({ storage: storage }).single('file');
    const id = req.params.id;
    console.log(id);
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

            for (const resposta of jsonObj) {
                Enquete.findById(id).then(data => {
                    //console.log(jsonObj[0].header);
                    const respostaSalva = this.salvarResposta(resposta, data.pergunta);
                })
                //await Pergunta.findOneAndUpdate({_id:id},{$push:{resposta: respostaSalva}});
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

exports.salvarResposta = async(resposta, perguntas) => {
    try {
        const array = ['6602fc7edbe13fa29eaae5df',
            '6602fc7fdbe13fa29eaae621',
            '6602fc80dbe13fa29eaae658',
            '6602fc80dbe13fa29eaae68f',
            '6602fc81dbe13fa29eaae6dd',
            '6602fc83dbe13fa29eaae857',
            '6602fc83dbe13fa29eaae884',
            '6602fc84dbe13fa29eaae8c6',
            '6602fc84dbe13fa29eaae921',
            '6602fc85dbe13fa29eaae945',
            '6602fc86dbe13fa29eaae9bd',
            '6602fc87dbe13fa29eaaea18',
            '6602fc87dbe13fa29eaaea34',
            '6602fc88dbe13fa29eaaea82',
            '6602fc89dbe13fa29eaaeaaf',
            '6602fc89dbe13fa29eaaeb0a',
            '6602fc8bdbe13fa29eaaeb92',
            '6602fc8cdbe13fa29eaaebd4',
            '6602fc8ddbe13fa29eaaec3d',
            '6602fc8edbe13fa29eaaec74',
            '6602fc90dbe13fa29eaaecec',
            '6602fc90dbe13fa29eaaed55',
            '6602fc91dbe13fa29eaaedee',
            '6602fc92dbe13fa29eaaee3c',
            '6602fc95dbe13fa29eaaef50',
            '6602fc95dbe13fa29eaaefb9',
            '6602fc96dbe13fa29eaaefdd',
            '6602fc99dbe13fa29eaaf1ed',
            '6602fc9bdbe13fa29eaaf298',
            '6602fc9fdbe13fa29eaaf4eb',
            '6602fca3dbe13fa29eaaf5bd',
            '6602fca3dbe13fa29eaaf5e1',
            '6602fca5dbe13fa29eaaf75b',
            '6602fca8dbe13fa29eaaf86f',
            '6602fca9dbe13fa29eaaf8bd',
            '6602fcaadbe13fa29eaaf918',
            '6602fcacdbe13fa29eaaf990',
            '6602fcaddbe13fa29eaaf99f',
            '6602fcaddbe13fa29eaaf9bb',
            '6602fcaddbe13fa29eaaf9d0',
            '6602fcafdbe13fa29eaafab7',
            '6602fcb1dbe13fa29eaafbb4',
            '6602fcb2dbe13fa29eaafcc8',
            '6602fcb3dbe13fa29eaafd0a',
            '6602fcb3dbe13fa29eaafd65',
            '6602fcb4dbe13fa29eaafdce',
            '6602fcb5dbe13fa29eaafdf2',
            '6602fcb6dbe13fa29eaafe34',
            '6602fcbadbe13fa29eaafe8f',
            '6602fcbbdbe13fa29eaafeab',
            '6602fcbcdbe13fa29eaaff7d',
            '6602fcc1dbe13fa29eab0028',
            '6602fcc4dbe13fa29eab00fa',
            '6602fcc4dbe13fa29eab010f',
            '6602fcc5dbe13fa29eab01ba',
            '6602fcc6dbe13fa29eab01e7',
            '6602fcc6dbe13fa29eab021e',
            '6602fcc7dbe13fa29eab0279']
        
        for(const i of array){
            //console.log(resposta[i]);
            const _resposta = ({
                usuario: resposta.CODIGO ? resposta.CODIGO : null,
                answer: resposta[i],
                quemRespondeu: 'entrevistador',
            });

            _resposta.answerPergDemografica = resposta[i]
            Pergunta.findById(i).then(data => {
                data.resposta.push(_resposta);
                console.log(data);
                data.save();
            })
            
        }
        
        
    } catch (error) {
        //console.log("Erro ao salvar pergunta! "+erro);
        return null;
    }

}


/*
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

}*/
