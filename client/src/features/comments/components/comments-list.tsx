import { VStack, Text } from "@chakra-ui/react";
import { CommentCard } from "./comment-card";
import type { Comment } from "../types/comment.types";

type Props = {
  comments: Comment[];
};

export const CommentsList = ({ comments }: Props) => {
  if (!comments.length) return null;

  return (
    <VStack align="stretch" gap={3}>
      <Text fontSize="sm" fontWeight="medium" color="gray.500">
        {comments.length} comment{comments.length === 1 ? "" : "s"}
      </Text>

      <VStack align="stretch" gap={3}>
        {comments.map((comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))}
      </VStack>
    </VStack>
  );
};
