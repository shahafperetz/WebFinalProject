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
    <Card.Root
      overflow="hidden"
      borderRadius="2xl"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
    >
      <Card.Body p={0}>
        <VStack align="stretch" gap={0}>
          <HStack justify="space-between" align="start" px={5} pt={5} pb={3}>
            <HStack gap={3}>
              <SkeletonCircle size="10" flexShrink={0} />
              <VStack align="start" gap={1.5}>
                <Skeleton height="13px" width="110px" borderRadius="full" />
                <Skeleton height="11px" width="80px" borderRadius="full" />
              </VStack>
            </HStack>
          </HStack>

          <VStack align="stretch" gap={2} px={5} pb={4}>
            <Skeleton height="13px" width="100%" borderRadius="full" />
            <Skeleton height="13px" width="88%" borderRadius="full" />
            <Skeleton height="13px" width="60%" borderRadius="full" />
          </VStack>

          <Skeleton height="280px" width="100%" borderRadius="none" />

          <HStack justify="space-between" px={5} pt={3} pb={1}>
            <Skeleton height="11px" width="55px" borderRadius="full" />
            <Skeleton height="11px" width="70px" borderRadius="full" />
          </HStack>

          <Box px={5} py={2}>
            <Skeleton height="1px" width="100%" />
          </Box>

          <HStack px={4} pb={4} gap={2}>
            <Skeleton height="32px" flex="1" borderRadius="xl" />
            <Skeleton height="32px" flex="1" borderRadius="xl" />
          </HStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};
