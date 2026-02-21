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
  const mongoUrl = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/WEBFINALPROJECT_TEST";
  await mongoose.connect(mongoUrl);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth API Tests", () => {
  test("register", async () => {
    const res = await request(app).post("/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe(testUser.username);
    expect(res.body).not.toHaveProperty("password");
  });

  test("login sets refresh cookie and returns access token", async () => {
    const res = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  test("refresh using cookie", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    const cookies = loginRes.headers["set-cookie"];
    const refreshRes = await request(app).post("/auth/refresh").set("Cookie", cookies).send({});

    expect(refreshRes.statusCode).toBe(200);
    expect(refreshRes.body).toHaveProperty("accessToken");
  });

  test("logout clears cookie", async () => {
    const loginRes = await request(app).post("/auth/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    const cookies = loginRes.headers["set-cookie"];
    const logoutRes = await request(app).post("/auth/logout").set("Cookie", cookies).send({});

    expect(logoutRes.statusCode).toBe(200);
  });
});