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

type Props = {
  comment: Comment;
};

export const CommentCard = ({ comment }: Props) => {
  const currentUser = useAuthStore((state) => state.user);
  const deleteCommentMutation = useDeleteComment();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isOwner =
    currentUser?._id === comment.owner?._id ||
    currentUser?.id === comment.owner?._id;

  const avatarUrl = getImageUrl(comment.owner?.image);

  const handleDeleteConfirm = () => {
    deleteCommentMutation.mutate(
      {
        commentId: comment._id,
        postId: comment.postId,
      },
      {
        onSuccess: () => {
          setIsDeleteOpen(false);
        },
      }
    );
  };

  return (
    <Card.Root borderRadius="xl">
      <Card.Body>
        <HStack align="start" justify="space-between">
          <HStack align="start" gap={3}>
            <Avatar.Root>
              {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
              <Avatar.Fallback name={comment.owner?.username ?? "User"} />
            </Avatar.Root>

            <VStack align="start" gap={1} flex="1">
              <Text fontWeight="bold">
                {comment.owner?.username ?? "Unknown user"}
              </Text>

              <Text>{comment.text}</Text>

              <Text fontSize="sm" color="gray.500">
                {new Date(comment.createdAt).toLocaleString()}
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
                  <Button size="sm" variant="ghost" aria-label="Edit comment">
                    <HStack gap={2}>
                      <Pencil size={16} />
                      <span>Edit</span>
                    </HStack>
                  </Button>
                </Dialog.Trigger>

                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
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
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    aria-label="Delete comment"
                  >
                    <HStack gap={2}>
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </HStack>
                  </Button>
                </Dialog.Trigger>

                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Delete Comment</Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                      <Text>Are you sure you want to delete this comment?</Text>
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
          ) : null}
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
