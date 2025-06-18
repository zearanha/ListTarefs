import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
    tarefa:{
        type: String,
        required: true,
    },
    dataInicio: {
        type: Date,
        required: true,
    },
    dataFim: {
        type: Date,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    }
})

export default mongoose.model('listTaref', listSchema, 'ListTarefs')