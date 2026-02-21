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
 *           example: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Feed posts
 */
router.get("/", postController.getPosts);

/**
 * @swagger
 * /posts/my:
 *   get:
 *     summary: Get my posts with paging (skip/limit)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *         description: My posts
 */
router.get("/my", authMiddleware, postController.getMyPosts);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a post (text required, image optional)
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
 *     responses:
 *       201:
 *         description: Post created
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
 *     summary: Update my post (text and/or image)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Post updated
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Post not found
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
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Post not found
 */
router.delete("/:id", authMiddleware, postController.deletePost);

export default router;