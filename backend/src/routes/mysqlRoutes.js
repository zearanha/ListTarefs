import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { use } from "react";

const SECRET_KEY = process.env.JWT_SECRET || 'Sua_chave_secreta_muito_segura';
const prisma = new PrismaClient();
const router = express.Router();

router.get("/adduser", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ users });
});

router.get("/adduser/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

router.post("/user", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashPassword,
      },
    });
    res.status(201).json({ message: "User criado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Prencha todos os campos" });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user)
      return res.status(401).json({ message: "Usuario não encontrado" });

    const isnameValid = user.name === name;
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isnameValid && isPasswordValid) {
      
      const token = jwt.sign(
        {userId: user.id, email: user.email}, SECRET_KEY, { expiresIn: '1h'}
      );
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({ message: "Login efetuado com sucesso", token, user: userWithoutPassword, data: user });
    } else {
      return res.status(401).json({ message: "Informações incorretas" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/addUser/:id", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        email: email,
        name: name,
        password: hashPassword,
      },
    });
    res.status(204).json({ message: "Usuario atualizado " });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/addUser/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(203).json({ message: "Usuario deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
