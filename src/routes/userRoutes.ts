import { Router } from 'express';
import { createUser, loginUser, getUserByPhone } from '../controllers/userController';
import { uploadDocument } from '../controllers/documentController'; // Importando o novo controlador

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

// Rota para registrar usuário
router.post('/register', createUser);

// Rota para login de usuário
router.post('/login', loginUser);

// Rota para buscar usuário por telefone
router.get('/', getUserByPhone);

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gerenciamento de documentos
 */

/**
 * @swagger
 * /documents/upload:
 *   post:
 *     summary: Faz upload de um documento
 *     tags: [Documents]
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
router.post('/documents/upload', uploadDocument);

export default router;
