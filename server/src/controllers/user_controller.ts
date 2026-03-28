import { Request, Response } from "express";
import User from "../models/user_model";
import { UpdateMyInfoDto } from "../dtos/user.dto";

const getMyInfo = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const foundUser = await User.findById(userId).select("_id username email image");
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(foundUser);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("_id username image");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateMyInfo = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const { username } = req.body as UpdateMyInfoDto;

    const file = (req as any).file as Express.Multer.File | undefined;
    const imagePath = file ? `/uploads/profile/${file.filename}` : undefined;

    const update: { username?: string; image?: string } = {};

    if (username && username.trim().length > 0) {
      const trimmedUsername = username.trim();

      const existing = await User.findOne({
        username: trimmedUsername,
        _id: { $ne: userId },
      });

      if (existing) {
        return res.status(400).json({ message: "Username already taken" });
      }

      update.username = trimmedUsername;
    }

    if (imagePath) {
      update.image = imagePath;
    }

    if (Object.keys(update).length === 0) {
      const currentUser = await User.findById(userId).select("_id username email image");
      return res.status(200).json(currentUser);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      returnDocument: "after",
      runValidators: true,
      select: "_id username email image",
    });

    return res.status(200).json(updatedUser);
  } catch (err: any) {
    return res.status(400).json({ message: err?.message || "Bad request" });
  }
};

export default { getMyInfo, getById, updateMyInfo };