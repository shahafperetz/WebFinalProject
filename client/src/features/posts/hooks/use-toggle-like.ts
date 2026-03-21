import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "../api/posts.api";

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
