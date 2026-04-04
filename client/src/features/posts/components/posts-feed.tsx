import { useEffect, useMemo, useRef } from "react";
import { Box, Center, Text, VStack } from "@chakra-ui/react";
import { usePosts } from "../hooks/use-posts";
import { PostCard } from "./post-card";
import { PostsFeedSkeleton } from "./post-feed-skeleton";

export const PostsFeed = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const posts = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.items) ?? [];
    return all.filter((post) => post.owner?._id);
  }, [data]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <PostsFeedSkeleton count={3} />;

  if (isError) {
    return (
      <Center minH="40vh" flexDirection="column" gap={2}>
        <Text fontSize="2xl">😕</Text>
        <Text fontWeight="medium" color="gray.600">
          Failed to load posts
        </Text>
      </Center>
    );
  }

  if (!posts.length) {
    return (
      <Center minH="40vh" flexDirection="column" gap={3}>
        <Text fontSize="4xl">🌱</Text>
        <Text fontWeight="medium" color="gray.500">
          No posts yet
        </Text>
        <Text fontSize="sm" color="gray.400">
          Be the first to share something!
        </Text>
      </Center>
    );
  }

  return (
    <VStack gap={6} align="stretch">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      <Box ref={loadMoreRef} h="20px" />

      {isFetchingNextPage && <PostsFeedSkeleton count={2} />}

      {!hasNextPage && posts.length > 0 && (
        <Center py={4}>
          <Text color="gray.400" fontSize="sm">
            You've reached the end
          </Text>
        </Center>
      )}
    </VStack>
  );
};
