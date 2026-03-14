import { apiClient } from "../../../api/client";
import type { PaginatedPostsResponse } from "../types/post.types";

export async function getPosts(skip = 0, limit = 10) {
  const res = await apiClient.get<PaginatedPostsResponse>("/posts", {
    params: { skip, limit },
  });
  return res.data;
}

export async function getMyPosts(skip = 0, limit = 10) {
  const res = await apiClient.get<PaginatedPostsResponse>("/posts/my", {
    params: { skip, limit },
  });
  return res.data;
}

export async function createPost(data: { text: string; image?: File | null }) {
  const formData = new FormData();
  formData.append("text", data.text);

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await apiClient.post("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function updatePost(
  id: string,
  data: { text?: string; image?: File | null }
) {
  const formData = new FormData();

  if (typeof data.text === "string") {
    formData.append("text", data.text);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await apiClient.put(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function deletePost(id: string) {
  await apiClient.delete(`/posts/${id}`);
}

export async function toggleLike(id: string) {
  const res = await apiClient.post(`/posts/${id}/like`);
  return res.data as {
    postId: string;
    likesCount: number;
    likedByMe: boolean;
  };
}
