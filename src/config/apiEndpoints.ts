// 1. Các endpoint API dành cho trang Client (Người mua)
export const CLIENT_API_URL = {
  // Người dùng & Giỏ hàng
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  AUTH_REFRESH_TOKEN: "/auth/refresh",
  USER_PROFILE: "/users/me",
  USER_UPDATE_PROFILE: "/users/profile",
};

// 2. Các endpoint API dành cho trang Admin (Quản trị viên)
export const ADMIN_API_URL = {};
