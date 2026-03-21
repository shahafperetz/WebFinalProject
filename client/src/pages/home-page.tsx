import { VStack } from "@chakra-ui/react";
import { PageHeader } from "../components/common/page-header";
import { AiPostSearch } from "../features/ai/components/ai-post-search";
import { PostsFeed } from "../features/posts/components/posts-feed";

export const HomePage = () => {
  return (
    <VStack align="stretch" gap={6}>
      <PageHeader
        title="Home Feed"
        subtitle="Browse posts and search them with AI"
      />
      <AiPostSearch />
      <PostsFeed />
    </VStack>
  );
};
