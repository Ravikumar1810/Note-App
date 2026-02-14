import axios from "axios";
import { refreshToken } from "./auth.api";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9000/api",
  withCredentials: true, // needed for refresh token cookie
  timeout: 10000,
});

/**
 * In-memory access token (VERY IMPORTANT)
 *  Not in localStorage
 *  Not in sessionStorage
 */
let accessToken = null;

/**
 * Setter used after login / refresh
 */
export const setAccessToken = (token) => {
  accessToken = token;
};

/**
 * Attach access token to every request
 */
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Handle 401 → refresh token → retry request
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const data = await refreshToken();
        setAccessToken(data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(
          "Session expired. Please login again."
        );
      }
    }

    return Promise.reject(
      error?.response?.data?.message ||
        error.message ||
        "Request failed"
    );
  }
);

export default api;
