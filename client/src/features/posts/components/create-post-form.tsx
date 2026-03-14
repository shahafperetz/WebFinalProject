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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createPost } from "../api/posts.api.ts";
import {
  createPostSchema,
  type CreatePostFormValues,
} from "../schemas/create-post.schema.ts";
import { useNavigate } from "react-router-dom";

export const CreatePostForm = () => {
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
      await queryClient.invalidateQueries({ queryKey: ["posts"] });

      navigate("/");
    },
  });

  const onSubmit = (values: CreatePostFormValues) => {
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
          <Field.Root invalid={!!errors.text}>
            <Field.Label>What's on your mind?</Field.Label>
            <Textarea
              placeholder="Write your post here..."
              {...register("text")}
            />
            <Field.ErrorText>{errors.text?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Upload image</Field.Label>
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
                  alt="Selected preview"
                  maxH="320px"
                  objectFit="cover"
                />
              </Box>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedImage(null)}
              >
                Remove image
              </Button>
            </VStack>
          ) : null}

          <Button
            type="submit"
            colorPalette="blue"
            loading={createPostMutation.isPending}
          >
            Create Post
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
