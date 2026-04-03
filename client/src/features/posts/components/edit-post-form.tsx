import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
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
import { getErrorMessage } from "../../../utils/get-error-message";

type EditPostFormProps = {
  post: Post;
  onSuccess?: () => void;
};

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const EditPostForm = ({ post, onSuccess }: EditPostFormProps) => {
  const updatePostMutation = useUpdatePost();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");

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
    if (selectedImage && !ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
      setImageError("Only image files (.jpg, .jpeg, .png, .webp) are allowed.");
      return;
    }

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
        {updatePostMutation.isError ? (
          <Alert.Root status="error" borderRadius="xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Update post failed</Alert.Title>
              <Alert.Description>
                {getErrorMessage(
                  updatePostMutation.error,
                  "Failed to update post."
                )}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        <Field.Root invalid={!!errors.text}>
          <Field.Label>Edit post text</Field.Label>
          <Textarea {...register("text")} placeholder="Update your post..." />
          <Field.ErrorText>{errors.text?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!imageError}>
          <Field.Label>Replace image</Field.Label>
          <Input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            p={1}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;

              if (!file) {
                setSelectedImage(null);
                setImageError("");
                return;
              }

              if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setSelectedImage(null);
                setImageError(
                  "Only image files (.jpg, .jpeg, .png, .webp) are allowed."
                );
                return;
              }

              setImageError("");
              setSelectedImage(file);
            }}
          />
          <Field.ErrorText>{imageError}</Field.ErrorText>
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

            {selectedImage ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedImage(null);
                  setImageError("");
                }}
              >
                Remove selected image
              </Button>
            ) : null}
          </VStack>
        ) : null}

        <Button
          type="submit"
          colorPalette="blue"
          loading={updatePostMutation.isPending}
          disabled={updatePostMutation.isPending}
        >
          Save Changes
        </Button>
      </Stack>
    </form>
  );
};
