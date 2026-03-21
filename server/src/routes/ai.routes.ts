import express from "express";
import aiController from "./ai.controller";
import { authMiddleware } from "../middleware/auth_middleware";

const router = express.Router();

router.post("/search-posts", authMiddleware, aiController.searchPosts);

export default router;