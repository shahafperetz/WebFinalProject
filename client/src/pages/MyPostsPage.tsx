import { Box } from "@chakra-ui/react";
import { PageHeader } from "../components/common/PageHeader";
import { PostsFeed } from "../features/posts/components/PostsFeed";

export function MyPostsPage() {
  return (
    <Box>
      <PageHeader
        title="My Posts"
        subtitle="View all posts created by the logged-in user"
      />

      <PostsFeed />
    </Box>
  );
}
