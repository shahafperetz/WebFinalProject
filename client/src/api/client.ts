import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const baseURL =
  import.meta.env.MODE === "production" ? "/api" : "http://localhost:3001";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (
      (status === 401 || status === 403) &&
      window.location.pathname !== "/login"
    ) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
