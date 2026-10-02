import axiosInstance from "@/config/axios";
import { ADMIN_API_URL } from "@/config/apiEndpoints";

export interface AdminOrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  code?: string;
  customerName?: string;
  customerPhone?: string;
  orderBy?: string;
  sort?: "ASC" | "DESC";
}

export const getAdminOrdersAPI = async (params: AdminOrderQuery = {}) => {
  const response = await axiosInstance.get("/admin/orders", { params });
  return response.data;
};

export const getAdminOrderDetailAPI = async (id: string) => {
  const response = await axiosInstance.get(`/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatusAPI = async (id: string, status: string) => {
  const response = await axiosInstance.patch(`/admin/orders/${id}/status`, {
    status,
  });
  return response.data;
};
