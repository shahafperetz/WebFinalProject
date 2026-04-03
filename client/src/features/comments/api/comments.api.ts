import { apiClient } from "../../../api/client";
import type {
  Comment,
  PaginatedCommentsResponse,
} from "../types/comment.types";

export const getCommentsByPost = async (
  postId: string,
  skip = 0,
  limit = 20
) => {
  const res = await apiClient.get<PaginatedCommentsResponse>(
    `/posts/${postId}/comments`,
    {
      params: { skip, limit },
    }
  );

  return res.data;
};

export const createComment = async (postId: string, text: string) => {
  const res = await apiClient.post<Comment>(`/posts/${postId}/comments`, {
    text,
  });

  return res.data;
};

export const updateComment = async (commentId: string, text: string) => {
  const res = await apiClient.put<Comment>(`/comments/${commentId}`, {
    text,
  });

  return res.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await apiClient.delete<{ message: string }>(
    `/comments/${commentId}`
  );

  return res.data;
};
