import { apiClient } from "../../../api/client";
import type { Post } from "../../posts/types/post.types";

export type AiSearchResponse = {
  message: string;
  parsedQuery: {
    keywords: string[];
    category: string | null;
    sentiment: "positive" | "negative" | "neutral" | null;
  };
  items: Post[];
  source: "ai" | "fallback";
};

export const searchPostsWithAi = async (query: string) => {
  const response = await apiClient.post<AiSearchResponse>("ai/search-posts", {
    query,
  });

  return response.data;
};
