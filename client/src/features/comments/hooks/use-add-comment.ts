import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/comments.api";

export const useAddComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) => createComment(postId, text),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });
};
