import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/user_model";
import Post from "../models/post_model";
import Comment from "../models/comment_model";

const testUser = {
  username: "comments_user",
  email: "comments_user@example.com",
  password: "password123",
};

let accessToken = "";
let postId = "";

beforeAll(async () => {
  const mongoUrl =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/WEBFINALPROJECT_TEST";

  await mongoose.connect(mongoUrl);

  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});

  await request(app).post("/auth/register").send(testUser);

  const loginRes = await request(app).post("/auth/login").send({
    username: testUser.username,
    password: testUser.password,
  });

  accessToken = loginRes.body.accessToken;

  const createPostRes = await request(app)
    .post("/posts")
    .set("Authorization", `Bearer ${accessToken}`)
    .field("text", "post for comments");

  postId = createPostRes.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Comments API", () => {
  test("POST /posts/:postId/comments creates comment and increments commentsCount", async () => {
    const addRes = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ text: "first comment" });

    expect(addRes.statusCode).toBe(201);
    expect(addRes.body.text).toBe("first comment");

    const feedRes = await request(app).get("/posts?skip=0&limit=10");
    expect(feedRes.statusCode).toBe(200);

    const found = feedRes.body.items.find((p: any) => String(p._id) === String(postId));
    expect(found).toBeDefined();
    expect(found.commentsCount).toBeGreaterThanOrEqual(1);
  });

  test("GET /posts/:postId/comments returns comments list", async () => {
    const res = await request(app).get(`/posts/${postId}/comments?skip=0&limit=10`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThanOrEqual(1);
  });
});