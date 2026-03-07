import { Box, Heading, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export function ProfilePage() {
  const { id } = useParams();

  return (
    <Box>
      <Heading mb={4}>Profile</Heading>

      <Text color="gray.600">עמוד פרופיל עבור משתמש: {id}</Text>
    </Box>
  );
}
