import { Request, Response } from "express";
import User from "../models/user_model";

const getMyInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).send("Access Denied");

    const user = await User.findById(userId).select("_id username email image");
    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch {
    res.status(500).send("Server error");
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select(
      "_id username email image"
    );
    if (!user) return res.status(404).send("User not found");

    res.status(200).json(user);
  } catch {
    res.status(500).send("Server error");
  }
};

const updateMyInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    if (!userId) return res.status(401).send("Access Denied");

    const { username } = req.body as { username?: string };

    const file = (req as any).file as Express.Multer.File | undefined;
    const imagePath = file ? `/uploads/profile/${file.filename}` : undefined;

    const update: { username?: string; image?: string } = {};

    if (username && username.trim().length > 0) {
      const existing = await User.findOne({
        username: username.trim(),
        _id: { $ne: userId },
      });

      if (existing) {
        return res.status(400).send("Username already taken");
      }

      update.username = username.trim();
    }

    if (imagePath) {
      update.image = imagePath;
    }

    // אם אין שום שינוי – נחזיר את המשתמש הקיים (מונע 400 בטסטים)
    if (Object.keys(update).length === 0) {
      const user = await User.findById(userId).select(
        "_id username email image"
      );
      return res.status(200).json(user);
    }

    const updated = await User.findByIdAndUpdate(userId, update, {
      returnDocument: "after",
      runValidators: true,
      select: "_id username email image",
    });

    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).send(err?.message || "Bad request");
  }
};

export default { getMyInfo, getById, updateMyInfo };