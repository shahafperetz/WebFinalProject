import { apiClient } from "./client";

export async function getMyInfo() {
  const res = await apiClient.get("/users/myInfo");
  return res.data;
}

export async function getUserById(id: string) {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
}