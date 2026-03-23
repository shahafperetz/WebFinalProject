import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Field,
  Image,
  Input,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdatePost } from "../hooks/use-update-post";
import {
  updatePostSchema,
  type UpdatePostFormValues,
} from "../schemas/update-post.schema";
import type { Post } from "../types/post.types";
import { getImageUrl } from "../../../utils/get-image-url";

type EditPostFormProps = {
  post: Post;
  onSuccess?: () => void;
};

export const EditPostForm = ({ post, onSuccess }: EditPostFormProps) => {
  const updatePostMutation = useUpdatePost();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    if (post.image) return getImageUrl(post.image);
    return "";
  }, [selectedImage, post.image]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdatePostFormValues>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      text: post.text,
    },
  });

  const onSubmit = (values: UpdatePostFormValues) => {
    updatePostMutation.mutate(
      {
        id: post._id,
        text: values.text,
        image: selectedImage,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <Field.Root invalid={!!errors.text}>
          <Field.Label>Edit post text</Field.Label>
          <Textarea {...register("text")} placeholder="Update your post..." />
          <Field.ErrorText>{errors.text?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root>
          <Field.Label>Replace image</Field.Label>
          <Input
            type="file"
            accept="image/*"
            p={1}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setSelectedImage(file);
            }}
          />
        </Field.Root>

        {previewUrl ? (
          <VStack align="start">
            <Box overflow="hidden" borderRadius="xl" w="full">
              <Image
                src={previewUrl}
                alt="Post preview"
                maxH="320px"
                objectFit="cover"
              />
            </Box>
          </VStack>
        ) : null}

        <Button
          type="submit"
          colorPalette="blue"
          loading={updatePostMutation.isPending}
        >
          Save Changes
        </Button>
      </Stack>
    </form>
  );
};
