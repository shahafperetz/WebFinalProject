import { Box } from "@chakra-ui/react";
import { PageHeader } from "../components/common/PageHeader";
import { PostsFeed } from "../features/posts/components/PostsFeed";

export const HomePage = () => {
  return (
    <Box>
      <PageHeader
        title="Home Feed"
        subtitle="Browse posts shared by users in the application"
      />

      <PostsFeed />
    </Box>
  );
};
