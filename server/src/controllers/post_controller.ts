import { Request, Response } from "express";
import Post from "../models/post_model";
import mongoose from "mongoose";

const parseIntSafe = (value: any, fallback: number) => {
  const n = Number.parseInt(String(value), 10);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id as string | undefined;
    if (!userId) return res.status(401).send("Access Denied");

    const { text } = req.body as { text?: string };
    if (!text || text.trim().length === 0) return res.status(400).send("Text is required");

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
    return res.status(400).send(err?.message || "Bad request");
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const skip = parseIntSafe(req.query.skip, 0);
    const limit = Math.min(parseIntSafe(req.query.limit, 10), 50);

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "_id username image")
      .select("_id owner text image likes commentsCount createdAt updatedAt");

    const viewerId = (req as any).user?._id ? String((req as any).user._id) : null;

    const response = posts.map((p: any) => ({
      _id: p._id,
      owner: p.owner,
      text: p.text,
      image: p.image,
      commentsCount: p.commentsCount,
      likesCount: Array.isArray(p.likes) ? p.likes.length : 0,
      likedByMe: viewerId ? (p.likes || []).some((id: any) => String(id) === viewerId) : false,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return res.status(200).json({ skip, limit, items: response });
  } catch {
    return res.status(500).send("Server error");
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id as string | undefined;
    if (!userId) return res.status(401).send("Access Denied");

    const skip = parseIntSafe(req.query.skip, 0);
    const limit = Math.min(parseIntSafe(req.query.limit, 10), 50);

    const posts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "_id username image")
      .select("_id owner text image likes commentsCount createdAt updatedAt");

    const viewerId = String(userId);

    const response = posts.map((p: any) => ({
      _id: p._id,
      owner: p.owner,
      text: p.text,
      image: p.image,
      commentsCount: p.commentsCount,
      likesCount: Array.isArray(p.likes) ? p.likes.length : 0,
      likedByMe: (p.likes || []).some((id: any) => String(id) === viewerId),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return res.status(200).json({ skip, limit, items: response });
  } catch {
    return res.status(500).send("Server error");
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id as string | undefined;
    if (!userId) return res.status(401).send("Access Denied");

    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).send("Post not found");

    if (String(post.owner) !== String(userId)) return res.status(403).send("Not allowed");

    const { text } = req.body as { text?: string };
    const file = (req as any).file as Express.Multer.File | undefined;
    const imagePath = file ? `/uploads/posts/${file.filename}` : undefined;

    const hasTextUpdate = typeof text === "string";
    const hasImageUpdate = typeof imagePath === "string";

    if (!hasTextUpdate && !hasImageUpdate) {
      const populated = await Post.findById(id).populate("owner", "_id username image");
      return res.status(200).json(populated);
    }

    if (hasTextUpdate) {
      const trimmed = text!.trim();
      if (trimmed.length === 0) return res.status(400).send("Text is required");
      post.text = trimmed;
    }

    if (hasImageUpdate) post.image = imagePath!;

    await post.save();

    const populated = await Post.findById(id).populate("owner", "_id username image");
    return res.status(200).json(populated);
  } catch (err: any) {
    return res.status(400).send(err?.message || "Bad request");
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id as string | undefined;
    if (!userId) return res.status(401).send("Access Denied");

    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).send("Post not found");

    if (String(post.owner) !== String(userId)) return res.status(403).send("Not allowed");

    await Post.findByIdAndDelete(id);
    return res.status(200).send("Deleted");
  } catch {
    return res.status(500).send("Server error");
  }
};

const toggleLike = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id as string | undefined;
    if (!userId) return res.status(401).send("Access Denied");

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).send("Invalid post id");

    const post = await Post.findById(id).select("_id likes");
    if (!post) return res.status(404).send("Post not found");

    const alreadyLiked = (post.likes || []).some((uid: any) => String(uid) === String(userId));

    const update = alreadyLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    const updated = await Post.findByIdAndUpdate(
      id,
      update,
      { returnDocument: "after" }
    ).select("_id likes");

    const likesCount = updated?.likes?.length || 0;
    const likedByMe = !alreadyLiked;

    return res.status(200).json({ postId: id, likesCount, likedByMe });
  } catch {
    return res.status(500).send("Server error");
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