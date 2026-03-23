import { Avatar, Card, HStack, Text, VStack } from "@chakra-ui/react";
import type { Comment } from "../types/comment.types";
import { getImageUrl } from "../../../utils/get-image-url";

type Props = {
  comment: Comment;
};

export const CommentCard = ({ comment }: Props) => {
  const avatarUrl = comment.owner.image ? getImageUrl(comment.owner.image) : "";

  return (
    <Card.Root>
      <Card.Body>
        <HStack align="start">
          <Avatar.Root>
            {avatarUrl && <Avatar.Image src={avatarUrl} />}
            <Avatar.Fallback name={comment.owner.username} />
          </Avatar.Root>

          <VStack align="start" gap={1}>
            <Text fontWeight="bold">{comment.owner.username}</Text>

            <Text>{comment.text}</Text>

            <Text fontSize="sm" color="gray.500">
              {new Date(comment.createdAt).toLocaleString()}
            </Text>
          </VStack>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
