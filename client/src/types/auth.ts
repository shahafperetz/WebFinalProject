import type { User } from "./user";

export type LoginDto = {
  email: string;
  password: string;
};

export type RegisterDto = {
  username: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};
