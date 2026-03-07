import type { AuthResponse, LoginDto, RegisterDto } from "../types/auth";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  await wait(700);

  return {
    user: {
      id: "1",
      username: "tal",
      email: data.email,
      profileImage: "",
    },
    accessToken: "mock-access-token",
  };
}

export async function register(data: RegisterDto): Promise<AuthResponse> {
  await wait(700);

  return {
    user: {
      id: "1",
      username: data.username,
      email: data.email,
      profileImage: "",
    },
    accessToken: "mock-access-token",
  };
}

export async function logout(): Promise<void> {
  await wait(300);
}

export async function refreshToken(): Promise<AuthResponse> {
  await wait(300);

  return {
    user: {
      id: "1",
      username: "tal",
      email: "tal@example.com",
      profileImage: "",
    },
    accessToken: "mock-access-token",
  };
}

export async function getMe(): Promise<AuthResponse["user"]> {
  await wait(300);

  return {
    id: "1",
    username: "tal",
    email: "tal@example.com",
    profileImage: "",
  };
}
