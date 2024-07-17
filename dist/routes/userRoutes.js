"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
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
router.post('/register', userController_1.createUser);
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
router.post('/login', userController_1.loginUser);
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
router.get('/', userController_1.getUserByPhone);
exports.default = router;
