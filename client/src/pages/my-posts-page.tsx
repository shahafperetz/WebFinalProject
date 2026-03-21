import { useEffect, useMemo, useRef } from "react";
import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { PageHeader } from "../components/common/page-header";
import { PostCard } from "../features/posts/components/post-card";
import { useMyPosts } from "../features/posts/hooks/use-my-posts";

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

  return (
    <Box>
      <PageHeader
        title="My Posts"
        subtitle="View all posts created by the logged-in user"
      />

      {isLoading ? (
        <Center py={10}>
          <Spinner size="lg" />
        </Center>
      ) : isError ? (
        <Center py={10}>
          <Text>Failed to load your posts</Text>
        </Center>
      ) : !posts.length ? (
        <Center py={10}>
          <Text color="gray.500">You have no posts yet</Text>
        </Center>
      ) : (
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
      )}
    </Box>
  );
};
