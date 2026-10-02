import { useState, useEffect, useCallback } from "react";
import DashboardDateFilter, {
  type DateRangePreset,
} from "./components/DashboardDateFilter";
import OverviewStatCards from "./components/OverviewStatCards";
import RevenueChartCard from "./components/RevenueChartCard";
import OrderStatusDonutCard from "./components/OrderStatusDonutCard";
import TopSellingBooksCard from "./components/TopSellingBooksCard";
import CategorySalesCard from "./components/CategorySalesCard";
import PaymentMethodsCard from "./components/PaymentMethodsCard";
import {
  getOverviewAnalyticsAPI,
  getRevenueAnalyticsAPI,
  getOrderStatusAnalyticsAPI,
  getPaymentMethodAnalyticsAPI,
  getTopSellingBooksAPI,
  getCategorySalesAnalyticsAPI,
  type OverviewAnalyticsData,
  type RevenueAnalyticsItem,
  type OrderStatusAnalyticsItem,
  type PaymentMethodAnalyticsItem,
  type TopSellingBookItem,
  type CategorySalesItem,
} from "@/services/analytics.service";
import { toast } from "@/stores/useToastStore";

const getDateRange = (
  preset: DateRangePreset
): { startDate: string; endDate: string } => {
  const end = new Date();
  const start = new Date();

  if (preset === "7d") {
    start.setDate(end.getDate() - 7);
  } else if (preset === "30d") {
    start.setDate(end.getDate() - 30);
  } else if (preset === "90d") {
    start.setDate(end.getDate() - 90);
  } else if (preset === "year") {
    start.setMonth(0, 1);
  }

  const format = (d: Date) => d.toISOString().split("T")[0];
  return { startDate: format(start), endDate: format(end) };
};

export default function DashboardPageManagement() {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>("30d");
  const [revenuePeriod, setRevenuePeriod] = useState<"day" | "month">("day");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Analytics states
  const [overviewData, setOverviewData] = useState<OverviewAnalyticsData | null>(
    null
  );
  const [revenueData, setRevenueData] = useState<RevenueAnalyticsItem[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<
    OrderStatusAnalyticsItem[]
  >([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState<
    PaymentMethodAnalyticsItem[]
  >([]);
  const [topSellingBooks, setTopSellingBooks] = useState<TopSellingBookItem[]>(
    []
  );
  const [categorySales, setCategorySales] = useState<CategorySalesItem[]>([]);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    const { startDate, endDate } = getDateRange(selectedPreset);

    try {
      const results = await Promise.allSettled([
        getOverviewAnalyticsAPI(startDate, endDate),
        getRevenueAnalyticsAPI({ period: revenuePeriod, startDate, endDate }),
        getOrderStatusAnalyticsAPI(startDate, endDate),
        getPaymentMethodAnalyticsAPI(startDate, endDate),
        getTopSellingBooksAPI(10, startDate, endDate),
        getCategorySalesAnalyticsAPI(startDate, endDate),
      ]);

      // 1. Overview
      if (results[0].status === "fulfilled") {
        setOverviewData(results[0].value);
      } else {
        console.error("Lỗi tải overview analytics:", results[0].reason);
      }

      // 2. Revenue
      if (results[1].status === "fulfilled") {
        setRevenueData(results[1].value);
      } else {
        console.error("Lỗi tải revenue analytics:", results[1].reason);
      }

      // 3. Order Status
      if (results[2].status === "fulfilled") {
        setOrderStatusData(results[2].value);
      } else {
        console.error("Lỗi tải order status analytics:", results[2].reason);
      }

      // 4. Payment Methods
      if (results[3].status === "fulfilled") {
        setPaymentMethodsData(results[3].value);
      } else {
        console.error("Lỗi tải payment methods analytics:", results[3].reason);
      }

      // 5. Top Selling Books
      if (results[4].status === "fulfilled") {
        setTopSellingBooks(results[4].value);
      } else {
        console.error("Lỗi tải top selling books:", results[4].reason);
      }

      // 6. Category Sales
      if (results[5].status === "fulfilled") {
        setCategorySales(results[5].value);
      } else {
        console.error("Lỗi tải category sales:", results[5].reason);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu Dashboard:", error);
      toast.error("Không thể tải toàn bộ dữ liệu thống kê");
    } finally {
      setIsLoading(false);
    }
  }, [selectedPreset, revenuePeriod]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
            Báo Cáo & Thống Kê
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-0.5 select-none">
            Theo dõi tổng quan doanh thu, đơn hàng, tăng trưởng khách hàng và hiệu suất bán sách.
          </p>
        </div>
      </div>

      {/* 2. Date Filter Bar */}
      <DashboardDateFilter
        selectedPreset={selectedPreset}
        onSelectPreset={(preset) => setSelectedPreset(preset)}
        onRefresh={fetchDashboardData}
        isLoading={isLoading}
      />

      {/* 3. KPI Stat Cards */}
      <OverviewStatCards data={overviewData} isLoading={isLoading} />

      {/* 4. Main Charts: Revenue Area Chart + Order Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChartCard
            data={revenueData}
            isLoading={isLoading}
            period={revenuePeriod}
            onPeriodChange={(p) => setRevenuePeriod(p)}
          />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusDonutCard
            data={orderStatusData}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 5. Secondary Grid: Top Selling Books + Category Sales & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TopSellingBooksCard
            data={topSellingBooks}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <CategorySalesCard
            data={categorySales}
            isLoading={isLoading}
          />
          <PaymentMethodsCard
            data={paymentMethodsData}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
