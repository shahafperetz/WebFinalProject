import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Box textAlign="center" py={20}>
      <Heading mb={4}>404</Heading>

      <Text mb={6} color="gray.600">
        העמוד לא נמצא
      </Text>

      <Button asChild colorPalette="blue">
        <RouterLink to="/">חזרה לדף הבית</RouterLink>
      </Button>
    </Box>
  );
}
