// 1. Các endpoint API dành cho trang Client (Người mua)
export const CLIENT_API_URL = {
  // Sách & Danh mục
  BOOKS: "/books",
  BOOK_DETAILS: (id: string | number) => `/books/${id}`,
  CATEGORIES: "/categories",

  // Người dùng & Giỏ hàng
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  USER_PROFILE: "/users/me",
  CART: "/cart",
  WISHLIST: "/wishlist",

  // Đơn hàng
  ORDERS: "/orders",
  ORDER_DETAILS: (id: string | number) => `/orders/${id}`,
};

// 2. Các endpoint API dành cho trang Admin (Quản trị viên)
export const ADMIN_API_URL = {
  // Tổng quan & Thống kê
  DASHBOARD: "/admin/dashboard",

  // Quản lý sách
  BOOKS: "/admin/books",
  BOOK_DETAILS: (id: string | number) => `/admin/books/${id}`,
  CREATE_BOOK: "/admin/books",
  UPDATE_BOOK: (id: string | number) => `/admin/books/${id}`,
  DELETE_BOOK: (id: string | number) => `/admin/books/${id}`,

  // Quản lý đơn hàng & Người dùng
  ORDERS: "/admin/orders",
  ORDER_STATUS: (id: string | number) => `/admin/orders/${id}/status`,
  USERS: "/admin/users",
  USER_DETAILS: (id: string | number) => `/admin/users/${id}`,
};
