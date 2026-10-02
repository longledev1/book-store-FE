import axiosInstance from "@/config/axios";
import { CLIENT_API_URL } from "@/config/apiEndpoints";

export interface OrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  note?: string;
  paymentMethod?: "COD" | "VNPAY";
  items: OrderItemPayload[];
}

export interface FetchMyOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  code?: string;
  orderBy?: string;
  sort?: "ASC" | "DESC";
}

// 1. TẠO ĐƠN HÀNG MỚI [POST] -- /orders
export const createOrderAPI = async (payload: CreateOrderPayload) => {
  const response = await axiosInstance.post(CLIENT_API_URL.ORDERS, payload);
  return response.data;
};

// 2. LẤY DANH SÁCH ĐƠN HÀNG CỦA TÔI [GET] -- /orders/my-orders
export const getMyOrdersAPI = async (params?: FetchMyOrdersParams) => {
  const response = await axiosInstance.get(CLIENT_API_URL.MY_ORDERS, {
    params,
  });
  return response.data;
};

// 3. XEM CHI TIẾT ĐƠN HÀNG [GET] -- /orders/:id
export const getOrderDetailAPI = async (id: string) => {
  const response = await axiosInstance.get(CLIENT_API_URL.ORDER_BY_ID(id));
  return response.data;
};

// 4. HỦY ĐƠN HÀNG CỦA TÔI [PATCH] -- /orders/my-orders/:id/cancel
export const cancelOrderAPI = async (id: string) => {
  const response = await axiosInstance.patch(CLIENT_API_URL.CANCEL_ORDER(id));
  return response.data;
};

// 5. TẠO URL THANH TOÁN VNPAY [POST] -- /payment/vnpay/create-url
export const createVnpayPaymentUrlAPI = async (orderId: string, bankCode?: string) => {
  const response = await axiosInstance.post("/payment/vnpay/create-url", {
    orderId,
    bankCode,
  });
  return response.data;
};
