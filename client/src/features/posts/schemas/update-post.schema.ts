import { z } from "zod";

export const updatePostSchema = z.object({
  text: z
    .string()
    .min(1, "Post text is required")
    .min(2, "Post text is too short")
    .optional(),
});

export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;
