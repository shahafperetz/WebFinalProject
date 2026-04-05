import request from "supertest";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import app from "../app";
import User from "../models/user_model";

const testUser = {
  username: "user1",
  email: "user1@example.com",
  password: "password123",
};

const secondUser = {
  username: "user2",
  email: "user2@example.com",
  password: "password123",
};

let accessToken = "";
let userId = "";

beforeAll(async () => {
  const mongoUrl =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/WEBFINALPROJECT_TEST";

  await mongoose.connect(mongoUrl);

  await User.deleteMany({});

  await request(app).post("/auth/register").send(testUser);
  await request(app).post("/auth/register").send(secondUser);

  const loginRes = await request(app).post("/auth/login").send({
    username: testUser.username,
    password: testUser.password,
  });

  accessToken = loginRes.body.accessToken;

  const me = await User.findOne({ username: testUser.username });
  userId = String(me?._id);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Users API", () => {
  test("GET /users/myInfo returns my profile", async () => {
    const res = await request(app)
      .get("/users/myInfo")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body).toHaveProperty("email");
  });

  test("GET /users/myInfo fails without token", async () => {
    const res = await request(app).get("/users/myInfo");

    expect(res.statusCode).toBe(401);
  });

  test("GET /users/:id returns user profile", async () => {
    const res = await request(app).get(`/users/${userId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("username");
  });

  test("GET /users/:id returns 404 for missing user", async () => {
    const missingId = new mongoose.Types.ObjectId().toString();

    const res = await request(app).get(`/users/${missingId}`);

    expect(res.statusCode).toBe(404);
  });

  test("PUT /users/myInfo updates username", async () => {
    const res = await request(app)
      .put("/users/myInfo")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("username", "user1_new");

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("user1_new");
  });

  test("PUT /users/myInfo fails when username already taken", async () => {
    const res = await request(app)
      .put("/users/myInfo")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("username", "user2");

    expect(res.statusCode).toBe(400);
  });

  test(
    "PUT /users/myInfo uploads profile image",
    async () => {
      const tempDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const pngBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5G2uoAAAAASUVORK5CYII=";

      const imgPath = path.join(tempDir, "test-profile.png");
      fs.writeFileSync(imgPath, Buffer.from(pngBase64, "base64"));

      const res = await request(app)
        .put("/users/myInfo")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("image", imgPath);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("image");
      expect(String(res.body.image)).toContain("/uploads/profile/");

      fs.unlinkSync(imgPath);
    },
    15000
  );
});