import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
  Calendar,
  CreditCard,
  Ban,
  Eye,
  ShoppingBag,
} from "lucide-react";
import {
  getMyOrdersAPI,
  cancelOrderAPI,
  createVnpayPaymentUrlAPI,
} from "@/services/order.service";
import { formatPrice, formatDate } from "@/utils/format";
import { toast } from "@/stores/useToastStore";
import OrderDetailModal from "@/components/client/profile/OrderDetailModal";

const ORDER_TABS = [
  { id: "ALL", label: "Tất cả đơn" },
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "CONFIRMED", label: "Đã xác nhận" },
  { id: "SHIPPING", label: "Đang giao" },
  { id: "COMPLETED", label: "Hoàn thành" },
  { id: "CANCELLED", label: "Đã hủy" },
];

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusToPass = activeTab !== "ALL" ? activeTab : undefined;
      const res: any = await getMyOrdersAPI({
        page,
        limit,
        status: statusToPass,
      });

      const dataList = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : [];

      setOrders(dataList);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn hàng:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, page]);

  const handleCancelOrder = async (orderId: string, orderCode: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderCode}?`)) {
      return;
    }

    setCancellingId(orderId);
    try {
      await cancelOrderAPI(orderId);
      toast.success(`Đã hủy đơn hàng "${orderCode}" thành công!`);
      fetchOrders();
    } catch (err: any) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      toast.error(
        err?.response?.data?.message || "Không thể hủy đơn hàng này"
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayVnpay = async (orderId: string) => {
    try {
      toast.info("Đang khởi tạo thanh toán VNPAY...");
      const res: any = await createVnpayPaymentUrlAPI(orderId);
      const url =
        typeof res === "string"
          ? res
          : res?.paymentUrl ||
            res?.data?.paymentUrl ||
            res?.url ||
            res?.data?.url ||
            (typeof res?.data === "string" ? res?.data : null);
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Không lấy được đường dẫn thanh toán VNPAY");
      }
    } catch (err: any) {
      console.error("Lỗi VNPAY:", err);
      toast.error(err?.response?.data?.message || "Lỗi thanh toán VNPAY");
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-700">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Chờ xác nhận</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-extrabold text-blue-700">
            <CheckCircle2 className="w-3 h-3 text-blue-500" />
            <span>Đã xác nhận</span>
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-extrabold text-indigo-700">
            <Truck className="w-3 h-3 text-indigo-500" />
            <span>Đang giao hàng</span>
          </span>
        );
      case "COMPLETED":
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Hoàn thành</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-extrabold text-rose-700">
            <Ban className="w-3 h-3 text-rose-500" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-extrabold text-slate-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            <span>Đơn hàng của tôi</span>
          </h1>
          <p className="text-xs text-slate-450 mt-1 font-medium">
            Quản lý và theo dõi tiến độ các đơn hàng mua sách của bạn.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/60 pb-3 select-none">
        {ORDER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-md shadow-blue-500/10"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List Container */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-xs font-bold bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-7 h-7 animate-spin text-primary" />
          <span>Đang tải danh sách đơn hàng...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-24 text-center text-slate-400 text-xs font-bold bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <p>Hiện chưa có đơn hàng nào thuộc danh mục này.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const canCancel =
              order.status === "PENDING" || order.status === "CONFIRMED";
            const isUnpaidVnpay =
              order.paymentMethod === "VNPAY" &&
              order.paymentStatus !== "PAID" &&
              order.status !== "CANCELLED";

            const itemCount = order.items?.length || 0;

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-2xs space-y-3 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                {/* Single Header Line: Code, Date, Item Count & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xs md:text-sm text-primary bg-primary/10 px-2.5 py-0.5 rounded-lg">
                      {order.code}
                    </span>
                    <span className="text-xs text-slate-450 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                      <ShoppingBag className="w-3 h-3 text-slate-400" />
                      {itemCount} sản phẩm
                    </span>
                  </div>

                  <div>{renderStatusBadge(order.status)}</div>
                </div>

                {/* Bottom Line: Payment Method, Total Amount & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 select-none">
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <span>Thanh toán:</span>
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                      {order.paymentMethod === "VNPAY" ? "VNPAY Online" : "COD"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs text-slate-450 font-semibold">
                        Tổng tiền:
                      </span>
                      <span className="text-base md:text-lg font-black text-primary leading-none">
                        {formatPrice(order.finalAmount || order.totalAmount)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold shadow-2xs transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Xem chi tiết</span>
                      </button>

                      {isUnpaidVnpay && (
                        <button
                          onClick={() => handlePayVnpay(order.id)}
                          className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl bg-primary text-white text-xs font-extrabold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Thanh toán VNPAY</span>
                        </button>
                      )}

                      {canCancel && (
                        <button
                          disabled={cancellingId === order.id}
                          onClick={() => handleCancelOrder(order.id, order.code)}
                          className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/70 text-rose-600 hover:bg-rose-100 text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>Hủy đơn</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onCancelOrder={handleCancelOrder}
          onPayVnpay={handlePayVnpay}
          cancellingId={cancellingId}
        />
      )}
    </div>
  );
}
