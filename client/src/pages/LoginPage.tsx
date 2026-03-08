import { Box, Text } from "@chakra-ui/react";
import { PageHeader } from "../components/common/PageHeader";
import { LoginForm } from "../features/auth/components/LoginForm";

export function LoginPage() {
  return (
    <Box maxW="md">
      <PageHeader
        title="Login"
        subtitle="Sign in to continue to the application"
      />

      <Box
        w="full"
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <LoginForm />
      </Box>

      <Text mt={4} color="gray.600">
        בהמשך נוסיף כאן גם התחברות עם Google או Facebook.
      </Text>
    </Box>
  );
}
