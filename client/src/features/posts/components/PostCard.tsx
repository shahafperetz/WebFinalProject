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
import { useAuthStore } from "../../../store/auth.store";
import type { Post } from "../types/post.types";
import { useToggleLike } from "../hooks/use-toggle-like";

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const toggleLikeMutation = useToggleLike();

  const isOwner =
    currentUser?._id === post.owner._id || currentUser?.id === post.owner._id;

  const postImageUrl = post.image ? `http://localhost:3001${post.image}` : "";
  const avatarUrl = post.owner.image
    ? `http://localhost:3001${post.owner.image}`
    : "";

  const handleLikeClick = () => {
    if (!isAuthenticated) return;
    toggleLikeMutation.mutate(post._id);
  };

  return (
    <Card.Root overflow="hidden" borderRadius="2xl">
      <Card.Body gap={4}>
        <HStack justify="space-between" align="start">
          <HStack gap={3}>
            <Avatar.Root>
              {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
              <Avatar.Fallback name={post.owner.username} />
            </Avatar.Root>

            <VStack align="start" gap={0}>
              <Text fontWeight="bold">{post.owner.username}</Text>

              <Text fontSize="sm" color="gray.500">
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </VStack>
          </HStack>

          {isOwner ? (
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

        <Text>{post.text}</Text>

        {postImageUrl ? (
          <Box overflow="hidden" borderRadius="xl">
            <Image
              src={postImageUrl}
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
            variant={post.likedByMe ? "solid" : "outline"}
            colorPalette="blue"
            onClick={handleLikeClick}
            loading={toggleLikeMutation.isPending}
            disabled={!isAuthenticated}
          >
            {post.likedByMe ? "Liked" : "Like"} ({post.likesCount})
          </Button>

          <Button size="sm" variant="outline">
            Comments ({post.commentsCount})
          </Button>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
