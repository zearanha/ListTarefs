import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/adduser",async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({users})
});

router.post("/addUser", async (req, res) => {
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

router.put("/addUser/:id", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: Number(req.params.id) 
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
        id: Number(req.params.id)
      },
    });
    res.status(203).json({ message: "Usuario deletado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router