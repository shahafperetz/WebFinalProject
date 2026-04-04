import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  HStack,
  IconButton,
  Image,
  Separator,
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
import { getImageUrl } from "../../../utils/get-image-url";
import { TranslatePostButton } from "../../ai/components/translate-post-button";
import { Pencil, Trash2, MessageCircle, ThumbsUp } from "lucide-react";

type PostCardProps = { post: Post };

export const PostCard = ({ post }: PostCardProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const toggleLikeMutation = useToggleLike();
  const deletePostMutation = useDeletePost();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const ownerId = post.owner?._id;
  const ownerUsername = post.owner?.username ?? "Unknown user";
  const ownerImage = post.owner?.image ?? "";
  const isOwner = !!ownerId && currentUser?._id === ownerId;
  const postImageUrl = post.image ? getImageUrl(post.image) : "";
  const avatarUrl = ownerImage ? getImageUrl(ownerImage) : "";

  return (
    <Card.Root
      overflow="hidden"
      borderRadius="2xl"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <Card.Body p={0}>
        <VStack align="stretch" gap={0}>
          <HStack justify="space-between" align="start" px={5} pt={5} pb={3}>
            <HStack gap={3}>
              <Avatar.Root
                size="md"
                borderRadius="full"
                overflow="hidden"
                flexShrink={0}
              >
                {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
                <Avatar.Fallback name={ownerUsername} />
              </Avatar.Root>
              <VStack align="start" gap={0}>
                <Text fontWeight="semibold" fontSize="sm" lineHeight="1.3">
                  {ownerUsername}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {new Date(post.createdAt).toLocaleString()}
                </Text>
              </VStack>
            </HStack>

            {isOwner && (
              <HStack gap={1}>
                <Dialog.Root
                  open={isEditOpen}
                  onOpenChange={(e) => setIsEditOpen(e.open)}
                >
                  <Dialog.Trigger asChild>
                    <IconButton
                      aria-label="Edit post"
                      variant="ghost"
                      size="sm"
                      color="gray.400"
                      _hover={{ color: "blue.500", bg: "blue.50" }}
                    >
                      <Pencil size={15} />
                    </IconButton>
                  </Dialog.Trigger>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content borderRadius="2xl">
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
                    <IconButton
                      aria-label="Delete post"
                      variant="ghost"
                      size="sm"
                      color="gray.400"
                      _hover={{ color: "red.500", bg: "red.50" }}
                    >
                      <Trash2 size={15} />
                    </IconButton>
                  </Dialog.Trigger>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content borderRadius="2xl">
                      <Dialog.Header>
                        <Dialog.Title>Delete Post</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <Text color="gray.600" fontSize="sm">
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
                          onClick={() =>
                            deletePostMutation.mutate(post._id, {
                              onSuccess: () => setIsDeleteOpen(false),
                            })
                          }
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
            )}
          </HStack>

          <VStack align="stretch" gap={2} px={5} pb={postImageUrl ? 3 : 4}>
            <Text fontSize="sm" lineHeight="1.7" color="gray.800">
              {post.text}
            </Text>
            <TranslatePostButton postId={post._id} originalText={post.text} />
          </VStack>

          {postImageUrl && (
            <Box>
              <Image
                src={postImageUrl}
                alt="Post image"
                w="full"
                maxH="480px"
                objectFit="cover"
              />
            </Box>
          )}

          <HStack
            justify="space-between"
            px={5}
            pt={3}
            pb={1}
            color="gray.400"
            fontSize="xs"
          >
            <Text>{post.likesCount} likes</Text>
            <Text>{post.commentsCount} comments</Text>
          </HStack>

          <Box px={5}>
            <Separator />
          </Box>

          <HStack px={3} py={1} gap={1}>
            <Button
              flex="1"
              variant="ghost"
              size="sm"
              onClick={() =>
                isAuthenticated && toggleLikeMutation.mutate(post._id)
              }
              loading={toggleLikeMutation.isPending}
              disabled={!isAuthenticated}
              color={post.likedByMe ? "blue.500" : "gray.500"}
              _hover={{ bg: post.likedByMe ? "blue.50" : "gray.100" }}
              borderRadius="xl"
            >
              <HStack gap={1.5}>
                <ThumbsUp
                  size={15}
                  fill={post.likedByMe ? "currentColor" : "none"}
                />
                <Text fontSize="sm">{post.likedByMe ? "Liked" : "Like"}</Text>
              </HStack>
            </Button>

            <Button
              asChild
              flex="1"
              variant="ghost"
              size="sm"
              color="gray.500"
              _hover={{ bg: "gray.100" }}
              borderRadius="xl"
            >
              <RouterLink to={`/posts/${post._id}/comments`}>
                <HStack gap={1.5}>
                  <MessageCircle size={15} />
                  <Text fontSize="sm">Comments</Text>
                </HStack>
              </RouterLink>
            </Button>
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
