import {
  Box,
  Card,
  HStack,
  Skeleton,
  SkeletonCircle,
  VStack,
} from "@chakra-ui/react";

export const PostCardSkeleton = () => {
  return (
    <Card.Root overflow="hidden" borderRadius="2xl">
      <Card.Body gap={4}>
        <HStack justify="space-between" align="start">
          <HStack gap={3}>
            <SkeletonCircle size="10" />

            <VStack align="start" gap={2}>
              <Skeleton height="16px" width="120px" />
              <Skeleton height="12px" width="90px" />
            </VStack>
          </HStack>

          <HStack>
            <Skeleton height="32px" width="56px" borderRadius="md" />
            <Skeleton height="32px" width="64px" borderRadius="md" />
          </HStack>
        </HStack>

        <VStack align="stretch" gap={2}>
          <Skeleton height="14px" width="100%" />
          <Skeleton height="14px" width="85%" />
          <Skeleton height="14px" width="65%" />
        </VStack>

        <Box overflow="hidden" borderRadius="xl">
          <Skeleton height="320px" width="100%" />
        </Box>

        <HStack gap={3}>
          <Skeleton height="36px" width="90px" borderRadius="md" />
          <Skeleton height="36px" width="120px" borderRadius="md" />
        </HStack>
      </Card.Body>
    </Card.Root>
  );
};
