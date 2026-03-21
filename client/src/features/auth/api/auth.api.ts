import { apiClient } from "../../../api/client";

export async function login(data: { username: string; password: string }) {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
}) {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
}

export async function googleLogin(credential: string) {
  const response = await apiClient.post("/auth/google", {
    credential,
  });

  return response.data;
}

export async function logout() {
  await apiClient.post("/auth/logout");
}

export const refreshToken = async () => {
  const res = await apiClient.post("/auth/refresh");
  return res.data;
};
