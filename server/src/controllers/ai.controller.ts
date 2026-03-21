import { Request, Response } from "express";
import aiService from "../services/ai.service";

const searchPosts = async (req: Request, res: Response) => {
  try {
    const query = typeof req.body?.query === "string" ? req.body.query.trim() : "";

    if (query.length < 2) {
      return res.status(400).json({ message: "Query must contain at least 2 characters" });
    }

    if (query.length > 200) {
      return res.status(400).json({ message: "Query is too long" });
    }

    const viewerId = (req as any).user?._id ? String((req as any).user._id) : null;

    const result = await aiService.searchPostsWithAi(query, viewerId);

    return res.status(200).json({
      message: "AI search completed successfully",
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "AI search failed",
    });
  }
};

export default {
  searchPosts,
};