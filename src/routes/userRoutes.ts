import { Router } from 'express';
import { createUser, loginUser, getUserByPhone } from '../controllers/userController';
import { uploadDocument, getDocuments, deleteDocuments } from '../controllers/documentController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro na criação do usuário
 */
router.post('/register', createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Faz login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Busca um usuário pelo número de telefone
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         required: true
 *         description: Número de telefone do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/', getUserByPhone);

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gerenciamento de documentos
 */

/**
 * @swagger
 * /users/ursula/upload:
 *   post:
 *     summary: Faz upload de um documento
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: accept
 *         required: true
 *         schema:
 *           type: string
 *         description: Secret token do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Documento enviado com sucesso
 *       400:
 *         description: Erro no envio do documento
 */
router.post('/ursula/upload', uploadDocument);

/**
 * @swagger
 * /users/ursula/documents:
 *   get:
 *     summary: Busca todos os documentos associados ao secret token
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: accept
 *         required: true
 *         schema:
 *           type: string
 *         description: Secret token do usuário
 *     responses:
 *       200:
 *         description: Documentos recuperados com sucesso
 *       400:
 *         description: Erro ao buscar documentos
 */
router.get('/ursula/documents', getDocuments);

/**
 * @swagger
 * /users/ursula/documents:
 *   delete:
 *     summary: Apaga todos os documentos associados ao secret token
 *     tags: [Documents]
 *     parameters:
 *       - in: header
 *         name: accept
 *         required: true
 *         schema:
 *           type: string
 *         description: Secret token do usuário
 *     responses:
 *       200:
 *         description: Documentos apagados com sucesso
 *       400:
 *         description: Erro ao apagar documentos
 */
router.delete('/ursula/documents', deleteDocuments);

export default router;
