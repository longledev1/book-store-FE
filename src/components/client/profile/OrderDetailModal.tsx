import React from "react";
import {
  X,
  Package,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  Loader2,
  XCircle,
  FileText,
} from "lucide-react";
import { formatPrice, formatDate, resolveMediaUrl } from "@/utils/format";

interface OrderDetailModalProps {
  order: any | null;
  onClose: () => void;
  onCancelOrder: (orderId: string, orderCode: string) => void;
  onPayVnpay: (orderId: string) => void;
  cancellingId: string | null;
}

export default function OrderDetailModal({
  order,
  onClose,
  onCancelOrder,
  onPayVnpay,
  cancellingId,
}: OrderDetailModalProps) {
  if (!order) return null;

  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";
  const isUnpaidVnpay =
    order.paymentMethod === "VNPAY" &&
    order.paymentStatus !== "PAID" &&
    order.status !== "CANCELLED";

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Chờ xác nhận</span>
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            <span>Đã xác nhận</span>
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-extrabold text-indigo-700">
            <Truck className="w-4 h-4 text-indigo-500" />
            <span>Đang giao hàng</span>
          </span>
        );
      case "COMPLETED":
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Hoàn thành</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-extrabold text-rose-700">
            <Ban className="w-4 h-4 text-rose-500" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-700">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getItemImage = (item: any) => {
    const rawUrl =
      item.product?.imgUrl ||
      item.product?.imageUrl ||
      item.product?.thumbnail ||
      item.product?.albums?.[0]?.imageUrl ||
      item.product?.albums?.[0]?.media?.fileUrl ||
      item.imgUrl ||
      item.productImg ||
      item.productImage;
    return resolveMediaUrl(rawUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200 font-sans text-left">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 text-base">
                  Chi tiết đơn {order.code}
                </h3>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-xs text-slate-450 font-medium mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Ngày đặt: {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Recipient & Shipping Address */}
          <div className="rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4 space-y-2 text-xs font-semibold text-slate-600">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 text-primary mb-2">
              <MapPin className="w-4 h-4" />
              Thông tin giao hàng
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <p className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Người nhận: <strong>{order.customerName}</strong></span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Số điện thoại: <strong>{order.customerPhone}</strong></span>
              </p>
            </div>
            <p className="pt-1 text-slate-700 leading-relaxed">
              <strong>Địa chỉ:</strong> {order.shippingAddress}
            </p>
            {order.note && (
              <p className="pt-1 italic text-slate-500 border-t border-slate-200/40 mt-2">
                <strong>Ghi chú:</strong> {order.note}
              </p>
            )}
          </div>

          {/* Products List */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              Sản phẩm trong đơn ({order.items?.length || 0})
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
                      <div className="w-12 h-14 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400 overflow-hidden shadow-2xs">
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
                        <h5 className="font-bold text-slate-800 truncate">
                          {item.productName}
                        </h5>
                        <span className="text-[11px] text-slate-450 font-medium block">
                          Số lượng: <strong className="text-slate-700 font-bold">{item.quantity}</strong> x {formatPrice(item.unitPrice)}
                        </span>
                      </div>
                    </div>

                    <span className="font-black text-slate-800 shrink-0 text-xs md:text-sm">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Subtotal Details */}
          <div className="rounded-2xl border border-slate-200/60 p-4 space-y-2 text-xs font-semibold text-slate-600 bg-slate-50/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/40">
              <span className="text-slate-500">Hình thức thanh toán:</span>
              <span className="font-bold text-slate-800">
                {order.paymentMethod === "VNPAY"
                  ? "Thanh toán VNPAY Online"
                  : "Thanh toán khi nhận hàng (COD)"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-slate-800 text-sm">Tổng thanh toán:</span>
              <span className="font-black text-primary text-lg">
                {formatPrice(order.finalAmount || order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0 select-none">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            {isUnpaidVnpay && (
              <button
                onClick={() => {
                  onClose();
                  onPayVnpay(order.id);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-extrabold shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Thanh toán VNPAY</span>
              </button>
            )}

            {canCancel && (
              <button
                disabled={cancellingId === order.id}
                onClick={() => {
                  onClose();
                  onCancelOrder(order.id, order.code);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
              >
                {cancellingId === order.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                <span>Hủy đơn hàng</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
