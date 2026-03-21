import "dotenv/config";
import OpenAI from "openai";
import Post from "../models/post_model";
import { buildPostSearchPrompt } from "../ai/ai.prompts";

type ParsedAiSearch = {
  keywords: string[];
  category: string | null;
  sentiment: "positive" | "negative" | "neutral" | null;
};

type CachedValue = {
  expiresAt: number;
  value: {
    parsedQuery: ParsedAiSearch;
    items: any[];
    source: "ai" | "fallback";
  };
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const cache = new Map<string, CachedValue>();
const CACHE_TTL_MS = 5 * 60 * 1000;

const getCached = (key: string) => {
  const existing = cache.get(key);
  if (!existing) return null;

  if (Date.now() > existing.expiresAt) {
    cache.delete(key);
    return null;
  }

  return existing.value;
};

const setCached = (key: string, value: CachedValue["value"]) => {
  cache.set(key, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    value,
  });
};

const safeJsonParse = (raw: string): ParsedAiSearch | null => {
  try {
    const parsed = JSON.parse(raw);

    const keywords = Array.isArray(parsed?.keywords)
      ? parsed.keywords.filter((item: unknown) => typeof item === "string").slice(0, 5)
      : [];

    const category = typeof parsed?.category === "string" ? parsed.category : null;

    const sentiment =
      parsed?.sentiment === "positive" ||
      parsed?.sentiment === "negative" ||
      parsed?.sentiment === "neutral"
        ? parsed.sentiment
        : null;

    return {
      keywords,
      category,
      sentiment,
    };
  } catch {
    return null;
  }
};

const normalizePost = (post: any, viewerId: string | null) => ({
  _id: post._id,
  owner: post.owner,
  text: post.text,
  image: post.image,
  commentsCount: post.commentsCount,
  likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
  likedByMe: viewerId ? (post.likes || []).some((id: any) => String(id) === viewerId) : false,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const searchPostsByKeywords = async (keywords: string[], viewerId: string | null) => {
  const cleanKeywords = keywords
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 5);

  if (cleanKeywords.length === 0) {
    return [];
  }

  const orConditions = cleanKeywords.map((keyword) => ({
    text: { $regex: keyword, $options: "i" },
  }));

  const posts = await Post.find({ $or: orConditions })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("owner", "_id username image")
    .select("_id owner text image likes commentsCount createdAt updatedAt");

  return posts.map((post: any) => normalizePost(post, viewerId));
};

const fallbackSearch = async (query: string, viewerId: string | null) => {
  const tokens = query
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1)
    .slice(0, 5);

  const items = await searchPostsByKeywords(tokens, viewerId);

  return {
    parsedQuery: {
      keywords: tokens,
      category: null,
      sentiment: null,
    } as ParsedAiSearch,
    items,
    source: "fallback" as const,
  };
};

const parseQueryWithAi = async (query: string): Promise<ParsedAiSearch> => {
  const model = process.env.OPENAI_MODEL || "gpt-5-mini";

  const response = await client.responses.create({
    model,
    input: buildPostSearchPrompt(query),
  });

  const rawText = response.output_text?.trim();
  if (!rawText) {
    throw new Error("AI returned empty response");
  }

  const parsed = safeJsonParse(rawText);
  if (!parsed) {
    throw new Error("AI returned invalid JSON");
  }

  return parsed;
};

const searchPostsWithAi = async (query: string, viewerId: string | null) => {
  const cacheKey = query.trim().toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const parsedQuery = await parseQueryWithAi(query);

    const items = await searchPostsByKeywords(parsedQuery.keywords, viewerId);

    const result = {
      parsedQuery,
      items,
      source: "ai" as const,
    };

    setCached(cacheKey, result);
    return result;
  } catch {
    const fallback = await fallbackSearch(query, viewerId);
    setCached(cacheKey, fallback);
    return fallback;
  }
};

export default {
  searchPostsWithAi,
};