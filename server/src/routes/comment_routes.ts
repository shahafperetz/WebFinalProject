import express from "express";
import commentController from "../controllers/comment_controller";
import { authMiddleware } from "../middleware/auth_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Comments
 *     description: Comments API
 */

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a post (paged)
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
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
 *         description: Comments list
 */
router.get("/posts/:postId/comments", commentController.getCommentsByPost);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Add comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/posts/:postId/comments", authMiddleware, commentController.addComment);

export default router;