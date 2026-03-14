import { Avatar, Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export const ProfilePage = () => {
  const { id } = useParams();

  return (
    <VStack align="start" gap={6}>
      <Heading>Profile</Heading>

      <Box
        w="full"
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <HStack gap={4} align="center">
          <Avatar.Root size="xl">
            <Avatar.Fallback name="User Profile" />
          </Avatar.Root>

          <Box>
            <Text fontWeight="bold" fontSize="lg">
              User #{id}
            </Text>
            <Text color="gray.600">כאן יוצגו פרטי המשתמש והפוסטים שלו.</Text>
          </Box>
        </HStack>
      </Box>
    </VStack>
  );
};
