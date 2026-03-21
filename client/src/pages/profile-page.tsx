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
import { PageHeader } from "../components/common/page-header";
import { useAuthStore } from "../store/auth.store";
import { useProfile } from "../features/users/hooks/use-profile";
import { EditProfileForm } from "../features/users/components/edit-profile-form";
import { useMyPosts } from "../features/posts/hooks/use-my-posts";
import { usePosts } from "../features/posts/hooks/use-posts";
import { PostCard } from "../features/posts/components/post-card";

export const ProfilePage = () => {
  const { id = "" } = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isMe = currentUser?._id === id || currentUser?.id === id;

  const { data: profile, isLoading, isError } = useProfile(id, isMe);

  const myPostsQuery = useMyPosts();
  const allPostsQuery = usePosts();

  const activeQuery = isMe ? myPostsQuery : allPostsQuery;

  const userPosts = useMemo(() => {
    if (!profile) return [];

    const allLoadedPosts =
      activeQuery.data?.pages.flatMap((page) => page.items) ?? [];

    if (isMe) {
      return allLoadedPosts;
    }

    return allLoadedPosts.filter((post) => post.owner._id === profile._id);
  }, [profile, isMe, activeQuery.data]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !activeQuery.hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting && !activeQuery.isFetchingNextPage) {
          activeQuery.fetchNextPage();
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
  }, [
    activeQuery.fetchNextPage,
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
  ]);

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (isError || !profile) {
    return (
      <Center py={10}>
        <Text>Failed to load profile</Text>
      </Center>
    );
  }

  const avatarUrl = profile.image
    ? `http://localhost:3001${profile.image}`
    : "";

  return (
    <Box>
      <PageHeader title="Profile" subtitle="View user details and posts" />

      <VStack align="stretch" gap={6}>
        <Box
          w="full"
          p={6}
          bg="white"
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
        >
          <HStack justify="space-between" align="start">
            <HStack gap={4}>
              <Avatar.Root size="2xl">
                {avatarUrl ? <Avatar.Image src={avatarUrl} /> : null}
                <Avatar.Fallback name={profile.username} />
              </Avatar.Root>

              <VStack align="start" gap={1}>
                <Text fontSize="2xl" fontWeight="bold">
                  {profile.username}
                </Text>

                {profile.email ? (
                  <Text color="gray.500">{profile.email}</Text>
                ) : null}
              </VStack>
            </HStack>

            {isMe ? (
              <Dialog.Root
                open={isEditOpen}
                onOpenChange={(e) => setIsEditOpen(e.open)}
              >
                <Dialog.Trigger asChild>
                  <Button colorPalette="blue">Edit Profile</Button>
                </Dialog.Trigger>

                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
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
            ) : null}
          </HStack>
        </Box>

        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            Posts
          </Text>

          {activeQuery.isLoading ? (
            <Center py={10}>
              <Spinner />
            </Center>
          ) : userPosts.length ? (
            <VStack align="stretch" gap={6}>
              {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}

              <Box ref={loadMoreRef} h="20px" />

              {activeQuery.isFetchingNextPage ? (
                <Center py={4}>
                  <Spinner />
                </Center>
              ) : null}

              {!activeQuery.hasNextPage ? (
                <Center py={4}>
                  <Text color="gray.500" fontSize="sm">
                    No more posts to load
                  </Text>
                </Center>
              ) : null}
            </VStack>
          ) : (
            <Text color="gray.500">No posts yet</Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};
