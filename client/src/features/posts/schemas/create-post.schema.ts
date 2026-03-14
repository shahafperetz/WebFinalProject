import { z } from "zod";

export const createPostSchema = z.object({
  text: z
    .string()
    .min(1, "Post text is required")
    .min(2, "Post text is too short"),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
