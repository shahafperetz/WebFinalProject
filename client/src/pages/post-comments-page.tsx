import { Box, Spinner, Center, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { CommentForm } from "../features/comments/components/comment-form";
import { CommentsList } from "../features/comments/components/comments-list";
import { useComments } from "../features/comments/hooks/use-comments";

export const PostCommentsPage = () => {
  const { postId = "" } = useParams();

  const { data, isLoading } = useComments(postId);

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Box maxW="4xl" mx="auto">
      <VStack align="stretch" gap={6}>
        <CommentForm postId={postId} />

        <CommentsList comments={data?.items ?? []} />
      </VStack>
    </Box>
  );
};
