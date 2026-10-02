import React from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  Calendar,
  Phone,
  User,
  MapPin,
  FileText,
  X,
} from "lucide-react";
import { formatPrice, formatDate, resolveMediaUrl } from "@/utils/format";

const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "CONFIRMED", label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "SHIPPING", label: "Đang giao hàng", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "COMPLETED", label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

interface AdminOrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string, orderCode: string) => void;
  updatingId: string | null;
}

export default function AdminOrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  updatingId,
}: AdminOrderDetailModalProps) {
  if (!order) return null;

  const renderStatusBadge = (status: string) => {
    const config = ORDER_STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-xs font-extrabold ${
          config?.color || "bg-slate-100 text-slate-700 border-slate-200"
        }`}
      >
        {status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
        {status === "CONFIRMED" && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
        {status === "SHIPPING" && <Truck className="w-3.5 h-3.5 text-indigo-500" />}
        {(status === "COMPLETED" || status === "DELIVERED") && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
        {status === "CANCELLED" && <Ban className="w-3.5 h-3.5 text-rose-500" />}
        <span>{config?.label || status}</span>
      </span>
    );
  };

  const getItemImage = (item: any) => {
    const rawUrl =
      item.product?.imgUrl ||
      item.product?.imageUrl ||
      item.product?.thumbnail ||
      item.product?.albums?.[0]?.imageUrl ||
      item.product?.albums?.[0]?.media?.fileUrl ||
      item.imgUrl;
    return resolveMediaUrl(rawUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200 text-left font-sans select-text">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 text-base select-text">
                  Đơn hàng {order.code}
                </h3>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-xs text-slate-450 font-medium mt-0.5 flex items-center gap-1 select-text">
                <Calendar className="w-3.5 h-3.5" />
                Ngày đặt: {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 select-text">
          {/* Customer & Address Card */}
          <div className="rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4 space-y-2 text-xs font-semibold text-slate-600">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary mb-2 select-none">
              <MapPin className="w-4 h-4" />
              Thông tin khách hàng & Giao hàng
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <p className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Họ tên: <strong className="select-text">{order.customerName}</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Điện thoại: <strong className="select-text">{order.customerPhone}</strong></span>
              </p>
            </div>
            <p className="pt-1 text-slate-700 leading-relaxed">
              <strong>Địa chỉ:</strong> <span className="select-text">{order.shippingAddress}</span>
            </p>
            {order.note && (
              <p className="pt-1 italic text-slate-500 border-t border-slate-200/40 mt-2">
                <strong>Ghi chú:</strong> <span className="select-text">{order.note}</span>
              </p>
            )}
          </div>

          {/* Order Items Table */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 select-none">
              <FileText className="w-4 h-4 text-primary" />
              Sản phẩm đặt mua ({order.items?.length || 0})
            </h4>

            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/60 p-3 space-y-2 bg-white">
              {order.items?.map((item: any) => {
                const itemImg = getItemImage(item);
                return (
                  <div
                    key={item.id}
                    className="pt-2 first:pt-0 flex items-center justify-between gap-4 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400 overflow-hidden shadow-2xs select-none">
                        <img
                          src={itemImg || "/mock_data.png"}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/mock_data.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h5 className="font-bold text-slate-800 truncate select-text">
                          {item.productName}
                        </h5>
                        <span className="text-[11px] text-slate-450 font-medium block">
                          Số lượng: <strong className="text-slate-700 font-bold">{item.quantity}</strong> x {formatPrice(item.unitPrice)}
                        </span>
                      </div>
                    </div>

                    <span className="font-black text-slate-800 shrink-0 text-xs md:text-sm select-text">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Update Quick Select in Modal */}
          <div className="rounded-2xl border border-slate-200/60 p-4 space-y-3 bg-slate-50/40 text-xs font-semibold">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-bold select-none">Cập nhật trạng thái đơn:</span>
              <select
                disabled={updatingId === order.id}
                value={order.status}
                onChange={(e) =>
                  onUpdateStatus(order.id, e.target.value, order.code)
                }
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-extrabold text-slate-800 hover:border-primary focus:outline-none cursor-pointer select-none"
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
              <span className="font-bold text-slate-800 text-sm select-none">Tổng tiền đơn hàng:</span>
              <span className="font-black text-primary text-lg select-text">
                {formatPrice(order.finalAmount || order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 select-none">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
