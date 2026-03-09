import {
  Avatar,
  Box,
  Button,
  Card,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { Post } from "../../../types/post";

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card.Root overflow="hidden" borderRadius="2xl">
      <Card.Body gap={4}>
        <HStack justify="space-between" align="start">
          <HStack gap={3}>
            <Avatar.Root>
              <Avatar.Fallback name={post.username} />
            </Avatar.Root>

            <VStack align="start" gap={0}>
              <Text fontWeight="bold">{post.username}</Text>

              <Text fontSize="sm" color="gray.500">
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </VStack>
          </HStack>

          {post.isOwner ? (
            <HStack>
              <Button size="sm" variant="ghost">
                Edit
              </Button>

              <Button size="sm" variant="ghost" colorPalette="red">
                Delete
              </Button>
            </HStack>
          ) : null}
        </HStack>

        <Text>{post.content}</Text>

        {post.imageUrl ? (
          <Box overflow="hidden" borderRadius="xl">
            <Image
              src={post.imageUrl}
              alt="Post image"
              w="full"
              maxH="420px"
              objectFit="cover"
            />
          </Box>
        ) : null}

        <HStack gap={3}>
          <Button
            size="sm"
            variant={post.isLiked ? "solid" : "outline"}
            colorPalette="blue"
          >
            {post.isLiked ? "Liked" : "Like"} ({post.likesCount})
          </Button>

          <Button size="sm" variant="outline">
            Comments ({post.commentsCount})
          </Button>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
