import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/post_model";
import {
  CreatePostDto,
  UpdatePostDto,
} from "../dtos/post.dto";

const parseIntSafe = (value: any, fallback: number) => {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

const createPost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const { text } = req.body as CreatePostDto;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: "Text is required" });
    }

    const file = (req as any).file as Express.Multer.File | undefined;
    const imagePath = file ? `/uploads/posts/${file.filename}` : "";

    const post = await Post.create({
      owner: userId,
      text: text.trim(),
      image: imagePath,
      likes: [],
      commentsCount: 0,
    });

    const populated = await Post.findById(post._id).populate("owner", "_id username image");
    return res.status(201).json(populated);
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Bad request" });
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    const skip = parseIntSafe(req.query.skip, 0);
    const limit = Math.min(parseIntSafe(req.query.limit, 10), 50);

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "_id username image")
      .select("_id owner text image likes commentsCount createdAt updatedAt");

    const viewerId = userId ? String(userId) : null;

    const items = posts.map((post: any) => ({
      _id: post._id,
      owner: post.owner,
      text: post.text,
      image: post.image,
      commentsCount: post.commentsCount,
      likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
      likedByMe: viewerId
        ? (post.likes || []).some((id: any) => String(id) === viewerId)
        : false,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return res.status(200).json({ skip, limit, items });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const skip = parseIntSafe(req.query.skip, 0);
    const limit = Math.min(parseIntSafe(req.query.limit, 10), 50);

    const posts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "_id username image")
      .select("_id owner text image likes commentsCount createdAt updatedAt");

    const viewerId = String(userId);

    const items = posts.map((post: any) => ({
      _id: post._id,
      owner: post.owner,
      text: post.text,
      image: post.image,
      commentsCount: post.commentsCount,
      likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
      likedByMe: (post.likes || []).some((id: any) => String(id) === viewerId),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    return res.status(200).json({ skip, limit, items });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.owner) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { text } = req.body as UpdatePostDto;
    const file = (req as any).file as Express.Multer.File | undefined;
    const imagePath = file ? `/uploads/posts/${file.filename}` : undefined;

    const hasTextUpdate = typeof text === "string";
    const hasImageUpdate = typeof imagePath === "string";

    if (!hasTextUpdate && !hasImageUpdate) {
      const populated = await Post.findById(id).populate("owner", "_id username image");
      return res.status(200).json(populated);
    }

    if (hasTextUpdate) {
      const trimmedText = text!.trim();
      if (trimmedText.length === 0) {
        return res.status(400).json({ message: "Text is required" });
      }
      post.text = trimmedText;
    }

    if (hasImageUpdate) {
      post.image = imagePath!;
    }

    await post.save();

    const populated = await Post.findById(id).populate("owner", "_id username image");
    return res.status(200).json(populated);
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Bad request" });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (String(post.owner) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const toggleLike = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post id" });
    }

    const post = await Post.findById(id).select("_id likes");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = (post.likes || []).some(
      (likedUserId: any) => String(likedUserId) === String(userId)
    );

    const update = alreadyLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updated = await Post.findByIdAndUpdate(id, update, {
      returnDocument: "after",
    }).select("_id likes");

    const likesCount = updated?.likes?.length || 0;
    const likedByMe = !alreadyLiked;

    return res.status(200).json({
      postId: id,
      likesCount,
      likedByMe,
    });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  createPost,
  getPosts,
  getMyPosts,
  updatePost,
  deletePost,
  toggleLike,
};