import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import mongoose from "mongoose";
import Post from "../models/post_model";
import { TranslatePostResponseDto } from "../dtos/ai.dto";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const ai = new GoogleGenAI({
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

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

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
    console.log("Using Gemini model:", model);
    console.log(
      "Gemini key suffix:",
      process.env.GEMINI_API_KEY?.slice(-6)
    );

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const rawText = response.text?.trim();

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
    console.error("Gemini translation error:", error);

    const message = String(error?.message || "");

    if (
      message.includes("429") ||
      message.includes("RESOURCE_EXHAUSTED")
    ) {
      throw new Error(
        "Gemini quota exceeded. Make sure you are using a key from the correct project and model gemini-2.5-flash."
      );
    }

    throw new Error(message || "AI translation failed");
  }
};

export default {
  translatePostToEnglish,
};