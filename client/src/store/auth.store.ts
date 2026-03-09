import { create } from "zustand";
import type { User } from "../types/user";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  hydrateAuth: () => void;
};

const AUTH_STORAGE_KEY = "social-ai-auth";

type PersistedAuth = {
  user: User;
  accessToken: string;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (user, accessToken) => {
    const payload: PersistedAuth = { user, accessToken };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));

    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  hydrateAuth: () => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedAuth) {
      set({ isHydrated: true });
      return;
    }

    try {
      const parsed: PersistedAuth = JSON.parse(storedAuth);

      set({
        user: parsed.user,
        accessToken: parsed.accessToken,
        isAuthenticated: true,
        isHydrated: true,
      });
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isHydrated: true,
      });
    }
  },
}));
