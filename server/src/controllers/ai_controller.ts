import { Request, Response } from "express";
import aiService from "../services/ai.service";

const translatePostToEnglish = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId || Array.isArray(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const result = await aiService.translatePostToEnglish(postId);

    return res.status(200).json({
      message: "Post translated successfully",
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Translation failed",
    });
  }
};

export default {
  translatePostToEnglish,
};