import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

// Đọc từ biến môi trường của Vite, fallback về localhost:8080/api nếu chưa cấu hình .env
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:1234/apis/v1";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh Axios
const refreshAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
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

  async (error) => {
    const originalRequest = error.config;

    // Access Token hết hạn
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi Refresh API
        // Refresh Token sẽ tự đi theo HttpOnly Cookie
        const response = await refreshAxios.post("/auth/refresh");

        const newAccessToken = response.data.data.accessToken;

        // Cập nhật Access Token mới vào Zustand
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Thay token cũ bằng token mới cho request bị lỗi
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Gọi lại request vừa bị 401
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh Token cũng hết hạn / không hợp lệ
        useAuthStore.getState().logout();

        console.warn("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
