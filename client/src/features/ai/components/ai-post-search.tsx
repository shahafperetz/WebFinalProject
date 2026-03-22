import { useEffect, useState } from "react";
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
import { getErrorMessage } from "../../../utils/get-error-message";
import type { Post } from "../../posts/types/post.types";

type AiPostSearchProps = {
  onResultsChange: (results: Post[] | null) => void;
  resetSignal: number;
};

export const AiPostSearch = ({
  onResultsChange,
  resetSignal,
}: AiPostSearchProps) => {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<AiSearchResponse["items"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setQuery("");
    setItems([]);
    setError("");
    setHasSearched(false);
  }, [resetSignal]);

  const handleSearch = async () => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setError("Please enter at least 2 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      const result = await searchPostsWithAi(trimmed);
      const filteredItems = result.items.filter((post) => post.owner?._id);

      setItems(filteredItems);
      onResultsChange(filteredItems);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "AI search failed"));
      setItems([]);
      onResultsChange([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setItems([]);
    setError("");
    setHasSearched(false);
    onResultsChange(null);
  };

  return (
    <VStack align="stretch" gap={4}>
      <Box p={4} borderWidth="1px" rounded="xl" bg="white">
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Smart AI Search
        </Text>

        <Text fontSize="sm" color="gray.600" mb={4}>
          Search posts using natural language.
        </Text>

        <HStack>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts with AI..."
          />

          <Button onClick={handleSearch} colorPalette="blue" disabled={loading}>
            Search
          </Button>

          <Button variant="outline" onClick={handleClear} disabled={loading}>
            Clear
          </Button>
        </HStack>

        {error ? (
          <Alert.Root status="error" mt={4}>
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
      </Box>

      {hasSearched && !loading && !error && !items.length ? (
        <Box p={6} borderWidth="1px" rounded="xl" bg="white">
          <Text color="gray.500">No matching posts were found.</Text>
        </Box>
      ) : null}

      {hasSearched && items.length ? (
        <VStack align="stretch" gap={6}>
          {items.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </VStack>
      ) : null}
    </VStack>
  );
};
