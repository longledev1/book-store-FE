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

  AUTHORS: "/authors",

  AUTHOR_BY_SLUG: (slug: string) => `/authors/${slug}`,

  AUTHOR_BY_ID: (id: string) => `/authors/id/${id}`,

  CATEGORIES: "/categories",

  CATEGORY_TREE: "/categories/tree",

  PRODUCTS: "/products",

  PRODUCT_SEARCH: "/products/search",

  PRODUCT_SEARCH_A: "/products/search-a",

  PRODUCT_SEARCH_B: "/products/search-b",

  PRODUCT_BY_SLUG: (slug: string) => `/products/${slug}`,

  PRODUCT_BY_ID: (id: string) => `/products/id/${id}`,

  ORDERS: "/orders",

  MY_ORDERS: "/orders/my-orders",

  ORDER_BY_ID: (id: string) => `/orders/${id}`,

  CANCEL_ORDER: (id: string) => `/orders/my-orders/${id}/cancel`,
};

// 2. Các endpoint API dành cho trang Admin (Quản trị viên)
export const ADMIN_API_URL = {
  // Danh mục
  CATEGORIES: "/admin/categories",

  CATEGORY_TREE: "/admin/categories/tree",

  CREATE_CATEGORY: "/admin/categories",

  UPDATE_CATEGORY: (categoryId: string) => `/admin/categories/${categoryId}`,

  DELETE_CATEGORY: (categoryId: string) => `/admin/categories/${categoryId}`,

  RESTORE_CATEGORY: (categoryId: string) =>
    `/admin/categories/restore/${categoryId}`,

  DELETED_CATEGORIES: "/admin/categories/soft-delete/get",

  HARD_DELETE_CATEGORY: (categoryId: string) =>
    `/admin/categories/hard/${categoryId}`,

  // Sản phẩm
  PRODUCTS: "/admin/products",

  PRODUCT_BY_ID: (id: string) => `/admin/products/${id}`,

  CREATE_PRODUCT: "/admin/products",

  UPDATE_PRODUCT: (id: string) => `/admin/products/${id}`,

  DELETE_PRODUCT: (id: string) => `/admin/products/${id}`,

  RESTORE_PRODUCT: (id: string) => `/admin/products/restore/${id}`,

  DELETED_PRODUCTS: "/admin/products/soft-delete/get",

  HARD_DELETE_PRODUCT: (id: string) => `/admin/products/hard/${id}`,

  // Tác giả
  AUTHORS: "/admin/authors",

  AUTHOR_BY_ID: (id: string) => `/admin/authors/${id}`,

  CREATE_AUTHOR: "/admin/authors",

  UPDATE_AUTHOR: (id: string) => `/admin/authors/${id}`,

  DELETE_AUTHOR: (id: string) => `/admin/authors/${id}`,

  RESTORE_AUTHOR: (id: string) => `/admin/authors/restore/${id}`,

  DELETED_AUTHORS: "/admin/authors/soft-delete/get",

  HARD_DELETE_AUTHOR: (id: string) => `/admin/authors/hard/${id}`,

  // Media
  MEDIAS: "/admin/medias",

  MEDIA_BY_ID: (id: string) => `/admin/medias/${id}`,

  UPLOAD_MULTIPLE_MEDIA: "/admin/medias/upload-multiple",

  MEDIA_FOLDERS: "/admin/medias/folders",

  MEDIA_GROUPED: "/admin/medias/grouped",

  MOVE_MEDIA_GROUP: "/admin/medias/move-group",

  UPDATE_MEDIA: (id: string) => `/admin/medias/${id}`,

  DELETE_MEDIA: (id: string) => `/admin/medias/${id}`,

  HARD_DELETE_MEDIA: (id: string) => `/admin/medias/hard/${id}`,

  // Thống kê & Báo cáo (Analytics)
  ANALYTICS_OVERVIEW: "/admin/analytics/overview",

  ANALYTICS_REVENUE: "/admin/analytics/revenue",

  ANALYTICS_ORDER_STATUS: "/admin/analytics/order-status",

  ANALYTICS_PAYMENT_METHODS: "/admin/analytics/payment-methods",

  ANALYTICS_TOP_SELLING: "/admin/analytics/top-selling-books",

  ANALYTICS_CATEGORY_SALES: "/admin/analytics/category-sales",

  ANALYTICS_CUSTOMER_GROWTH: "/admin/analytics/customer-growth",
};
