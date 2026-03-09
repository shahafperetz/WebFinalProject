import { apiClient } from "./client";

export async function register(data: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await apiClient.post("/auth/register", data);
  return res.data;
}

export const login = async (data: { username: string; password: string }) => {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await apiClient.post("/auth/refresh");
  return res.data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout");
};
