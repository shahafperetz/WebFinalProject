import express from "express";
import userController from "../controllers/user_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { uploadProfileImage } from "../middleware/upload_middleware";
import { multerErrorHandler } from "../middleware/multer_error_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Users API
 */

/**
 * @swagger
 * /users/myInfo:
 *   get:
 *     summary: Get my user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My profile
 */
router.get("/myInfo", authMiddleware, userController.getMyInfo);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile by id
 *     tags: [Users]
 */
router.get("/:id", userController.getById);

/**
 * @swagger
 * /users/myInfo:
 *   put:
 *     summary: Update username or profile image
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */
router.put(
  "/myInfo",
  authMiddleware,
  uploadProfileImage.single("image"),
  multerErrorHandler,
  userController.updateMyInfo
);

export default router;