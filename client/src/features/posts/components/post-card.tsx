import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../../store/auth.store";
import { useToggleLike } from "../hooks/use-toggle-like";
import { useDeletePost } from "../hooks/use-delete-post";
import { EditPostForm } from "./edit-post-form";
import type { Post } from "../types/post.types";

type PostCardProps = {
  post: Post;
};

export const PostCard = ({ post }: PostCardProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const toggleLikeMutation = useToggleLike();
  const deletePostMutation = useDeletePost();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const handleDeleteConfirm = () => {
    deletePostMutation.mutate(post._id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
      },
    });
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
              <Dialog.Root
                open={isEditOpen}
                onOpenChange={(e) => setIsEditOpen(e.open)}
              >
                <Dialog.Trigger asChild>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Dialog.Trigger>

                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Edit Post</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                      <EditPostForm
                        post={post}
                        onSuccess={() => setIsEditOpen(false)}
                      />
                    </Dialog.Body>

                    <Dialog.CloseTrigger />
                  </Dialog.Content>
                </Dialog.Positioner>
              </Dialog.Root>

              <Dialog.Root
                open={isDeleteOpen}
                onOpenChange={(e) => setIsDeleteOpen(e.open)}
              >
                <Dialog.Trigger asChild>
                  <Button size="sm" variant="ghost" colorPalette="red">
                    Delete
                  </Button>
                </Dialog.Trigger>

                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Delete Post</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                      <Text>
                        Are you sure you want to delete this post? This action
                        cannot be undone.
                      </Text>
                    </Dialog.Body>

                    <Dialog.Footer>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteOpen(false)}
                      >
                        Cancel
                      </Button>

                      <Button
                        colorPalette="red"
                        onClick={handleDeleteConfirm}
                        loading={deletePostMutation.isPending}
                      >
                        Delete
                      </Button>
                    </Dialog.Footer>

                    <Dialog.CloseTrigger />
                  </Dialog.Content>
                </Dialog.Positioner>
              </Dialog.Root>
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

          <Button asChild size="sm" variant="outline">
            <RouterLink to={`/posts/${post._id}/comments`}>
              Comments ({post.commentsCount})
            </RouterLink>
          </Button>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
