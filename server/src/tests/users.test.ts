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

let accessToken = "";

beforeAll(async () => {
  const mongoUrl =
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/WEBFINALPROJECT_TEST";

  await mongoose.connect(mongoUrl);

  await User.deleteMany({});

  await request(app).post("/auth/register").send(testUser);

  const loginRes = await request(app).post("/auth/login").send({
    username: testUser.username,
    password: testUser.password,
  });

  accessToken = loginRes.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Users API", () => {
  test("GET /users/myInfo returns my profile", async () => {
    const res = await request(app)
      .get("/users/myInfo")
      .set("Authorization", `Bearer ${accessToken}`);

    if (res.statusCode !== 200) {
      console.log("GET myInfo FAIL:", res.statusCode, res.text);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body).toHaveProperty("email");
  });

  test("PUT /users/myInfo updates username", async () => {
    const res = await request(app)
      .put("/users/myInfo")
      .set("Authorization", `Bearer ${accessToken}`)
      .field("username", "user1_new");

    if (res.statusCode !== 200) {
      console.log("PUT username FAIL:", res.statusCode, res.text);
    }

    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe("user1_new");
  });

  test(
    "PUT /users/myInfo uploads profile image",
    async () => {
      const tempDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // PNG אמיתי קטן (1x1)
      const pngBase64 =
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5G2uoAAAAASUVORK5CYII=";

      const imgPath = path.join(tempDir, "test.png");
      fs.writeFileSync(imgPath, Buffer.from(pngBase64, "base64"));

      const res = await request(app)
        .put("/users/myInfo")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("image", imgPath);

      if (res.statusCode !== 200) {
        console.log("UPLOAD FAIL:", res.statusCode, res.text);
      }

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("image");
      expect(String(res.body.image)).toContain("/uploads/profile/");

      fs.unlinkSync(imgPath);
    },
    15000
  );
});