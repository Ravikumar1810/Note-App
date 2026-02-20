import axios from "axios";

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api",
  withCredentials: true,
  timeout: 10000,
});

export default publicApi;
