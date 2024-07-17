"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByPhone = exports.loginUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createUser = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
};
exports.loginUser = loginUser;
const getUserByPhone = async (req, res) => {
    const { phone } = req.query;
    try {
        const user = await prisma.user.findFirst({
            where: { phone: String(phone) },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({ error: error });
    }
};
exports.getUserByPhone = getUserByPhone;
