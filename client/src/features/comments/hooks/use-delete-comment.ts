import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment } from "../api/comments.api";

type DeleteCommentInput = {
  commentId: string;
  postId: string;
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId }: DeleteCommentInput) => deleteComment(commentId),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
