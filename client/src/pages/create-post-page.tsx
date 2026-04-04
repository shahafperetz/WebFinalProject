import { Box, Text } from "@chakra-ui/react";
import { CreatePostForm } from "../features/posts/components/create-post-form";

export const CreatePostPage = () => {
  return (
    <Box maxW="2xl" mx="auto" py={8} px={4}>
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          Create Post
        </Text>
        <Text color="gray.500" fontSize="sm" mt={0.5}>
          Share something with the community
        </Text>
      </Box>

      <CreatePostForm />
    </Box>
  );
};
