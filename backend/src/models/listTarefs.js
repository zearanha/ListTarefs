import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    tarefa:{
        type: String,
        required: true,
    },
    timing:{
        type: String,
        required: true,
    }
})

export default mongoose.model('listTaref', listSchema, 'ListTarefs')