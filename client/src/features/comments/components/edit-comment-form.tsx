import { Box, Button, Field, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useUpdateComment } from "../hooks/use-update-comment";

type EditCommentFormProps = {
  commentId: string;
  postId: string;
  initialText: string;
  onSuccess?: () => void;
};

export const EditCommentForm = ({
  commentId,
  postId,
  initialText,
  onSuccess,
}: EditCommentFormProps) => {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState("");
  const updateCommentMutation = useUpdateComment();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Comment text is required");
      return;
    }
    updateCommentMutation.mutate(
      { commentId, postId, text: trimmed },
      { onSuccess: () => onSuccess?.() }
    );
  };

  return (
    <VStack align="stretch" gap={4}>
      <Field.Root invalid={!!error}>
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          placeholder="Update your comment..."
          minH="80px"
          resize="none"
          borderRadius="xl"
          fontSize="sm"
        />
        <Field.ErrorText>{error}</Field.ErrorText>
      </Field.Root>

      <Box display="flex" justifyContent="flex-end">
        <Button
          colorPalette="blue"
          onClick={handleSubmit}
          loading={updateCommentMutation.isPending}
          disabled={!text.trim()}
          size="sm"
          borderRadius="lg"
          px={6}
        >
          Save Changes
        </Button>
      </Box>
    </VStack>
  );
};
