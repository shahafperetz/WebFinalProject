import { Box, Button, Flex, HStack, Heading, Spacer } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export function Navbar() {
  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      px={6}
      py={4}
    >
      <Flex align="center" maxW="6xl" mx="auto">
        <Heading size="md">Social AI App</Heading>

        <Spacer />

        <HStack gap={3}>
          <Button asChild variant="ghost">
            <RouterLink to="/">Home</RouterLink>
          </Button>

          <Button asChild variant="ghost">
            <RouterLink to="/login">Login</RouterLink>
          </Button>

          <Button asChild colorPalette="blue">
            <RouterLink to="/register">Register</RouterLink>
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
