import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

// Đọc từ biến môi trường của Vite, fallback về localhost:8080/api nếu chưa cấu hình .env
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1234/apis/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Request Interceptor: Tự động đính kèm JWT Token vào headers nếu có
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Axios Response Interceptor: Xử lý tập trung các lỗi HTTP phổ biến (401, 403, 500,...)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Tự động logout hoặc chuyển hướng đăng nhập nếu token hết hạn
        console.warn("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
