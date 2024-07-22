"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const swagger_1 = require("./swagger");
const cors = require('cors');
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(cors());
app.use(express_1.default.json());
(0, swagger_1.setupSwagger)(app);
app.use('/users', userRoutes_1.default);
const PORT = process.env.PORT || 3000;
async function main() {
    try {
        await prisma.$connect();
        console.log('Conectado ao banco de dados com sucesso!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
}
main();
