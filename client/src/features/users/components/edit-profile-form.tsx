import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Field,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { updateMyInfo } from "../api/users.api";
import type { User } from "../types/user.types";
import { useAuthStore } from "../../../store/auth.store";
import { z } from "zod";
import { getImageUrl } from "../../../utils/get-image-url";

const editProfileSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

type EditProfileFormProps = {
  user: User;
  onSuccess?: () => void;
};

export const EditProfileForm = ({ user, onSuccess }: EditProfileFormProps) => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const currentToken = useAuthStore((state) => state.accessToken);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => {
    if (selectedImage) return URL.createObjectURL(selectedImage);
    if (user.image) return getImageUrl(user.image);
    return "";
  }, [selectedImage, user.image]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { username: user.username },
  });

  const updateMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: async (updatedUser) => {
      if (currentToken) setAuth(updatedUser, currentToken);
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      onSuccess?.();
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    updateMutation.mutate({ username: values.username, image: selectedImage });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        <Field.Root invalid={!!errors.username}>
          <Field.Label>Username</Field.Label>
          <Input {...register("username")} />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root>
          <Field.Label>Profile image</Field.Label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)}
          />

          {previewUrl ? (
            <VStack gap={3} align="center">
              <Box
                position="relative"
                w="120px"
                h="120px"
                borderRadius="full"
                overflow="hidden"
                cursor="pointer"
                onClick={() => fileInputRef.current?.click()}
                _hover={{ "& .overlay": { opacity: 1 } }}
              >
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  w="120px"
                  h="120px"
                  objectFit="cover"
                />
                <Box
                  className="overlay"
                  position="absolute"
                  inset={0}
                  bg="blackAlpha.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  opacity={0}
                  transition="opacity 0.2s"
                  borderRadius="full"
                >
                  <Text color="white" fontSize="xs" fontWeight="medium">
                    Change
                  </Text>
                </Box>
              </Box>

              <Button
                size="xs"
                variant="ghost"
                colorPalette="red"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Remove photo
              </Button>
            </VStack>
          ) : (
            <Box
              w="full"
              border="2px dashed"
              borderColor={isDragging ? "blue.400" : "gray.300"}
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
                setSelectedImage(e.dataTransfer.files?.[0] ?? null);
              }}
            >
              <VStack gap={1}>
                <Box fontSize="xl" color={isDragging ? "blue.400" : "gray.400"}>
                  ↑
                </Box>
                <Text fontWeight="medium" color="gray.600" fontSize="sm">
                  Drag & drop your photo here
                </Text>
                <Text color="gray.400" fontSize="xs">
                  or{" "}
                  <Text as="span" color="blue.500" fontWeight="medium">
                    click to browse
                  </Text>
                </Text>
              </VStack>
            </Box>
          )}
        </Field.Root>

        <Button
          type="submit"
          colorPalette="blue"
          loading={updateMutation.isPending}
        >
          Save Changes
        </Button>
      </Stack>
    </form>
  );
};
