import express from "express";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv'
import cors from 'cors'

import mongoRoutes from "./routes/mongoRoutes.js";
import prismaRoutes from "./routes/mysqlRoutes.js";

dotenv.config();

var port = process.env.PORT;
const app = express();
const prisma = new PrismaClient();

app.use(cors())
app.use(express.json());

mongoose
  .connect(
    process.env.MONGO_URI 
  )
  .then(() => {
    console.log("banco de dados conectado");
  })
  .catch(() => {
    console.log("deu ruim ");
  });

app.use('/ltf', mongoRoutes);
app.use('/adU', prismaRoutes);


app.listen(port, () => {
    console.log(`Servidor rondando na porta ${process.env.PORT}`); //3002
})