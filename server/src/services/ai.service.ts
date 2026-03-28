import "dotenv/config";
import OpenAI from "openai";
import mongoose from "mongoose";
import Post from "../models/post_model";
import { TranslatePostResponseDto } from "../dtos/ai.dto";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const safeJsonParse = (raw: string): { detectedLanguage: string; translatedText: string } | null => {
  try {
    const parsed = JSON.parse(raw);

    const detectedLanguage =
      typeof parsed?.detectedLanguage === "string" ? parsed.detectedLanguage.trim() : "";

    const translatedText =
      typeof parsed?.translatedText === "string" ? parsed.translatedText.trim() : "";

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

  const originalText = typeof post.text === "string" ? post.text.trim() : "";
  if (!originalText) {
    throw new Error("Post text is empty");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5-mini";

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
    throw new Error("AI returned invalid JSON");
  }

  return {
    postId: String(post._id),
    originalText,
    detectedLanguage: parsed.detectedLanguage,
    translatedText: parsed.translatedText,
  };
};

export default {
  translatePostToEnglish,
};