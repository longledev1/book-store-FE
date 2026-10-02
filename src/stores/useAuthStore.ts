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
  isVerified?: boolean;
  detail: UserDetail | null;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: User | null;

  login: (accessToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setAccessToken: (accessToken: string) => void;
}

import { useNotificationStore } from "./useNotificationStore";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,

      login: (accessToken) => {
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      setAccessToken: (accessToken) => {
        set({
          accessToken,
          isAuthenticated: true,
        });
      },

      setUser: (user) => {
        const currentUser = get().user;
        if (currentUser && currentUser.id !== user.id) {
          useNotificationStore.getState().clearNotifications();
          useNotificationStore.getState().disconnectSocket();
        }
        set({
          user,
        });
      },

      logout: () => {
        useNotificationStore.getState().clearNotifications();
        useNotificationStore.getState().disconnectSocket();
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
