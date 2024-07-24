"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocuments = exports.getDocuments = exports.uploadDocument = void 0;
const multer_1 = __importDefault(require("multer"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const mammoth_1 = __importDefault(require("mammoth"));
const csv_parse_1 = require("csv-parse");
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage }).single('file');
const cleanContent = (content) => {
    // Remove quebras de linha, tabs e caracteres especiais indesejados
    return content.replace(/[\n\r\t]/g, ' ').replace(/\s\s+/g, ' ').trim();
};
const sendToMicroservice = async (content) => {
    try {
        const response = await axios_1.default.post('https://wij0acdwnd.execute-api.us-east-1.amazonaws.com/dev/analises', {
            text: content,
        });
        return response.data;
    }
    catch (error) {
        throw new Error(`Erro ao chamar o micro serviço: ${error}`);
    }
};
const uploadDocument = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).send({ message: 'Erro no upload do arquivo', error: err });
            return;
        }
        const file = req.file;
        if (!file) {
            res.status(400).send({ message: 'Nenhum arquivo enviado' });
            return;
        }
        const fileType = file.mimetype;
        let fileContent;
        try {
            switch (fileType) {
                case 'text/plain':
                    fileContent = cleanContent(file.buffer.toString('utf-8'));
                    break;
                case 'application/pdf':
                    const pdfData = await (0, pdf_parse_1.default)(file.buffer);
                    fileContent = cleanContent(pdfData.text);
                    break;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                case 'application/msword':
                    const mammothData = await mammoth_1.default.extractRawText({ buffer: file.buffer });
                    fileContent = cleanContent(mammothData.value);
                    break;
                case 'text/csv':
                case 'application/vnd.ms-excel':
                    fileContent = await new Promise((resolve, reject) => {
                        (0, csv_parse_1.parse)(file.buffer.toString('utf-8'), { columns: true }, (error, records) => {
                            if (error) {
                                reject(error);
                            }
                            else {
                                resolve(cleanContent(JSON.stringify(records)));
                            }
                        });
                    });
                    break;
                default:
                    res.status(400).send({ message: 'Tipo de arquivo não suportado' });
                    return;
            }
            // Enviar o conteúdo para o micro-serviço da Ursula
            const responseFromMicroservice = await sendToMicroservice(fileContent);
            const documentData = JSON.parse(responseFromMicroservice.body);
            console.log('Dados recebidos do micro-serviço:', documentData);
            // Salvar a resposta no banco de dados
            const document = await prisma.document.create({
                data: {
                    category: documentData.category,
                    cnpj_contratante: documentData.cnpj_contratante,
                    contracted_value: documentData.contracted_value,
                    initial_validity: documentData.initial_validity || null,
                    duration: documentData.duration || null, // Adicionando valor padrão para campo opcional
                    contratante: documentData.contratante,
                    contratada: documentData.contratada,
                },
            });
            res.status(200).send({ message: 'Documento enviado e registrado com sucesso', document });
        }
        catch (error) {
            console.error('Erro ao processar o documento:', error);
            res.status(403).send({ message: 'Erro ao processar o documento', error: error });
        }
    });
};
exports.uploadDocument = uploadDocument;
const getDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany();
        res.status(200).json(documents);
    }
    catch (error) {
        res.status(400).send({ message: 'Erro ao buscar documentos', error: error });
    }
};
exports.getDocuments = getDocuments;
const deleteDocuments = async (req, res) => {
    const secretToken = req.headers.accept; // Pegando o secretToken do header
    if (!secretToken) {
        res.status(400).send({ message: 'SecretToken não fornecido no header' });
        return;
    }
    try {
        await prisma.document.deleteMany();
        res.status(200).send({ message: 'Documentos apagados com sucesso' });
    }
    catch (error) {
        res.status(400).send({ message: 'Erro ao apagar documentos', error: error });
    }
};
exports.deleteDocuments = deleteDocuments;
