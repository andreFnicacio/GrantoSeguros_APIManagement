import express from 'express';
import { PrismaClient } from '@prisma/client';
import userRoutes from './routes/userRoutes';
import { setupSwagger } from './swagger';

const cors = require('cors');
const app = express();

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    console.log('Conectado ao banco de dados com sucesso!');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

main();
