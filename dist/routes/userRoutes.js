"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const documentController_1 = require("../controllers/documentController"); // Importando o novo controlador
const router = (0, express_1.Router)();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */
// Rota para registrar usuário
router.post('/register', userController_1.createUser);
// Rota para login de usuário
router.post('/login', userController_1.loginUser);
// Rota para buscar usuário por telefone
router.get('/', userController_1.getUserByPhone);
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
router.post('/documents/upload', documentController_1.uploadDocument);
exports.default = router;
