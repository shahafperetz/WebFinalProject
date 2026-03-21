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

  const errorMessage = getErrorMessage(
    registerMutation.error,
    "Registration failed"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {registerMutation.isError ? (
          <Alert.Root status="error" borderRadius="xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Registration failed</Alert.Title>
              <Alert.Description>{errorMessage}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        <Field.Root invalid={!!errors.username}>
          <Field.Label>Username</Field.Label>
          <Input
            size="lg"
            placeholder="Choose a username"
            {...register("username")}
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email}>
          <Field.Label>Email</Field.Label>
          <Input
            size="lg"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <Input
            size="lg"
            type="password"
            placeholder="Create a password"
            {...register("password")}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label>Confirm Password</Field.Label>
          <Input
            size="lg"
            type="password"
            placeholder="Repeat your password"
            {...register("confirmPassword")}
          />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          size="lg"
          colorPalette="blue"
          loading={registerMutation.isPending}
        >
          Create Account
        </Button>
      </Stack>
    </form>
  );
};
