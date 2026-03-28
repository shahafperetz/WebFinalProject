import express from "express";
import userController from "../controllers/user_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { uploadProfileImage } from "../middleware/upload_middleware";
import { multerErrorHandler } from "../middleware/multer_error_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile endpoints
 */

/**
 * @swagger
 * /users/myInfo:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned successfully
 */
router.get("/myInfo", authMiddleware, userController.getMyInfo);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile returned successfully
 */
router.get("/:id", userController.getById);

/**
 * @swagger
 * /users/myInfo:
 *   put:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
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
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router.put(
  "/myInfo",
  authMiddleware,
  uploadProfileImage.single("image"),
  multerErrorHandler,
  userController.updateMyInfo
);

export default router;