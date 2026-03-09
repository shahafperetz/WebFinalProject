import { apiClient } from "./client";

export const getMyInfo = async () => {
  const res = await apiClient.get("/users/myInfo");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
};
