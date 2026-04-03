import { apiClient } from "../../../api/client";
import type { CreatePostDto } from "../../../api/dtos/posts/create-post.dto";
import type { UpdatePostDto } from "../../../api/dtos/posts/update-post.dto";
import type {
  PaginatedPostsResponse,
  Post,
  ToggleLikeResponse,
} from "../types/post.types";

export const getPosts = async (skip = 0, limit = 10) => {
  const res = await apiClient.get<PaginatedPostsResponse>("/posts", {
    params: { skip, limit },
  });

  return res.data;
};

export const getMyPosts = async (skip = 0, limit = 10) => {
  const res = await apiClient.get<PaginatedPostsResponse>("/posts/my", {
    params: { skip, limit },
  });

  return res.data;
};

export const createPost = async (data: CreatePostDto) => {
  const formData = new FormData();
  formData.append("text", data.text);

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await apiClient.post<Post>("/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updatePost = async (id: string, data: UpdatePostDto) => {
  const formData = new FormData();

  if (typeof data.text === "string") {
    formData.append("text", data.text);
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  const res = await apiClient.put<Post>(`/posts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deletePost = async (id: string) => {
  await apiClient.delete(`/posts/${id}`);
};

export const toggleLike = async (id: string) => {
  const res = await apiClient.post<ToggleLikeResponse>(`/posts/${id}/like`);
  return res.data;
};
