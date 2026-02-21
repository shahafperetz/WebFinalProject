import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const makeStorage = (subFolder: "profile" | "posts") => {
  const uploadDir = path.join(process.cwd(), "uploads", subFolder);
  ensureDir(uploadDir);

  return multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const baseName = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9_-]/g, "")
        .slice(0, 40);

      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${baseName || "image"}-${unique}${ext}`);
    },
  });
};

/**
 * ⚠️ חשוב:
 * supertest לפעמים לא שולח mimetype אמיתי,
 * לכן מאמתים לפי extension בלבד.
 */
const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

  if (!allowedExt.includes(ext)) {
    return cb(new Error("Only image files are allowed"));
  }

  cb(null, true);
};

export const uploadProfileImage = multer({
  storage: makeStorage("profile"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadPostImage = multer({
  storage: makeStorage("posts"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});