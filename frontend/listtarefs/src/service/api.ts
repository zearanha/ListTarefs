import axios from "axios";

const api = axios.create({
    baseURL: 'localhost:3002'
})


export default api