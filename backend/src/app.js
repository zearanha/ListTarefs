import express from "express";
import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";

import mongoRoutes from "./routes/mongoRoutes.js";
import prismaRoutes from "./routes/mysqlRoutes.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://aranhafalcao10:mScHaWCsfmJXldw4@listtarefs.wav2rts.mongodb.net/ListTarefs?retryWrites=true&w=majority&appName=ListTarefs"
  )
  .then(() => {
    console.log("banco de dados conectado");
  })
  .catch(() => {
    console.log("deu ruim");
  });

app.use('/listTarefs', mongoRoutes);
app.use('/addUser', prismaRoutes);


app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
})