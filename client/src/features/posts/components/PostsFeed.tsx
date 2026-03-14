import { VStack, Spinner, Center, Text } from "@chakra-ui/react";
import { PostCard } from "./PostCard";
import { usePosts } from "../hooks/usePosts";

export const PostsFeed = () => {
  const { data, isLoading, isError } = usePosts();

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
        <Text>Failed to load posts</Text>
      </Center>
    );
  }

  if (!data?.items.length) {
    return (
      <Center py={10}>
        <Text color="gray.500">No posts yet</Text>
      </Center>
    );
  }

  return (
    <VStack gap={6} align="stretch">
      {data.items.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </VStack>
  );
};
