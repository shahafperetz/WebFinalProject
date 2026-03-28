import { Request, Response } from "express";
import authService from "../services/auth.service";
import { clearRefreshCookie, setRefreshCookie } from "../utils/auth";
import {
  GoogleSigninDto,
  LoginDto,
  RegisterDto,
} from "../dtos/auth.dto";

const register = async (req: Request, res: Response) => {
  try {
    const dto = req.body as RegisterDto;
    const result = await authService.registerUser(dto);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(400).json({ message: "Register failed" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const dto = req.body as LoginDto;
    const result = await authService.loginUser(dto);

    setRefreshCookie(res, result.data.refreshToken);

    return res.status(result.status).json({
      accessToken: result.data.accessToken,
      user: result.data.user,
    });
  } catch (error) {
    return res.status(400).json({ message: "Login failed" });
  }
};

const googleSignin = async (req: Request, res: Response) => {
  try {
    const dto = req.body as GoogleSigninDto;
    const result = await authService.googleSigninUser(dto);

    setRefreshCookie(res, result.data.refreshToken);

    return res.status(result.status).json({
      accessToken: result.data.accessToken,
      user: result.data.user,
    });
  } catch (error) {
    return res.status(400).json({ message: "Google sign in failed" });
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken =
    (req.cookies?.refreshToken as string | undefined) ||
    (req.body?.refreshToken as string | undefined);

  try {
    const result = await authService.logoutUser(refreshToken);
    clearRefreshCookie(res);
    return res.status(result.status).json({ message: result.data });
  } catch (error) {
    clearRefreshCookie(res);
    return res.status(200).json({ message: "Logged out successfully" });
  }
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken =
    (req.cookies?.refreshToken as string | undefined) ||
    (req.body?.refreshToken as string | undefined);

  try {
    const result = await authService.refreshSession(refreshToken);

    setRefreshCookie(res, result.data.refreshToken);

    return res.status(result.status).json({
      accessToken: result.data.accessToken,
    });
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};

export default { register, login, googleSignin, logout, refresh };