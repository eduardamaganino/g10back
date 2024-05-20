const csv=require('csvtojson');
const db = require("./models");
const Contato = db.contatos;
const Transmissao = db.transmissoes;

const multer = require('multer');
const path = require('path');

const csvFilePath = './uploads/csv.csv';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `./uploads/`));
    },
    filename: (req, file, cb) => {
        cb(null, 'csv.csv');
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
    
    try {
        await csv({
            header: true
        })
        .fromFile(csvFilePath)
        .then( async(jsonObj)=>{
            // console.log(jsonObj);
    
            for (const contato of jsonObj) {
                
                const contatoSalvo = await this.salvarContato(contato);

                await Transmissao.findOneAndUpdate({_id:id},{$push:{contato: contatoSalvo._id}});
            }  
        });

        res.status(200).send({
            message: `Deu bom!`
        });
    } catch (error) {
        res.status(404).send({
            message: `Deu ruim!`
        });
    }
}

exports.salvarContato = async(contato) => {

    try {
        const _contato = new Contato({
            email: contato.email ? contato.email : null,
            nome: contato.nome ? contato.nome : null,
            telefone: contato.telefone ? contato.telefone : null,
        });

        const novoContato = await _contato.save(_contato);
        return novoContato;
    } catch (error) {
        console.log("Erro ao salvar contato! "+erro);
        return null;
    }
}

