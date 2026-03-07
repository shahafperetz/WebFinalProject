import { VStack } from '@chakra-ui/react';
import { mockPosts } from '../mockPosts';
import { PostCard } from './PostCard';

export function PostsFeed() {
  return (
    <VStack gap={6} align="stretch">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </VStack>
  );
}