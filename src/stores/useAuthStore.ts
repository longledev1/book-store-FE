import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createBy: string | null;
  updateBy: string | null;
  deleteBy: string | null;

  fullName: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
}

interface User {
  id: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
  detail: UserDetail | null;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User | null;

  login: (accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,

      login: (accessToken) => {
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        set({
          user,
        });
      },

      logout: () => {
        set({
          accessToken: null,
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
