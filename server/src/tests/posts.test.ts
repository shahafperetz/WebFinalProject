import request from "supertest";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import app from "../app";
import User from "../models/user_model";
import Post from "../models/post_model";

const firstUser = {
  username: "posts_user",
  email: "posts_user@example.com",
  password: "password123",
};

const secondUser = {
  username: "posts_user_2",
  email: "posts_user_2@example.com",
  password: "password123",
};

let accessToken = "";
let secondAccessToken = "";

const createTinyPng = (): string => {
  const tempDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const pngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5G2uoAAAAASUVORK5CYII=";

  const imgPath = path.join(tempDir, `post-${Date.now()}.png`);
  fs.writeFileSync(imgPath, Buffer.from(pngBase64, "base64"));
  return imgPath;
};

beforeAll(async () => {
  const mongoUrl =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/WEBFINALPROJECT_TEST";

  await mongoose.connect(mongoUrl);

  await User.deleteMany({});
  await Post.deleteMany({});

  await request(app).post("/auth/register").send(firstUser);
  await request(app).post("/auth/register").send(secondUser);

  const loginRes1 = await request(app).post("/auth/login").send({
    username: firstUser.username,
    password: firstUser.password,
  });

  accessToken = loginRes1.body.accessToken;

  const loginRes2 = await request(app).post("/auth/login").send({
    username: secondUser.username,
    password: secondUser.password,
  });

  secondAccessToken = loginRes2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Posts API", () => {
  test("POST /posts creates post with text only", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("text", "hello world");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.text).toBe("hello world");
  });

  test("POST /posts fails without token", async () => {
    const res = await request(app).post("/posts").field("text", "hello");

    expect(res.statusCode).toBe(401);
  });

  test("POST /posts fails without text", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(400);
  });

  test(
    "POST /posts creates post with image",
    async () => {
      const imgPath = createTinyPng();

      const res = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${accessToken}`)
        .field("text", "post with image")
        .attach("image", imgPath);

      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe("post with image");
      expect(String(res.body.image)).toContain("/uploads/posts/");

      fs.unlinkSync(imgPath);
    },
    15000
  );

  test("GET /posts returns paged feed", async () => {
    const res = await request(app).get("/posts?skip=0&limit=10");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test("GET /posts/my returns my posts", async () => {
    const res = await request(app)
      .get("/posts/my?skip=0&limit=10")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test("PUT /posts/:id updates my post text", async () => {
    const createRes = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("text", "to update");

    const postId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .field("text", "updated text");

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.text).toBe("updated text");
  });

  test("PUT /posts/:id returns 403 for other user post", async () => {
    const createRes = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("text", "owner only");

    const postId = createRes.body._id;

    const updateRes = await request(app)
      .put(`/posts/${postId}`)
      .set("Authorization", `Bearer ${secondAccessToken}`)
      .field("text", "not allowed");

    expect(updateRes.statusCode).toBe(403);
  });

  test("DELETE /posts/:id deletes my post", async () => {
    const createRes = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("text", "to delete");

    const postId = createRes.body._id;

    const delRes = await request(app)
      .delete(`/posts/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(delRes.statusCode).toBe(200);
  });

  test("POST /posts/:id/like toggles like and unlike", async () => {
    const createRes = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("text", "like me");

    const postId = createRes.body._id;

    const likeRes = await request(app)
      .post(`/posts/${postId}/like`)
      .set("Authorization", `Bearer ${secondAccessToken}`);

    expect(likeRes.statusCode).toBe(200);
    expect(likeRes.body.likesCount).toBe(1);
    expect(likeRes.body.likedByMe).toBe(true);

    const unlikeRes = await request(app)
      .post(`/posts/${postId}/like`)
      .set("Authorization", `Bearer ${secondAccessToken}`);

    expect(unlikeRes.statusCode).toBe(200);
    expect(unlikeRes.body.likesCount).toBe(0);
    expect(unlikeRes.body.likedByMe).toBe(false);
  });

  test("POST /posts/:id/like returns 400 for invalid id", async () => {
    const res = await request(app)
      .post("/posts/123/like")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(400);
  });
});