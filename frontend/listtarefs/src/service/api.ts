import axios from "axios";

const api = axios.create({
    baseURL: 'https://listtarefs-backend.onrender.com',

    headers: {
        'Content-Type': 'application/json'
    }
})


export default api