import axiosInstance from "@/config/axios";

export interface ReviewUser {
  id?: string;
  fullName?: string;
  avatarUrl?: string | null;
}

export interface ReviewItem {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  status?: string;
  isPurchased?: boolean;
  adminReply?: string | null;
  adminReplyAt?: string | null;
  createdAt: string;
  user?: ReviewUser;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  breakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  orderId?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
}

// 1. Lấy danh sách đánh giá công khai của 1 sản phẩm
export const getPublicProductReviewsAPI = async (
  productId: string,
  params?: { page?: number; limit?: number; rating?: number; sort?: "ASC" | "DESC" }
) => {
  const response = await axiosInstance.get(`/reviews/product/${productId}`, {
    params,
  });
  return response.data;
};

// 2. Lấy thống kê điểm số & phân bố sao của 1 sản phẩm
export const getProductReviewStatsAPI = async (productId: string): Promise<{ data: ReviewStats }> => {
  const response = await axiosInstance.get(`/reviews/product/${productId}/statistics`);
  return response.data;
};

// 3. Khách hàng gửi bài đánh giá mới
export const createReviewAPI = async (payload: CreateReviewPayload) => {
  const response = await axiosInstance.post("/reviews", payload);
  return response.data;
};

// 4. Khách hàng sửa bài đánh giá của chính mình
export const updateMyReviewAPI = async (id: string, payload: UpdateReviewPayload) => {
  const response = await axiosInstance.patch(`/reviews/${id}`, payload);
  return response.data;
};

// 5. Khách hàng xóa bài đánh giá của chính mình
export const deleteMyReviewAPI = async (id: string) => {
  const response = await axiosInstance.delete(`/reviews/${id}`);
  return response.data;
};

// 6. Khách hàng lấy danh sách đánh giá của chính mình
export const getMyReviewsAPI = async (page = 1, limit = 10) => {
  const response = await axiosInstance.get("/reviews/my-reviews", {
    params: { page, limit },
  });
  return response.data;
};

// ==========================================
// ADMIN API ENDPOINTS
// ==========================================

// 7. Admin phản hồi (trả lời) bài đánh giá
export const adminReplyReviewAPI = async (id: string, adminReply: string) => {
  const response = await axiosInstance.post(`/admin/reviews/${id}/reply`, {
    adminReply,
  });
  return response.data;
};

// 8. Admin cập nhật trạng thái bài đánh giá (Ví dụ: REJECTED để ẩn bài)
export const adminUpdateReviewStatusAPI = async (id: string, status: string) => {
  const response = await axiosInstance.patch(`/admin/reviews/${id}/status`, {
    status,
  });
  return response.data;
};

// 9. Admin sửa thông tin bài đánh giá
export const adminUpdateReviewAPI = async (id: string, payload: UpdateReviewPayload) => {
  const response = await axiosInstance.patch(`/admin/reviews/${id}`, payload);
  return response.data;
};

// 10. Admin xóa vĩnh viễn bài đánh giá (Hard Delete)
export const adminHardDeleteReviewAPI = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/reviews/hard/${id}`);
  return response.data;
};
