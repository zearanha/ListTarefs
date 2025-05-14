import express from "express";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv'

import mongoRoutes from "./routes/mongoRoutes.js";
import prismaRoutes from "./routes/mysqlRoutes.js";

dotenv.config();

var port = process.env.PORT;
const app = express();
const prisma = new PrismaClient();

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

app.use('/listTarefs', mongoRoutes);
app.use('/addUser', prismaRoutes);


app.listen(port, () => {
    console.log(`Servidor rondando na porta ${process.env.PORT}`);
})