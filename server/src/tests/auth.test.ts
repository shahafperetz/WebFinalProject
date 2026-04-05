import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/user_model";

const testUser = {
  username: "testuser",
  email: "test@example.com",
  password: "password123",
};

beforeAll(async () => {
  const mongoUrl =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/WEBFINALPROJECT_TEST";

  await mongoose.connect(mongoUrl);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API Tests", () => {
  test("POST /auth/register registers user", async () => {
    const res = await request(app).post("/auth/register").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body).not.toHaveProperty("password");
  });

  test("POST /auth/register fails when user already exists", async () => {
    const res = await request(app).post("/auth/register").send(testUser);

    expect(res.statusCode).toBe(400);
  });

  test("POST /auth/login returns access token and sets refresh cookie", async () => {
    const res = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("POST /auth/login fails with wrong password", async () => {
    const res = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: "wrong-password",
    });

    expect(res.statusCode).toBe(400);
  });

  test("POST /auth/refresh returns new access token using cookie", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    const cookies = loginRes.headers["set-cookie"];

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .set("Cookie", cookies)
      .send({});

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body).toHaveProperty("accessToken");
  });

  test("POST /auth/refresh fails without token", async () => {
    const refreshRes = await request(app).post("/auth/refresh").send({});

    expect(refreshRes.statusCode).toBe(400);
  });

  test("POST /auth/logout succeeds", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    const cookies = loginRes.headers["set-cookie"];

    const logoutRes = await request(app)
      .post("/auth/logout")
      .set("Cookie", cookies)
      .send({});

    expect(logoutRes.statusCode).toBe(200);
  });
});