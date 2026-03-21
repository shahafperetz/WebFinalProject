import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

export const LoginForm = () => {
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const errorMessage =
    (loginMutation.error as any)?.response?.data?.message || "Login failed";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {loginMutation.isError ? (
          <Alert.Root status="error" borderRadius="xl">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Login failed</Alert.Title>
              <Alert.Description>{errorMessage}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        <Field.Root invalid={!!errors.username}>
          <Field.Label>Username</Field.Label>
          <Input
            size="lg"
            placeholder="Enter your username"
            {...register("username")}
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label>Password</Field.Label>
          <Input
            size="lg"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          size="lg"
          colorPalette="blue"
          loading={loginMutation.isPending}
        >
          Login
        </Button>
      </Stack>
    </form>
  );
};
