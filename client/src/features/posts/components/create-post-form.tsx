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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createPost } from "../api/posts.api.ts";
import {
  createPostSchema,
  type CreatePostFormValues,
} from "../schemas/create-post.schema.ts";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../utils/get-error-message";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const CreatePostForm = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const navigate = useNavigate();

  const previewUrl = useMemo(() => {
    if (!selectedImage) return "";
    return URL.createObjectURL(selectedImage);
  }, [selectedImage]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      text: "",
    },
  });

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: async () => {
      reset();
      setSelectedImage(null);
      setImageError("");
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });

      navigate("/");
    },
  });

  const onSubmit = (values: CreatePostFormValues) => {
    if (selectedImage && !ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
      setImageError("Only image files (.jpg, .jpeg, .png, .webp) are allowed.");
      return;
    }

    createPostMutation.mutate({
      text: values.text,
      image: selectedImage,
    });
  };

  return (
    <Box
      w="full"
      p={6}
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          {createPostMutation.isError ? (
            <Alert.Root status="error" borderRadius="xl">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Create post failed</Alert.Title>
                <Alert.Description>
                  {getErrorMessage(
                    createPostMutation.error,
                    "Failed to create post."
                  )}
                </Alert.Description>
              </Alert.Content>
            </Alert.Root>
          ) : null}

          <Field.Root invalid={!!errors.text}>
            <Field.Label>What's on your mind?</Field.Label>
            <Textarea
              placeholder="Write your post here..."
              {...register("text")}
            />
            <Field.ErrorText>{errors.text?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!imageError}>
            <Field.Label>Upload image</Field.Label>
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
                  alt="Selected preview"
                  maxH="320px"
                  objectFit="cover"
                />
              </Box>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedImage(null);
                  setImageError("");
                }}
              >
                Remove image
              </Button>
            </VStack>
          ) : null}

          <Button
            type="submit"
            colorPalette="blue"
            loading={createPostMutation.isPending}
            disabled={createPostMutation.isPending}
          >
            Create Post
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
