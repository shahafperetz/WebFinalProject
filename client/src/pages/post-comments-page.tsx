import { Box, Spinner, Center, VStack, Heading, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { CommentForm } from "../features/comments/components/comment-form";
import { CommentsList } from "../features/comments/components/comments-list";
import { useComments } from "../features/comments/hooks/use-comments";

export const PostCommentsPage = () => {
  const { postId = "" } = useParams();
  const { data, isLoading } = useComments(postId);
  const count = data?.items?.length ?? 0;

  if (isLoading) {
    return (
      <Center minH="40vh">
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  return (
    <Box maxW="2xl" mx="auto" px={4} py={8}>
      <VStack align="stretch" gap={8}>
        <Box>
          <Heading size="lg" mb={1}>
            Comments
          </Heading>
          <Text color="gray.500" fontSize="sm">
            {count === 0
              ? "No comments yet — be the first!"
              : `${count} comment${count === 1 ? "" : "s"}`}
          </Text>
        </Box>

        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="2xl"
          p={5}
          boxShadow="sm"
        >
          <CommentForm postId={postId} />
        </Box>

        {count === 0 ? (
          <Center flexDirection="column" gap={3} py={16} color="gray.400">
            <Text fontSize="4xl">💬</Text>
            <Text fontWeight="medium" color="gray.500">
              No comments yet
            </Text>
            <Text fontSize="sm">Start the conversation!</Text>
          </Center>
        ) : (
          <CommentsList comments={data?.items ?? []} />
        )}
      </VStack>
    </Box>
  );
};
