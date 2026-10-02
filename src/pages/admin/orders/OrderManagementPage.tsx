import React, { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import {
  getAdminOrdersAPI,
  updateOrderStatusAPI,
  getAdminOrderDetailAPI,
} from "@/services/admin-order.service";
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import AdminOrderDetailModal from "./components/AdminOrderDetailModal";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "@/stores/useToastStore";
import { useNotificationStore } from "@/stores/useNotificationStore";

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const socket = useNotificationStore((state) => state.socket);

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 10;

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Detail Modal state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrdersList = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const statusToPass = activeTab !== "ALL" ? activeTab : undefined;
      const res: any = await getAdminOrdersAPI({
        page: currentPage,
        limit,
        status: statusToPass,
        code: debouncedSearchTerm.trim() || undefined,
        customerName: !debouncedSearchTerm.startsWith("ORD") ? debouncedSearchTerm.trim() || undefined : undefined,
      });

      const dataList = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setOrders(dataList);
      setTotalPages(res?.pagination?.totalPages || 0);
      setTotalCount(res?.pagination?.total || dataList.length);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đơn hàng Admin:", error);
      setIsError(true);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersList();
  }, [currentPage, debouncedSearchTerm, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, activeTab]);

  // Real-time Socket Listener for Admin Orders Auto-Refresh
  useEffect(() => {
    if (!socket) return;

    const handleRealtimeUpdate = () => {
      fetchOrdersList();
    };

    socket.on("new_order", handleRealtimeUpdate);
    socket.on("order_status_updated", handleRealtimeUpdate);

    return () => {
      socket.off("new_order", handleRealtimeUpdate);
      socket.off("order_status_updated", handleRealtimeUpdate);
    };
  }, [socket, currentPage, debouncedSearchTerm, activeTab]);

  const handleUpdateStatus = async (orderId: string, newStatus: string, orderCode: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatusAPI(orderId, newStatus);
      toast.success(`Đã cập nhật đơn hàng ${orderCode} thành "${newStatus}"!`);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err: any) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
      toast.error(
        err?.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng này"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenDetail = async (orderId: string) => {
    try {
      const detail = await getAdminOrderDetailAPI(orderId);
      setSelectedOrder(detail?.data || detail);
    } catch (err) {
      console.error("Lỗi tải chi tiết đơn hàng:", err);
      toast.error("Không thể tải thông tin chi tiết đơn hàng");
    }
  };

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + orders.length, totalCount);

  return (
    <div className="space-y-6 text-left font-sans">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
            Quản lý Đơn hàng
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-0.5 select-none">
            Quản lý, tìm kiếm, duyệt đơn và cập nhật trạng thái đơn hàng của hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2 select-none font-sans self-start sm:self-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs">
            <span className="text-slate-400 font-semibold">Tổng số đơn:</span>
            <span className="text-sm font-black text-primary">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* 2. Filters Toolbar */}
      <OrderFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 3. Table / Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/50 shadow-sm">
          <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-400 mt-3 select-none">
            Đang tải danh sách đơn hàng...
          </span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/50 shadow-sm text-center">
          <span className="text-xs font-bold text-rose-500">
            Đã xảy ra lỗi khi tải danh sách đơn hàng. Vui lòng thử lại.
          </span>
          <button
            onClick={fetchOrdersList}
            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tải lại</span>
          </button>
        </div>
      ) : (
        <OrderTable
          orders={orders}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onUpdateStatus={handleUpdateStatus}
          onOpenDetail={handleOpenDetail}
          updatingId={updatingId}
        />
      )}

      {/* 4. Order Detail Modal */}
      {selectedOrder && (
        <AdminOrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}
