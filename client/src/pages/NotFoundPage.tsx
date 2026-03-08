import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export function NotFoundPage() {
  return (
    <VStack py={20} gap={4}>
      <Heading>404</Heading>

      <Text color="gray.600">העמוד לא נמצא</Text>

      <Button asChild colorPalette="blue">
        <RouterLink to="/">חזרה לדף הבית</RouterLink>
      </Button>
    </VStack>
  );
}
