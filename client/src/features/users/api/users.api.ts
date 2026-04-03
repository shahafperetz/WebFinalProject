import { apiClient } from "../../../api/client";

export const getMyInfo = async () => {
  const res = await apiClient.get("/users/myInfo");
  return res.data;
};

export const getUserById = async (id: string) => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data;
};

export const updateMyInfo = async (data: {
  username?: string;
  image?: File | null;
}) => {
  const formData = new FormData();

  if (typeof data.username === "string") {
    formData.append("username", data.username);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await apiClient.put("/users/myInfo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
