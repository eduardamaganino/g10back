const fs = require('fs');
const multer = require('multer');
const path = require('path');

const htmlFilePath = './uploads-pdf/file.csv';
const pdfFilePath = './uploads-pdf/filePdf.pdf';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, `./uploads-pdf/`));
    },
    filename: (req, file, cb) => {
        cb(null, 'htmltopdf.html');
    }
});

exports.transformarhtml = async(req, res) => {
    const upload = multer({ storage: storage }).single('file');
    upload(req, res, err => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
    });
}