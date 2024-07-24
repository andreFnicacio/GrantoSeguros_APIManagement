import { Request, Response } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { parse as csvParse } from 'csv-parse';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

const cleanContent = (content: string): string => {
  // Remove quebras de linha, tabs e caracteres especiais indesejados
  return content.replace(/[\n\r\t]/g, ' ').replace(/\s\s+/g, ' ').trim();
};

const sendToMicroservice = async (content: string): Promise<any> => {
  try {
    const response = await axios.post('https://wij0acdwnd.execute-api.us-east-1.amazonaws.com/dev/analises', {
      text: content,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao chamar o micro serviço: ${error}`);
  }
};

export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async (err: any) => {
    if (err) {
      res.status(400).send({ message: 'Erro no upload do arquivo', error: err });
      return;
    }

    const file = req.file;
    const secretToken = req.headers.accept; // Pegando o secretToken do header

    if (!file) {
      res.status(400).send({ message: 'Nenhum arquivo enviado' });
      return;
    }

    if (!secretToken) {
      res.status(402).send({ message: 'SecretToken não fornecido no header' });
      return;
    }

    const fileType = file.mimetype;
    let fileContent: string | undefined;

    try {
      switch (fileType) {
        case 'text/plain':
          fileContent = cleanContent(file.buffer.toString('utf-8'));
          break;

        case 'application/pdf':
          const pdfData = await pdfParse(file.buffer);
          fileContent = cleanContent(pdfData.text);
          break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          const mammothData = await mammoth.extractRawText({ buffer: file.buffer });
          fileContent = cleanContent(mammothData.value);
          break;

        case 'text/csv':
        case 'application/vnd.ms-excel':
          fileContent = await new Promise<string>((resolve, reject) => {
            csvParse(file.buffer.toString('utf-8'), { columns: true }, (error, records) => {
              if (error) {
                reject(error);
              } else {
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

      // Salvar a resposta no banco de dados
      const document = await prisma.document.create({
        data: {
          category: documentData.category,
          cnpj_contratante: documentData.cnpj_contratante,
          contracted_value: documentData.contracted_value,
          initial_validity: documentData.initial_validity,
          duration: documentData.duration,
          contratante: documentData.contratante,
          contratada: documentData.contratada,
          secretToken: secretToken as string, // Usando o secretToken do header
        },
      });

      res.status(200).send({ message: 'Documento enviado e registrado com sucesso', document });
    } catch (error) {
      res.status(403).send({ message: 'Erro ao processar o documento', error: error });
    }
  });
};

export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  const secretToken = req.headers.accept; // Pegando o secretToken do header

  if (!secretToken) {
    res.status(400).send({ message: 'SecretToken não fornecido no header' });
    return;
  }

  try {
    const documents = await prisma.document.findMany({
      where: { secretToken: secretToken as string },
    });

    res.status(200).json(documents);
  } catch (error) {
    res.status(400).send({ message: 'Erro ao buscar documentos', error: error });
  }
};

export const deleteDocuments = async (req: Request, res: Response): Promise<void> => {
  const secretToken = req.headers.accept; // Pegando o secretToken do header

  if (!secretToken) {
    res.status(400).send({ message: 'SecretToken não fornecido no header' });
    return;
  }

  try {
    await prisma.document.deleteMany({
      where: { secretToken: secretToken as string },
    });

    res.status(200).send({ message: 'Documentos apagados com sucesso' });
  } catch (error) {
    res.status(400).send({ message: 'Erro ao apagar documentos', error: error });
  }
};

