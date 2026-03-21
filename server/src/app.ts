import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth_routes";
import userRoutes from "./routes/user_routes";
import postRoutes from "./routes/post_routes";
import commentRoutes from "./routes/comment_routes";
import aiRoutes from "./ai/ai.routes";

dotenv.config();

const app: Express = express();

app.use(
  cors({
    origin: true, // בפרודקשן לשים דומיין פרונט ספציפי
    credentials: true, // חובה לקוקיז
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

// Swagger
const apisPath = path.join(__dirname, "routes", "*.*");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Final Project API",
      version: "1.0.0",
      description: "API for the Web Application Course final project",
    },
    servers: [{ url: "http://localhost:3001" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
        },
      },
    },
  },
  apis: [apisPath],
};
const specs = swaggerJsDoc(options);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/", commentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// DB
const mongoUrl =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/WEBFINALPROJECT";
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Mongo connection error:", err));

export default app;
