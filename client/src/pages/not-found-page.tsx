import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <Center minH="calc(100vh - 80px)">
      <VStack gap={5} textAlign="center">
        <Text fontSize="7xl" lineHeight="1">
          🔍
        </Text>

        <Box>
          <Heading
            fontSize="8xl"
            fontWeight="bold"
            color="blue.500"
            lineHeight="1"
          >
            404
          </Heading>
          <Heading size="lg" color="gray.700" mt={2}>
            Page not found
          </Heading>
        </Box>

        <Text color="gray.500" fontSize="sm" maxW="320px" lineHeight="1.7">
          The page you're looking for doesn't exist or has been moved.
        </Text>

        <Button asChild colorPalette="blue" size="lg" borderRadius="xl" mt={2}>
          <RouterLink to="/">Back to Home</RouterLink>
        </Button>
      </VStack>
    </Center>
  );
};
