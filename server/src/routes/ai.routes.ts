import express from "express";
import aiController from "../controllers/ai_controller";
import { authMiddleware } from "../middleware/auth_middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI
 *   description: AI related endpoints
 */

/**
 * @swagger
 * /ai/translate/{postId}:
 *   post:
 *     summary: Detect the language of a post and translate it to English
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post id
 *     responses:
 *       200:
 *         description: Post translated successfully
 *       400:
 *         description: Invalid post id
 *       404:
 *         description: Post not found
 */
router.post(
  "/translate/:postId",
  authMiddleware,
  aiController.translatePostToEnglish
);

export default router;