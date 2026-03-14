import { VStack, Text } from "@chakra-ui/react";
import { CommentCard } from "./comment-card";
import type { Comment } from "../types/comment.types";

type Props = {
  comments: Comment[];
};

export const CommentsList = ({ comments }: Props) => {
  if (!comments.length) {
    return <Text color="gray.500">No comments yet</Text>;
  }

  return (
    <VStack align="stretch" gap={4}>
      {comments.map((comment) => (
        <CommentCard key={comment._id} comment={comment} />
      ))}
    </VStack>
  );
};
