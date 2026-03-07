import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export function HomePage() {
  return (
    <VStack align="start" gap={4}>
      <Heading>Home Feed</Heading>

      <Text color="gray.600">
        כאן יוצגו הפוסטים של המשתמשים עם גלילה מדורגת.
      </Text>

      <Box
        w="full"
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
      >
        <Text>שלב הבא: ליצור Post Card ו-Feed אמיתי.</Text>
      </Box>
    </VStack>
  );
}
