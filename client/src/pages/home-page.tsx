import { useState } from "react";
import { Alert, Button, HStack, VStack } from "@chakra-ui/react";
import { PageHeader } from "../components/common/page-header";
import { PostsFeed } from "../features/posts/components/posts-feed";
import type { Post } from "../features/posts/types/post.types";

export const HomePage = () => {
  const [searchResults, setSearchResults] = useState<Post[] | null>(null);

  const isShowingAiResults = searchResults !== null;

  const handleBackToFeed = () => {
    setSearchResults(null);
  };

  return (
    <VStack align="stretch" gap={6}>
      <PageHeader title="Home Feed" />

      {isShowingAiResults ? (
        <Alert.Root status="info" borderRadius="xl">
          <Alert.Indicator />
          <Alert.Content>
            <HStack justify="space-between" w="full">
              <Alert.Title>Showing AI search results</Alert.Title>

              <Button size="sm" variant="outline" onClick={handleBackToFeed}>
                Back to feed
              </Button>
            </HStack>
          </Alert.Content>
        </Alert.Root>
      ) : null}

      {searchResults === null ? <PostsFeed /> : null}
    </VStack>
  );
};
