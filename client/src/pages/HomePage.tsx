import { Box } from "@chakra-ui/react";
import { PageHeader } from "../components/common/PageHeader";
import { PostsFeed } from "../features/posts/components/PostsFeed";

export function HomePage() {
  return (
    <Box>
      <PageHeader
        title="Home Feed"
        subtitle="Browse posts shared by users in the application"
      />

      <PostsFeed />
    </Box>
  );
}
