import { apiClient } from "../../../api/client";
import type { PaginatedCommentsResponse } from "../types/comment.types";

export async function getCommentsByPost(postId: string, skip = 0, limit = 20) {
  const res = await apiClient.get<PaginatedCommentsResponse>(
    `/comments/post/${postId}`,
    {
      params: { skip, limit },
    }
  );
  return res.data;
}

export async function addComment(postId: string, text: string) {
  const res = await apiClient.post(`/comments/post/${postId}`, { text });
  return res.data;
}
