import { Box, Button, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useAddComment } from "../hooks/use-add-comment";

type Props = { postId: string };

export const CommentForm = ({ postId }: Props) => {
  const [text, setText] = useState("");
  const addCommentMutation = useAddComment(postId);

  const handleSubmit = () => {
    if (!text.trim()) return;
    addCommentMutation.mutate(text, {
      onSuccess: () => setText(""),
    });
  };

  return (
    <VStack align="stretch" gap={3}>
      <Textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        minH="80px"
        resize="none"
        borderRadius="xl"
        fontSize="sm"
      />
      <Box display="flex" justifyContent="flex-end">
        <Button
          colorPalette="blue"
          onClick={handleSubmit}
          loading={addCommentMutation.isPending}
          disabled={!text.trim()}
          size="sm"
          borderRadius="lg"
          px={6}
        >
          Add Comment
        </Button>
      </Box>
    </VStack>
  );
};
