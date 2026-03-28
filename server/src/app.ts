import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";

import authRoutes from "./routes/auth_routes";
import userRoutes from "./routes/user_routes";
import postRoutes from "./routes/post_routes";
import commentRoutes from "./routes/comment_routes";
import aiRoutes from "./routes/ai.routes";
import swaggerSpec from "./config/swagger";

const app: Express = express();

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: isProduction ? process.env.CLIENT_URL || true : true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/ai", aiRoutes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export default app;