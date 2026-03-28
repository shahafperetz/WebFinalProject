import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const port = Number(process.env.PORT) || 3001;

const mongoUrl =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/WEBFINALPROJECT";

mongoose
  .connect(mongoUrl)
  .then(() => {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.SERVER_URL || "https://node16.cs.colman.ac.il"
        : `http://localhost:${port}`;

    app.listen(port, () => {
      console.log(`Server is running on ${baseUrl}`);
      console.log(`Swagger docs available at ${baseUrl}/api-docs`);
    });
  })
  .catch((error) => {
    console.error("Mongo connection error:", error);
    process.exit(1);
  });