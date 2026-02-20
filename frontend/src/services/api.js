import axios from "axios";
import { refreshToken } from "./auth.api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api",
  withCredentials: true, 
  timeout: 10000,
});


let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};


api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //  Don't retry for refresh token
    if (
      error.response?.status === 401 &&
      originalRequest.url.includes("/verifyToken")
    ) {
      return Promise.reject(error);
    }

    //  Retry once for other APIs
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/verifyToken");
        console.log("Token refreshed:", res.data); // Debug log

        const newAccessToken = res.data.accessToken;
        console.log("New access token:", newAccessToken); // Debug log


        // update header
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
