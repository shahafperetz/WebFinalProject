import axios from "axios";
import { useAuthStore } from "../store/auth.store";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001",
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

    if (status === 401 || status === 403) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
