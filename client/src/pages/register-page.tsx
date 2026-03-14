import { Box, Text } from "@chakra-ui/react";
import { PageHeader } from "../components/common/page-header";
import { RegisterForm } from "../features/auth/components/RegisterForm";

export const RegisterPage = () => {
  return (
    <Box maxW="md">
      <PageHeader
        title="Register"
        subtitle="Create a new account to start sharing content"
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
        <RegisterForm />
      </Box>

      <Text mt={4} color="gray.600">
        בהמשך נוסיף כאן גם הרשמה עם Google או Facebook.
      </Text>
    </Box>
  );
};
