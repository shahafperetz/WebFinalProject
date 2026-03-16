import { useEffect, useMemo, useRef } from "react";
import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { usePosts } from "../hooks/use-posts";
import { PostCard } from "./post-card";

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
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  if (!posts.length) {
    return (
      <Center py={10}>
        <Text color="gray.500">No posts yet</Text>
      </Center>
    );
  }

  return (
    <VStack gap={6} align="stretch">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      <Box ref={loadMoreRef} h="20px" />

      {isFetchingNextPage ? (
        <Center py={4}>
          <Spinner />
        </Center>
      ) : null}

      {!hasNextPage ? (
        <Center py={4}>
          <Text color="gray.500" fontSize="sm">
            No more posts to load
          </Text>
        </Center>
      ) : null}
    </VStack>
  );
};
