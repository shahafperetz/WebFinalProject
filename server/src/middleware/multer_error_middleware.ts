import { NextFunction, Request, Response } from "express";

/**
 * תופס שגיאות של multer/fileFilter
 * ומחזיר 400 במקום שהבקשה תיתקע (מה שגרם ל-timeout בטסטים).
 */
export const multerErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) return next();

  const message = err?.message || "Upload error";
  return res.status(400).send(message);
};