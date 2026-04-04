import {
  Avatar,
  Box,
  Button,
  Center,
  Dialog,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useProfile } from "../features/users/hooks/use-profile";
import { EditProfileForm } from "../features/users/components/edit-profile-form";
import { useMyPosts } from "../features/posts/hooks/use-my-posts";
import { usePosts } from "../features/posts/hooks/use-posts";
import { PostCard } from "../features/posts/components/post-card";
import { getImageUrl } from "../utils/get-image-url";

export const ProfilePage = () => {
  const { id = "" } = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isMe = currentUser?._id === id;

  const { data: profile, isLoading, isError } = useProfile(id, isMe);

  const myPostsQuery = useMyPosts();
  const allPostsQuery = usePosts();
  const activeQuery = isMe ? myPostsQuery : allPostsQuery;

  const userPosts = useMemo(() => {
    if (!profile) return [];
    const allLoadedPosts =
      activeQuery.data?.pages.flatMap((page) => page.items) ?? [];
    if (isMe) return allLoadedPosts;
    return allLoadedPosts.filter((post) => post?.owner?._id === profile._id);
  }, [profile, isMe, activeQuery.data]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !activeQuery.hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !activeQuery.isFetchingNextPage) {
          activeQuery.fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [
    activeQuery,
    activeQuery.fetchNextPage,
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
  ]);

  if (isLoading) {
    return (
      <Center minH="40vh">
        <Spinner size="lg" color="blue.500" />
      </Center>
    );
  }

  if (isError || !profile) {
    return (
      <Center minH="40vh" flexDirection="column" gap={2}>
        <Text fontSize="2xl">😕</Text>
        <Text fontWeight="medium" color="gray.600">
          Failed to load profile
        </Text>
      </Center>
    );
  }

  const avatarUrl = profile.image ? getImageUrl(profile.image) : "";

  return (
    <Box>
      <VStack align="stretch" gap={6}>
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Box
            h="100px"
            bgGradient="to-r"
            gradientFrom="blue.400"
            gradientTo="blue.600"
          />

          <Box px={6} pb={5}>
            <HStack justify="space-between" align="start">
              <Box
                mt="-50px"
                borderRadius="full"
                border="4px solid white"
                overflow="hidden"
                boxShadow="sm"
                w="100px"
                h="100px"
                flexShrink={0}
              >
                <Avatar.Root size="full" borderRadius="full" w="100%" h="100%">
                  {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
                  <Avatar.Fallback name={profile.username} fontSize="2xl" />
                </Avatar.Root>
              </Box>

              {isMe && (
                <Dialog.Root
                  open={isEditOpen}
                  onOpenChange={(e) => setIsEditOpen(e.open)}
                >
                  <Dialog.Trigger asChild>
                    <Button
                      colorPalette="blue"
                      variant="outline"
                      size="sm"
                      borderRadius="lg"
                      mb={1}
                      mt={2}
                    >
                      Edit Profile
                    </Button>
                  </Dialog.Trigger>
                  <Dialog.Backdrop />
                  <Dialog.Positioner>
                    <Dialog.Content borderRadius="2xl">
                      <Dialog.Header>
                        <Dialog.Title>Edit Profile</Dialog.Title>
                      </Dialog.Header>
                      <Dialog.Body>
                        <EditProfileForm
                          user={profile}
                          onSuccess={() => setIsEditOpen(false)}
                        />
                      </Dialog.Body>
                      <Dialog.CloseTrigger />
                    </Dialog.Content>
                  </Dialog.Positioner>
                </Dialog.Root>
              )}
            </HStack>

            <VStack align="start" gap={0.5} mt={3}>
              <Text fontSize="xl" fontWeight="bold" lineHeight="1.2">
                {profile.username}
              </Text>
              {profile.email && (
                <Text color="gray.500" fontSize="sm">
                  {profile.email}
                </Text>
              )}
              <Text color="gray.400" fontSize="sm" mt={1}>
                {userPosts.length} post{userPosts.length === 1 ? "" : "s"}
              </Text>
            </VStack>
          </Box>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.800">
            Posts
          </Text>

          {activeQuery.isLoading ? (
            <Center py={10}>
              <Spinner color="blue.500" />
            </Center>
          ) : userPosts.length ? (
            <VStack align="stretch" gap={6}>
              {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}

              <Box ref={loadMoreRef} h="20px" />

              {activeQuery.isFetchingNextPage && (
                <Center py={4}>
                  <Spinner color="blue.500" />
                </Center>
              )}

              {!activeQuery.hasNextPage && (
                <Center py={4}>
                  <Text color="gray.400" fontSize="sm">
                    You've reached the end
                  </Text>
                </Center>
              )}
            </VStack>
          ) : (
            <Center flexDirection="column" gap={3} py={16}>
              <Text fontSize="4xl">📝</Text>
              <Text fontWeight="medium" color="gray.500">
                No posts yet
              </Text>
              {isMe && (
                <Text fontSize="sm" color="gray.400">
                  Share something with the community!
                </Text>
              )}
            </Center>
          )}
        </Box>
      </VStack>
    </Box>
  );
};
