import { apiClient } from "../../../api/client";
import type {
  Comment,
  PaginatedCommentsResponse,
} from "../types/comment.types";

export async function getCommentsByPost(postId: string, skip = 0, limit = 20) {
  const res = await apiClient.get<PaginatedCommentsResponse>(
    `/posts/${postId}/comments`,
    {
      params: { skip, limit },
    }
  );

  return res.data;
}

export async function createComment(postId: string, text: string) {
  const res = await apiClient.post<Comment>(`/posts/${postId}/comments`, {
    text,
  });

  return res.data;
}

export async function updateComment(commentId: string, text: string) {
  const res = await apiClient.put<Comment>(`/comments/${commentId}`, {
    text,
  });

  return res.data;
}

export async function deleteComment(commentId: string) {
  const res = await apiClient.delete<{ message: string }>(
    `/comments/${commentId}`
  );

  return res.data;
}
