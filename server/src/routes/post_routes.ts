import express from "express";
import postController from "../controllers/post_controller";
import { authMiddleware } from "../middleware/auth_middleware";
import { uploadPostImage } from "../middleware/upload_middleware";
import { multerErrorHandler } from "../middleware/multer_error_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Posts API
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get feed posts with paging (skip/limit)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feed posts
 */
router.get("/", postController.getPosts);

/**
 * @swagger
 * /posts/my:
 *   get:
 *     summary: Get my posts with paging
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.get("/my", authMiddleware, postController.getMyPosts);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 */
router.post(
  "/",
  authMiddleware,
  uploadPostImage.single("image"),
  multerErrorHandler,
  postController.createPost
);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update my post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  authMiddleware,
  uploadPostImage.single("image"),
  multerErrorHandler,
  postController.updatePost
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete my post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authMiddleware, postController.deletePost);

/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Toggle like on a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/like", authMiddleware, postController.toggleLike);

export default router;