import { apiClient } from "../../../api/client";
import type { CreatePostDto } from "../../../api/dtos/posts/create-post.dto";
import type { UpdatePostDto } from "../../../api/dtos/posts/update-post.dto";
import type {
  PaginatedPostsResponse,
  Post,
  ToggleLikeResponse,
} from "../types/post.types";

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

export async function createPost(data: CreatePostDto) {
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
}

export async function updatePost(id: string, data: UpdatePostDto) {
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
}

export async function deletePost(id: string) {
  await apiClient.delete(`/posts/${id}`);
}

export async function toggleLike(id: string) {
  const res = await apiClient.post<ToggleLikeResponse>(`/posts/${id}/like`);
  return res.data;
}