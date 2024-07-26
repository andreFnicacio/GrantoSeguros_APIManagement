import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  try {
    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(405).json({ error: 'Email já está em uso' });
    }
    const secretToken = password;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password,
        secretToken
      },
    });
    res.status(201).json(user);
  } catch (error) {
    if (error === 'P2002') {
      res.status(400).json({ error: 'Violação de restrição única' });
    } else {
      res.status(400).json({ error: error });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    console.log(`Tentando fazer login com o email: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      console.log(`Usuário não encontrado para o email: ${email}`);
      return res.status(401).json({ error: 'Email inválido' });
    }

    console.log(`Comparando senha fornecida: ${password}`);
    console.log(`Com senha armazenada: ${user.password}`);
    
    const isPasswordValid = password === user.password ? true : false;

    if (!isPasswordValid) {
      console.log(`Senha inválida para o email: ${email}`);
      return res.status(401).json({ error: 'Senha inválida' });
    }

    console.log(`Login bem-sucedido para o email: ${email}`);
    res.status(200).json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    console.error('Erro ao tentar fazer login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getUserByPhone = async (req: Request, res: Response) => {
  const { phone } = req.query;
  //Inputed data
  try {
    const user = await prisma.user.findFirst({
      where: { phone: String(phone) },
    });

    if (!user) {
      return res.status(200).json({ data: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

