import { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "../../../store/auth.store";
import { useDeleteComment } from "../hooks/use-delete-comment";
import { EditCommentForm } from "./edit-comment-form";
import type { Comment } from "../types/comment.types";
import { getImageUrl } from "../../../utils/get-image-url";

type Props = { comment: Comment };

export const CommentCard = ({ comment }: Props) => {
  const currentUser = useAuthStore((state) => state.user);
  const deleteCommentMutation = useDeleteComment();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isOwner = currentUser?._id === comment.owner?._id;

  const avatarUrl = getImageUrl(comment.owner?.image);

  const handleDeleteConfirm = () => {
    deleteCommentMutation.mutate(
      { commentId: comment._id, postId: comment.postId },
      { onSuccess: () => setIsDeleteOpen(false) }
    );
  };

  return (
    <Card.Root borderRadius="xl" border="1px solid" borderColor="gray.100">
      <Card.Body py={4} px={5}>
        <HStack align="start" justify="space-between">
          <HStack align="start" gap={3} flex="1">
            <Avatar.Root
              size="sm"
              borderRadius="full"
              overflow="hidden"
              flexShrink={0}
            >
              {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
              <Avatar.Fallback name={comment.owner?.username ?? "User"} />
            </Avatar.Root>

            <VStack align="start" gap={0.5} flex="1">
              <HStack gap={2}>
                <Text fontWeight="semibold" fontSize="sm">
                  {comment.owner?.username ?? "Unknown user"}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  {new Date(comment.createdAt).toLocaleString()}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.700" lineHeight="1.6">
                {comment.text}
              </Text>
            </VStack>
          </HStack>

          {isOwner && (
            <HStack gap={1} flexShrink={0}>
              <Dialog.Root
                open={isEditOpen}
                onOpenChange={(e) => setIsEditOpen(e.open)}
              >
                <Dialog.Trigger asChild>
                  <Button
                    size="xs"
                    variant="ghost"
                    aria-label="Edit comment"
                    color="gray.400"
                    _hover={{ color: "blue.500", bg: "blue.50" }}
                  >
                    <Pencil size={14} />
                  </Button>
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content borderRadius="2xl">
                    <Dialog.Header>
                      <Dialog.Title>Edit Comment</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <EditCommentForm
                        commentId={comment._id}
                        postId={comment.postId}
                        initialText={comment.text}
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
                  <Button
                    size="xs"
                    variant="ghost"
                    aria-label="Delete comment"
                    color="gray.400"
                    _hover={{ color: "red.500", bg: "red.50" }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </Dialog.Trigger>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content borderRadius="2xl">
                    <Dialog.Header>
                      <Dialog.Title>Delete Comment</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Text color="gray.600">
                        Are you sure you want to delete this comment?
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
                        loading={deleteCommentMutation.isPending}
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
      </Card.Body>
    </Card.Root>
  );
};
