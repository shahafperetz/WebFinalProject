import { Response } from "express";
import jwt from "jsonwebtoken";

const ACCESS_EXPIRES = "2h";
const REFRESH_EXPIRES = "7d";

const isProduction = process.env.NODE_ENV === "production";

export const signAccessToken = (userId: string) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_EXPIRES,
  });

export const signRefreshToken = (userId: string) =>
  jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: REFRESH_EXPIRES,
  });

export const sanitizeUser = (user: any) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  image: user.image,
});

export const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
};