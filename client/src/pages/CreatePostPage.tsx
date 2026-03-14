import { Box } from "@chakra-ui/react";
import { PageHeader } from "../components/common/PageHeader";
import { CreatePostForm } from "../features/posts/components/create-post-form";

export function CreatePostPage() {
  return (
    <Box>
      <PageHeader
        title="Create Post"
        subtitle="Share something with the community"
      />

      <CreatePostForm />
    </Box>
  );
}
