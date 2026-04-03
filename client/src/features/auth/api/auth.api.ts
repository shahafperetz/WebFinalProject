import { apiClient } from "../../../api/client";

export const login = async (data: { username: string; password: string }) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export const register = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

export const googleLogin = async (credential: string) => {
  const response = await apiClient.post("/auth/google", {
    credential,
  });

  return response.data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout");
};

export const refreshToken = async () => {
  const res = await apiClient.post("/auth/refresh");
  return res.data;
};
