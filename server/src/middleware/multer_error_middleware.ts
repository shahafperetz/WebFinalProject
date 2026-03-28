import { NextFunction, Request, Response } from "express";

export const multerErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    return next();
  }

  const message = err?.message || "Upload error";

  return res.status(400).json({
    message,
  });
};