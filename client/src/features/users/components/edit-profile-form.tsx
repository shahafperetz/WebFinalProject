import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Field, Image, Input, Stack } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
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

  const previewUrl = useMemo(() => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }

    if (user.image) {
      return getImageUrl(user.image);
    }

    return "";
  }, [selectedImage, user.image]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user.username,
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateMyInfo,
    onSuccess: async (updatedUser) => {
      if (currentToken) {
        setAuth(updatedUser, currentToken);
      }

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["my-posts"] });

      onSuccess?.();
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    updateMutation.mutate({
      username: values.username,
      image: selectedImage,
    });
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
          <Box overflow="hidden" borderRadius="xl">
            <Image
              src={previewUrl}
              alt="Profile preview"
              maxH="240px"
              objectFit="cover"
            />
          </Box>
        ) : null}

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
