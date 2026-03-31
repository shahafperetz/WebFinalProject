import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../api/comments.api";

type UpdateCommentInput = {
  commentId: string;
  postId: string;
  text: string;
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, text }: UpdateCommentInput) =>
      updateComment(commentId, text),
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
