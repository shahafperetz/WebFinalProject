import User from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import {
  sanitizeUser,
  signAccessToken,
  signRefreshToken,
} from "../utils/auth";
import {
  GoogleSigninDto,
  LoginDto,
  RegisterDto,
} from "../dtos/auth.dto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const keepLastFiveTokens = (tokens: string[]) => {
  if (tokens.length > 5) {
    return tokens.slice(-5);
  }

  return tokens;
};

const generateUniqueUsername = async (baseUsername: string) => {
  const cleanedBase = baseUsername.trim().replace(/\s+/g, "_").slice(0, 30) || "user";

  let candidate = cleanedBase;
  let counter = 1;

  while (await User.findOne({ username: candidate })) {
    candidate = `${cleanedBase}_${counter}`;
    counter += 1;
  }

  return candidate;
};

const registerUser = async ({ username, email, password }: RegisterDto) => {
  if (!username || !email || !password) {
    throw new Error("Missing details");
  }

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: trimmedUsername,
    email: trimmedEmail,
    password: hashedPassword,
  });

  return {
    status: 201,
    data: sanitizeUser(user),
  };
};

const loginUser = async ({ username, password }: LoginDto) => {
  if (!username || !password) {
    throw new Error("Missing details");
  }

  const trimmedUsername = username.trim();

  const user = await User.findOne({ username: trimmedUsername });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const accessToken = signAccessToken(String(user._id));
  const refreshToken = signRefreshToken(String(user._id));

  user.refreshToken = user.refreshToken || [];
  user.refreshToken.push(refreshToken);
  user.refreshToken = keepLastFiveTokens(user.refreshToken);
  await user.save();

  return {
    status: 200,
    data: {
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    },
  };
};

const googleSigninUser = async ({ credential }: GoogleSigninDto) => {
  if (!credential) {
    throw new Error("Missing credential");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload?.email?.trim().toLowerCase();

  if (!email) {
    throw new Error("Google auth failed");
  }

  let user = await User.findOne({ email });

  if (!user) {
    const randomPass = "google-auth-" + Math.random().toString(36).slice(2);
    const hashedPassword = await bcrypt.hash(randomPass, 10);

    const baseUsername = payload?.name || email.split("@")[0];
    const uniqueUsername = await generateUniqueUsername(baseUsername);

    user = await User.create({
      username: uniqueUsername,
      email,
      password: hashedPassword,
      image: payload?.picture || "",
    });
  }

  const accessToken = signAccessToken(String(user._id));
  const refreshToken = signRefreshToken(String(user._id));

  user.refreshToken = user.refreshToken || [];
  user.refreshToken.push(refreshToken);
  user.refreshToken = keepLastFiveTokens(user.refreshToken);
  await user.save();

  return {
    status: 200,
    data: {
      accessToken,
      refreshToken,
      user: sanitizeUser(user),
    },
  };
};

const logoutUser = async (refreshToken?: string) => {
  if (!refreshToken) {
    return {
      status: 200,
      data: "Logged out successfully",
    };
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { _id: string };

    const user = await User.findById(payload._id);

    if (user) {
      user.refreshToken = (user.refreshToken || []).filter(
        (token) => token !== refreshToken
      );
      await user.save();
    }
  } catch {
    // ignore invalid token and still logout successfully
  }

  return {
    status: 200,
    data: "Logged out successfully",
  };
};

const refreshSession = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new Error("No token provided");
  }

  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  ) as { _id: string };

  const user = await User.findById(payload._id);

  if (!user || !user.refreshToken?.includes(refreshToken)) {
    throw new Error("Invalid token");
  }

  const newAccessToken = signAccessToken(String(user._id));
  const newRefreshToken = signRefreshToken(String(user._id));

  user.refreshToken = user.refreshToken.filter(
    (token) => token !== refreshToken
  );
  user.refreshToken.push(newRefreshToken);
  user.refreshToken = keepLastFiveTokens(user.refreshToken);
  await user.save();

  return {
    status: 200,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  };
};

export default {
  registerUser,
  loginUser,
  googleSigninUser,
  logoutUser,
  refreshSession,
};