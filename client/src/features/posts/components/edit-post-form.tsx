import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  Field,
  Image,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useRef, useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    defaultValues: { text: post.text },
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

  const onSubmit = (values: UpdatePostFormValues) => {
    if (selectedImage && !ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
      setImageError("Only image files (.jpg, .jpeg, .png, .webp) are allowed.");
      return;
    }
    updatePostMutation.mutate(
      { id: post._id, text: values.text, image: selectedImage },
      { onSuccess: () => onSuccess?.() }
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />

          <Box
            w="full"
            border="2px dashed"
            borderColor={
              isDragging ? "blue.400" : imageError ? "red.300" : "gray.300"
            }
            borderRadius="xl"
            bg={isDragging ? "blue.50" : "gray.50"}
            p={6}
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
            <VStack gap={1}>
              <Box fontSize="xl" color={isDragging ? "blue.400" : "gray.400"}>
                ↑
              </Box>
              <Text fontWeight="medium" color="gray.600" fontSize="sm">
                {previewUrl
                  ? "Drop to replace image"
                  : "Drag & drop an image here"}
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

          <Field.ErrorText>{imageError}</Field.ErrorText>
        </Field.Root>

        {previewUrl ? (
          <VStack align="start">
            <Box overflow="hidden" borderRadius="xl" w="full">
              <Image
                src={previewUrl}
                alt="Post preview"
                maxH="320px"
                w="full"
                objectFit="cover"
              />
            </Box>

            {selectedImage ? (
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
