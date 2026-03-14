import { useQuery } from "@tanstack/react-query";
import { getCommentsByPost } from "../api/comments.api";

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPost(postId),
    enabled: !!postId,
  });
};
