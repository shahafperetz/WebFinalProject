import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export function RegisterPage() {
  return (
    <VStack align="start" gap={4}>
      <Heading>Register</Heading>

      <Text color="gray.600">כאן יבוא טופס הרשמה.</Text>

      <Box
        w="full"
        maxW="md"
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text>טופס הרשמה ייכנס כאן בשלב הבא.</Text>
      </Box>
    </VStack>
  );
}
