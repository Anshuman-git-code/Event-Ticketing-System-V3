import axios from "axios";

const API = axios.create({
    baseURL:
        "https://x62e2mv593.execute-api.ap-south-1.amazonaws.com/prod",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = token;
    }

    return config;
});

export default API;