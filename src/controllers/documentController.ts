import { Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { parse as csvParse } from 'csv-parse';

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const cleanContent = (content: string): string => {
  // Remove quebras de linha, tabs e caracteres especiais indesejados
  return content.replace(/[\n\r\t]/g, ' ').replace(/\s\s+/g, ' ').trim();
};

export const uploadDocument = (req: Request, res: Response): void => {
  upload(req, res, (err: any) => {
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
    let fileContent: string | undefined;

    switch (fileType) {
      case 'text/plain':
        fileContent = file.buffer.toString('utf-8');
        fileContent = cleanContent(fileContent);
        console.log('Conteúdo do arquivo TXT:', fileContent);
        res.status(200).send({ message: 'Documento enviado com sucesso', content: fileContent });
        break;

      case 'application/pdf':
        pdfParse(file.buffer)
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
        mammoth.extractRawText({ buffer: file.buffer })
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
        csvParse(file.buffer.toString('utf-8'), { columns: true }, (error: Error | undefined, records: any[]) => {
          if (error) {
            res.status(400).send({ message: 'Erro ao processar CSV', error: error.message });
          } else {
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
