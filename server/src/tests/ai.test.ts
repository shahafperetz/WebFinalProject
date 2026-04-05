import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/user_model";
import Post from "../models/post_model";
import aiService from "../services/ai.service";

jest.mock("../services/ai.service", () => ({
  __esModule: true,
  default: {
    translatePostToEnglish: jest.fn(),
  },
}));

const mockedAiService = aiService as jest.Mocked<typeof aiService>;

const testUser = {
  username: "ai_user",
  email: "ai_user@example.com",
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

  await request(app).post("/auth/register").send(testUser);

  const loginRes = await request(app).post("/auth/login").send({
    username: testUser.username,
    password: testUser.password,
  });

  accessToken = loginRes.body.accessToken;

  const createPostRes = await request(app)
    .post("/posts")
    .set("Authorization", `Bearer ${accessToken}`)
    .field("text", "שלום עולם");

  postId = createPostRes.body._id;
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("AI API", () => {
  test("POST /ai/translate/:postId returns translated post", async () => {
    mockedAiService.translatePostToEnglish.mockResolvedValue({
      postId,
      originalText: "שלום עולם",
      detectedLanguage: "Hebrew",
      translatedText: "Hello world",
    });

    const res = await request(app)
      .post(`/ai/translate/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.postId).toBe(postId);
    expect(res.body.detectedLanguage).toBe("Hebrew");
    expect(res.body.translatedText).toBe("Hello world");
  });

  test("POST /ai/translate/:postId fails without token", async () => {
    const res = await request(app).post(`/ai/translate/${postId}`);

    expect(res.statusCode).toBe(401);
  });

  test("POST /ai/translate/:postId returns 500 when service fails", async () => {
    mockedAiService.translatePostToEnglish.mockRejectedValue(
      new Error("Translation failed")
    );

    const res = await request(app)
      .post(`/ai/translate/${postId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(500);
  });
});