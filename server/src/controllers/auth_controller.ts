import { Request, Response } from "express";
import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ACCESS_EXPIRES = "2h";
const REFRESH_EXPIRES = "7d";

const signAccessToken = (userId: string) =>
  jwt.sign({ _id: userId }, process.env.JWT_SECRET!, { expiresIn: ACCESS_EXPIRES });

const signRefreshToken = (userId: string) =>
  jwt.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: REFRESH_EXPIRES });

const sanitizeUser = (user: any) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  image: user.image,
});

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // בפרודקשן true (https)
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password?: string;
    };

    if (!username || !email || !password) return res.status(400).send("Missing details");

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, email, password: hashedPassword });

    return res.status(201).json(sanitizeUser(user));
  } catch {
    return res.status(500).send("Server error");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as { username?: string; password?: string };
    if (!username || !password) return res.status(400).send("Missing details");

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Invalid credentials");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid credentials");

    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id));

    user.refreshToken = user.refreshToken || [];
    user.refreshToken.push(refreshToken);
    if (user.refreshToken.length > 5) user.refreshToken = user.refreshToken.slice(-5);
    await user.save();

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      accessToken,
      user: sanitizeUser(user),
    });
  } catch {
    return res.status(500).send("Server error");
  }
};

const googleSignin = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body as { credential?: string };
    if (!credential) return res.status(400).send("Missing credential");

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    if (!email) return res.status(400).send("Google auth failed");

    let user = await User.findOne({ email });

    if (!user) {
      const randomPass = "google-auth-" + Math.random().toString(36).slice(2);
      const hashed = await bcrypt.hash(randomPass, 10);

      user = await User.create({
        username: payload?.name || email.split("@")[0],
        email,
        password: hashed,
        image: payload?.picture || "",
      });
    }

    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id));

    user.refreshToken = user.refreshToken || [];
    user.refreshToken.push(refreshToken);
    if (user.refreshToken.length > 5) user.refreshToken = user.refreshToken.slice(-5);
    await user.save();

    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      accessToken,
      user: sanitizeUser(user),
    });
  } catch {
    return res.status(400).send("Invalid Google token");
  }
};

const logout = async (req: Request, res: Response) => {
  // token מגיע מה-cookie (אופציונלי גם מה-body כדי לתמוך ב-swagger)
  const refreshToken =
    (req.cookies?.refreshToken as string | undefined) ||
    (req.body?.refreshToken as string | undefined);

  if (!refreshToken) {
    clearRefreshCookie(res);
    return res.status(200).send("Logged out successfully");
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };
    const user = await User.findById(payload._id);

    if (user) {
      user.refreshToken = (user.refreshToken || []).filter((t) => t !== refreshToken);
      await user.save();
    }

    clearRefreshCookie(res);
    return res.status(200).send("Logged out successfully");
  } catch {
    clearRefreshCookie(res);
    return res.status(200).send("Logged out successfully");
  }
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken =
    (req.cookies?.refreshToken as string | undefined) ||
    (req.body?.refreshToken as string | undefined);

  if (!refreshToken) return res.status(400).send("No token provided");

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { _id: string };

    const user = await User.findById(payload._id);
    if (!user || !user.refreshToken?.includes(refreshToken)) {
      return res.status(400).send("Invalid token");
    }

    const newAccessToken = signAccessToken(String(user._id));
    const newRefreshToken = signRefreshToken(String(user._id));

    user.refreshToken = user.refreshToken.filter((t) => t !== refreshToken);
    user.refreshToken.push(newRefreshToken);
    if (user.refreshToken.length > 5) user.refreshToken = user.refreshToken.slice(-5);
    await user.save();

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch {
    return res.status(400).send("Invalid token");
  }
};

export default { register, login, googleSignin, logout, refresh };