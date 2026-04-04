import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema";
import { getErrorMessage } from "../../../utils/get-error-message";

export const RegisterForm = () => {
  const { registerMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...payload } = values;
    void confirmPassword;
    registerMutation.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {registerMutation.isError && (
          <Alert.Root status="error" borderRadius="xl" fontSize="sm">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                {getErrorMessage(
                  registerMutation.error,
                  "Registration failed. Please try again."
                )}
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}

        <Field.Root invalid={!!errors.username}>
          <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
            Username
          </Field.Label>
          <Input
            size="lg"
            placeholder="Choose a username"
            borderRadius="xl"
            {...register("username")}
          />
          <Field.ErrorText fontSize="xs">
            {errors.username?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email}>
          <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
            Email
          </Field.Label>
          <Input
            size="lg"
            type="email"
            placeholder="Enter your email"
            borderRadius="xl"
            {...register("email")}
          />
          <Field.ErrorText fontSize="xs">
            {errors.email?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
            Password
          </Field.Label>
          <Input
            size="lg"
            type="password"
            placeholder="Create a password"
            borderRadius="xl"
            {...register("password")}
          />
          <Field.ErrorText fontSize="xs">
            {errors.password?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
            Confirm Password
          </Field.Label>
          <Input
            size="lg"
            type="password"
            placeholder="Repeat your password"
            borderRadius="xl"
            {...register("confirmPassword")}
          />
          <Field.ErrorText fontSize="xs">
            {errors.confirmPassword?.message}
          </Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          size="lg"
          colorPalette="blue"
          borderRadius="xl"
          loading={registerMutation.isPending}
          mt={1}
        >
          Create Account
        </Button>
      </Stack>
    </form>
  );
};
