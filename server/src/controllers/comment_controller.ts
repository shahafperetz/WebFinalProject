import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/comment_model";
import Post from "../models/post_model";
import { CreateCommentDto } from "../dtos/comment.dto";

const parseIntSafe = (value: any, fallback: number) => {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

const addComment = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id as string | undefined;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const { text } = req.body as CreateCommentDto;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Text is required" });
    }

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      postId,
      owner: userId,
      text: text.trim(),
    });

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    const populated = await Comment.findById(comment._id)
      .populate("owner", "_id username image")
      .select("_id postId owner text createdAt updatedAt");

    return res.status(201).json(populated);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const skip = parseIntSafe(req.query.skip, 0);
    const limit = Math.min(parseIntSafe(req.query.limit, 20), 50);

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "_id username image")
      .select("_id postId owner text createdAt updatedAt");

    return res.status(200).json({ skip, limit, items: comments });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export default { addComment, getCommentsByPost };