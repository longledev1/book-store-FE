import axiosInstance from "@/config/axios";
import { ADMIN_API_URL } from "@/config/apiEndpoints";

export interface StatItem {
  current: number;
  previous: number;
  growthRate: number;
}

export interface OverviewAnalyticsData {
  revenue: StatItem;
  orders: StatItem;
  customers: StatItem;
  booksSold: StatItem;
  averageOrderValue: StatItem;
}

export interface RevenueAnalyticsItem {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
}

export interface OrderStatusAnalyticsItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
}

export interface PaymentMethodAnalyticsItem {
  method: string;
  label: string;
  count: number;
  totalAmount: number;
  percentage: number;
}

export interface TopSellingBookItem {
  productId: string;
  name: string;
  slug: string;
  coverUrl: string | null;
  authorName: string;
  soldQuantity: number;
  revenue: number;
  stockQuantity: number;
}

export interface CategorySalesItem {
  categoryId: string;
  categoryName: string;
  booksSold: number;
  revenue: number;
  percentage: number;
}

export interface CustomerGrowthItem {
  date: string;
  newCustomers: number;
  returningCustomers: number;
  totalOrders: number;
}

// 1. Thống kê tổng quan KPI (Stat Cards)
export const getOverviewAnalyticsAPI = async (
  startDate?: string,
  endDate?: string
): Promise<OverviewAnalyticsData> => {
  const response = await axiosInstance.get(ADMIN_API_URL.ANALYTICS_OVERVIEW, {
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return response.data?.data || response.data;
};

// 2. Thống kê Doanh thu & Lợi nhuận theo chu kỳ
export const getRevenueAnalyticsAPI = async (params: {
  period?: "day" | "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}): Promise<RevenueAnalyticsItem[]> => {
  const response = await axiosInstance.get(ADMIN_API_URL.ANALYTICS_REVENUE, {
    params,
  });
  return response.data?.data || response.data || [];
};

// 3. Phân bố trạng thái đơn hàng (Donut Chart)
export const getOrderStatusAnalyticsAPI = async (
  startDate?: string,
  endDate?: string
): Promise<OrderStatusAnalyticsItem[]> => {
  const response = await axiosInstance.get(ADMIN_API_URL.ANALYTICS_ORDER_STATUS, {
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return response.data?.data || response.data || [];
};

// 4. Cơ cấu phương thức thanh toán
export const getPaymentMethodAnalyticsAPI = async (
  startDate?: string,
  endDate?: string
): Promise<PaymentMethodAnalyticsItem[]> => {
  const response = await axiosInstance.get(ADMIN_API_URL.ANALYTICS_PAYMENT_METHODS, {
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return response.data?.data || response.data || [];
};

// 5. Top sách bán chạy nhất
export const getTopSellingBooksAPI = async (
  limit = 10,
  startDate?: string,
  endDate?: string
): Promise<TopSellingBookItem[]> => {
  const response = await axiosInstance.get(ADMIN_API_URL.ANALYTICS_TOP_SELLING, {
    params: {
      limit,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return response.data?.data || response.data || [];
};

// 6. Doanh số theo danh mục sách
export const getCategorySalesAnalyticsAPI = async (
  startDate?: string,
  endDate?: string
): Promise<CategorySalesItem[]> => {
  const response = await axiosInstance.get(ADMIN_API_URL.ANALYTICS_CATEGORY_SALES, {
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return response.data?.data || response.data || [];
};

// 7. Tăng trưởng khách hàng
export const getCustomerGrowthAnalyticsAPI = async (
  startDate?: string,
  endDate?: string
): Promise<CustomerGrowthItem[]> => {
  const response = await axiosInstance.get(ADMIN_API_URL.ANALYTICS_CUSTOMER_GROWTH, {
    params: {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    },
  });
  return response.data?.data || response.data || [];
};
