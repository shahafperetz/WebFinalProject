import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Field, Input, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { getErrorMessage } from "../../../utils/get-error-message";

export const LoginForm = () => {
  const { loginMutation } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={4}>
        {loginMutation.isError && (
          <Alert.Root status="error" borderRadius="xl" fontSize="sm">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                {getErrorMessage(
                  loginMutation.error,
                  "Login failed. Please check your credentials."
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
            placeholder="Enter your username"
            borderRadius="xl"
            {...register("username")}
          />
          <Field.ErrorText fontSize="xs">
            {errors.username?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label fontSize="sm" fontWeight="medium" color="gray.700">
            Password
          </Field.Label>
          <Input
            size="lg"
            type="password"
            placeholder="Enter your password"
            borderRadius="xl"
            {...register("password")}
          />
          <Field.ErrorText fontSize="xs">
            {errors.password?.message}
          </Field.ErrorText>
        </Field.Root>

        <Button
          type="submit"
          size="lg"
          colorPalette="blue"
          borderRadius="xl"
          loading={loginMutation.isPending}
          mt={1}
        >
          Sign in
        </Button>
      </Stack>
    </form>
  );
};
