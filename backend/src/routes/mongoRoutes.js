import express from "express";
import mongoose from "mongoose";

import listTarefs from "../models/listTarefs.js";

const router = express.Router();

router.get("/listTarefs", async (req, res) => {
  try {
    const listers = await listTarefs.find();
    return res.status(200).json(listers);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/listTarefs", async (req, res) => {
  try {
    const list = req.body;

    const newList = await listTarefs.create(list);

    return res.status(201).json(newList);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.put("/listTarefs/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedList = await listTarefs.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedList) {
      return res.status(404).json({ message: "Tarefa não encontrada" });
    }
    return res.status(200).json(updatedList);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.delete('/listTarefs/:id', async (req, res) => {
    const { id } = req.params

    try{
        const deleteList = await listTarefs.findByIdAndDelete(id)
        if(!deleteList){
            return res.status(404).json({ message: 'Tarefa não encontrada' })
        }
        return res.status(200).json({ message: 'Tarefa deletada com sucesso ' })
    }
    catch(err){
        return res.status(400).json({ message: err.message })
    }
})

export default router