"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = void 0;
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const csv_parse_1 = require("csv-parse");
// Configuração do multer para upload de arquivos
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage }).single('file');
const cleanContent = (content) => {
    // Remove quebras de linha, tabs e caracteres especiais indesejados
    return content.replace(/[\n\r\t]/g, ' ').replace(/\s\s+/g, ' ').trim();
};
const uploadDocument = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.status(400).send({ message: 'Erro no upload do arquivo', error: err.message });
            return;
        }
        const file = req.file;
        if (!file) {
            res.status(400).send({ message: 'Nenhum arquivo enviado' });
            return;
        }
        const fileType = file.mimetype;
        let fileContent;
        switch (fileType) {
            case 'text/plain':
                fileContent = file.buffer.toString('utf-8');
                fileContent = cleanContent(fileContent);
                console.log('Conteúdo do arquivo TXT:', fileContent);
                res.status(200).send({ message: 'Documento enviado com sucesso', content: fileContent });
                break;
            case 'application/pdf':
                (0, pdf_parse_1.default)(file.buffer)
                    .then(data => {
                    fileContent = data.text;
                    fileContent = cleanContent(fileContent);
                    console.log('Conteúdo do PDF:', fileContent);
                    res.status(200).send({ message: 'Documento enviado com sucesso', content: fileContent });
                })
                    .catch(error => {
                    res.status(400).send({ message: 'Erro ao processar PDF', error: error });
                });
                break;
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword':
                mammoth_1.default.extractRawText({ buffer: file.buffer })
                    .then(result => {
                    fileContent = result.value;
                    fileContent = cleanContent(fileContent);
                    console.log('Conteúdo do Word:', fileContent);
                    res.status(200).send({ message: 'Documento enviado com sucesso', content: fileContent });
                })
                    .catch(error => {
                    res.status(400).send({ message: 'Erro ao processar documento Word', error: error.message });
                });
                break;
            case 'text/csv':
            case 'application/vnd.ms-excel':
                (0, csv_parse_1.parse)(file.buffer.toString('utf-8'), { columns: true }, (error, records) => {
                    if (error) {
                        res.status(400).send({ message: 'Erro ao processar CSV', error: error.message });
                    }
                    else {
                        fileContent = JSON.stringify(records);
                        fileContent = cleanContent(fileContent);
                        console.log('Conteúdo do CSV:', fileContent);
                        res.status(200).send({ message: 'Documento enviado com sucesso', content: fileContent });
                    }
                });
                break;
            default:
                res.status(400).send({ message: 'Tipo de arquivo não suportado' });
        }
    });
};
exports.uploadDocument = uploadDocument;
