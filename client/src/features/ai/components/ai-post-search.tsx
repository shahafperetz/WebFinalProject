import { useState } from "react";
import type { AxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { PostCard } from "../../posts/components/post-card";
import {
  searchPostsWithAi,
  type AiSearchResponse,
} from "../api/search-posts-with-ai";

type ApiErrorResponse = {
  message?: string;
};

export const AiPostSearch = () => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<AiSearchResponse["items"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<{
    keywords: string[];
    category: string | null;
    sentiment: "positive" | "negative" | "neutral" | null;
    source: "ai" | "fallback";
  } | null>(null);

  const handleSearch = async () => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setError("Please enter at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await searchPostsWithAi(trimmed);

      setItems(result.items);
      setMeta({
        keywords: result.parsedQuery.keywords,
        category: result.parsedQuery.category,
        sentiment: result.parsedQuery.sentiment,
        source: result.source,
      });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || "AI search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setItems([]);
    setMeta(null);
    setError("");
  };

  return (
    <VStack align="stretch" gap={4}>
      <Box p={4} borderWidth="1px" rounded="xl" bg="white">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Smart AI Search
        </Text>

        <HStack>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: happy travel posts, study posts, beach photos..."
          />

          <Button onClick={handleSearch} colorPalette="blue" disabled={loading}>
            Search
          </Button>

          <Button variant="outline" onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        </HStack>

        {error ? (
          <Alert.Root status="error" mt={3}>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Error</Alert.Title>
              <Alert.Description>{error}</Alert.Description>
            </Alert.Content>
          </Alert.Root>
        ) : null}

        {loading ? (
          <HStack mt={4}>
            <Spinner size="sm" />
            <Text>Searching...</Text>
          </HStack>
        ) : null}

        {meta ? (
          <Box mt={4} p={3} bg="gray.50" rounded="md">
            <Text fontWeight="semibold">AI interpretation</Text>
            <Text>Keywords: {meta.keywords.join(", ") || "None"}</Text>
            <Text>Category: {meta.category || "None"}</Text>
            <Text>Sentiment: {meta.sentiment || "None"}</Text>
            <Text>Source: {meta.source}</Text>
          </Box>
        ) : null}
      </Box>

      {items.length ? (
        <VStack align="stretch" gap={6}>
          {items
            .filter((post) => post.owner?._id)
            .map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </VStack>
      ) : null}
    </VStack>
  );
};
