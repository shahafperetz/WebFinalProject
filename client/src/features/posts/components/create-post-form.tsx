import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Field,
  Image,
  Stack,
  Textarea,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    defaultValues: { text: "" },
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

  const handleFile = (file: File | null) => {
    if (!file) {
      setSelectedImage(null);
      setImageError("");
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectedImage(null);
      setImageError("Only image files (.jpg, .jpeg, .png, .webp) are allowed.");
      return;
    }
    setImageError("");
    setSelectedImage(file);
  };

  const onSubmit = (values: CreatePostFormValues) => {
    if (selectedImage && !ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
      setImageError("Only image files (.jpg, .jpeg, .png, .webp) are allowed.");
      return;
    }
    createPostMutation.mutate({ text: values.text, image: selectedImage });
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

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />

            {!previewUrl && (
              <Box
                w="full"
                border="2px dashed"
                borderColor={
                  isDragging ? "blue.400" : imageError ? "red.300" : "gray.300"
                }
                borderRadius="xl"
                bg={isDragging ? "blue.50" : "gray.50"}
                p={8}
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
              >
                <VStack gap={2}>
                  <Box
                    fontSize="2xl"
                    color={isDragging ? "blue.400" : "gray.400"}
                  >
                    ↑
                  </Box>
                  <Text fontWeight="medium" color="gray.600" fontSize="sm">
                    Drag & drop an image here
                  </Text>
                  <Text color="gray.400" fontSize="xs">
                    or{" "}
                    <Text as="span" color="blue.500" fontWeight="medium">
                      click to browse
                    </Text>
                  </Text>
                  <Text color="gray.400" fontSize="xs">
                    JPG, PNG, WEBP supported
                  </Text>
                </VStack>
              </Box>
            )}

            <Field.ErrorText>{imageError}</Field.ErrorText>
          </Field.Root>

          {previewUrl ? (
            <VStack align="start">
              <Box overflow="hidden" borderRadius="xl" w="full">
                <Image
                  src={previewUrl}
                  alt="Selected preview"
                  maxH="320px"
                  w="full"
                  objectFit="cover"
                />
              </Box>
              <Button
                size="sm"
                variant="ghost"
                colorPalette="red"
                onClick={() => {
                  setSelectedImage(null);
                  setImageError("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
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
