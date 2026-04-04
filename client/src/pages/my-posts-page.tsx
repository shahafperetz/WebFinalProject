import { useEffect, useMemo, useRef } from "react";
import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { PostCard } from "../features/posts/components/post-card";
import { useMyPosts } from "../features/posts/hooks/use-my-posts";
import { NavLink } from "react-router-dom";

export const MyPostsPage = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyPosts();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
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

  return (
    <Box>
      <Box mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
          My Posts
        </Text>
        <Text color="gray.500" fontSize="sm" mt={0.5}>
          {posts.length > 0
            ? `${posts.length} post${posts.length === 1 ? "" : "s"}`
            : "Everything you've shared with the community"}
        </Text>
      </Box>

      {isLoading ? (
        <Center minH="40vh">
          <Spinner size="lg" color="blue.500" />
        </Center>
      ) : isError ? (
        <Center minH="40vh" flexDirection="column" gap={2}>
          <Text fontSize="2xl">😕</Text>
          <Text fontWeight="medium" color="gray.600">
            Failed to load your posts
          </Text>
        </Center>
      ) : !posts.length ? (
        <Center minH="40vh" flexDirection="column" gap={3}>
          <Text fontSize="4xl">📝</Text>
          <Text fontWeight="medium" color="gray.500">
            No posts yet
          </Text>
          <Text fontSize="sm" color="gray.400">
            Ready to share something?{" "}
            <NavLink to="/create-post">
              <Text as="span" color="blue.500" fontWeight="medium">
                Create your first post
              </Text>
            </NavLink>
          </Text>
        </Center>
      ) : (
        <VStack gap={6} align="stretch">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          <Box ref={loadMoreRef} h="20px" />

          {isFetchingNextPage && (
            <Center py={4}>
              <Spinner color="blue.500" />
            </Center>
          )}

          {!hasNextPage && posts.length > 0 && (
            <Center py={4}>
              <Text color="gray.400" fontSize="sm">
                You've reached the end
              </Text>
            </Center>
          )}
        </VStack>
      )}
    </Box>
  );
};
