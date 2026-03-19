import { VStack } from "@chakra-ui/react";
import { PostCardSkeleton } from "./post-card-skeleton";

type PostsFeedSkeletonProps = {
  count?: number;
};

export const PostsFeedSkeleton = ({ count = 3 }: PostsFeedSkeletonProps) => {
  return (
    <VStack gap={6} align="stretch">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </VStack>
  );
};
