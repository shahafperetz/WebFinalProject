import "dotenv/config";
import OpenAI from "openai";
import mongoose from "mongoose";
import Post from "../models/post_model";
import { TranslatePostResponseDto } from "../dtos/ai.dto";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

const client = new OpenAI({
  apiKey,
});

const safeJsonParse = (
  raw: string
): { detectedLanguage: string; translatedText: string } | null => {
  try {
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const detectedLanguage =
      typeof parsed?.detectedLanguage === "string"
        ? parsed.detectedLanguage.trim()
        : "";

    const translatedText =
      typeof parsed?.translatedText === "string"
        ? parsed.translatedText.trim()
        : "";

    if (!detectedLanguage || !translatedText) {
      return null;
    }

    return {
      detectedLanguage,
      translatedText,
    };
  } catch {
    return null;
  }
};

const translatePostToEnglish = async (
  postId: string
): Promise<TranslatePostResponseDto> => {
  if (!mongoose.isValidObjectId(postId)) {
    throw new Error("Invalid post id");
  }

  const post = await Post.findById(postId).select("_id text");

  if (!post) {
    throw new Error("Post not found");
  }

  const originalText =
    typeof post.text === "string" ? post.text.trim() : "";

  if (!originalText) {
    throw new Error("Post text is empty");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const prompt = `
You are given a social media post.

Your task:
1. Detect the language of the original post.
2. Translate the post to English.
3. Return ONLY valid JSON in this exact format:
{
  "detectedLanguage": "string",
  "translatedText": "string"
}

Post:
"""${originalText}"""
`.trim();

  try {
    const response = await client.responses.create({
      model,
      input: prompt,
    });

    const rawText = response.output_text?.trim();

    if (!rawText) {
      throw new Error("AI returned empty response");
    }

    const parsed = safeJsonParse(rawText);

    if (!parsed) {
      throw new Error(`AI returned invalid JSON: ${rawText}`);
    }

    return {
      postId: String(post._id),
      originalText,
      detectedLanguage: parsed.detectedLanguage,
      translatedText: parsed.translatedText,
    };
  } catch (error: any) {
    throw new Error(error?.message || "AI translation failed");
  }
};

export default {
  translatePostToEnglish,
};