import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { PageHeader } from "../components/common/page-header";
import { PostCard } from "../features/posts/components/post-card";
import { useMyPosts } from "../features/posts/hooks/use-my-posts";

export function MyPostsPage() {
  const { data, isLoading, isError } = useMyPosts();

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py={10}>
        <Text>Failed to load your posts</Text>
      </Center>
    );
  }

  if (!data?.items.length) {
    return (
      <Center py={10}>
        <Text color="gray.500">You have no posts yet</Text>
      </Center>
    );
  }

  return (
    <Box>
      <PageHeader
        title="My Posts"
        subtitle="View all posts created by the logged-in user"
      />

      <VStack gap={6} align="stretch">
        {data.items.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </VStack>
    </Box>
  );
}
