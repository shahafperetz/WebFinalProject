import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePost } from "../api/posts.api";

type UpdatePostInput = {
  id: string;
  text?: string;
  image?: File | null;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, text, image }: UpdatePostInput) =>
      updatePost(id, { text, image }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
  });
};
