import React from "react";
import {
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  Eye,
} from "lucide-react";
import { formatPrice, formatDate } from "@/utils/format";
import Pagination from "@/components/ui/Pagination";

const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ xác nhận", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "CONFIRMED", label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "SHIPPING", label: "Đang giao hàng", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "COMPLETED", label: "Hoàn thành", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-rose-50 text-rose-700 border-rose-200" },
];

interface OrderTableProps {
  orders: any[];
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUpdateStatus: (orderId: string, newStatus: string, orderCode: string) => void;
  onOpenDetail: (orderId: string) => void;
  updatingId: string | null;
}

export default function OrderTable({
  orders,
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  onUpdateStatus,
  onOpenDetail,
  updatingId,
}: OrderTableProps) {
  const renderStatusBadge = (status: string) => {
    const config = ORDER_STATUS_OPTIONS.find((s) => s.value === status);
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-xs font-extrabold select-none ${
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

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left select-text">
          {/* Table Headers */}
          <thead>
            <tr className="text-slate-455 border-b border-slate-200/60 bg-slate-50/70 text-[10px] font-black tracking-wider uppercase whitespace-nowrap select-none">
              <th className="px-6 py-4 w-16 text-center">STT</th>
              <th className="px-6 py-4">Mã đơn</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Ngày đặt</th>
              <th className="px-6 py-4">Thanh toán</th>
              <th className="px-6 py-4 text-right">Tổng tiền</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Cập nhật / Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs font-semibold sm:text-sm">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-20 text-center text-xs font-bold text-slate-400 select-none"
                >
                  Không tìm thấy đơn hàng nào trong hệ thống.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-slate-50/30"
                >
                  {/* STT */}
                  <td className="px-6 py-4 text-slate-500 font-bold text-center select-none">
                    {startIndex + index + 1}
                  </td>

                  {/* Code */}
                  <td className="px-6 py-4 font-black text-primary select-text">
                    {order.code}
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4 select-text">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-slate-450 font-medium">
                        {order.customerPhone}
                      </span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 text-slate-500 font-medium text-xs select-text">
                    {formatDate(order.createdAt)}
                  </td>

                  {/* Payment Method */}
                  <td className="px-6 py-4 whitespace-nowrap select-text">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-bold">
                      {order.paymentMethod === "VNPAY" ? "VNPAY Online" : "COD"}
                    </span>
                  </td>

                  {/* Total Amount */}
                  <td className="px-6 py-4 text-right font-black text-primary text-sm whitespace-nowrap select-text">
                    {formatPrice(order.finalAmount || order.totalAmount)}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center whitespace-nowrap select-none">
                    {renderStatusBadge(order.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center whitespace-nowrap select-none">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        disabled={updatingId === order.id}
                        value={order.status}
                        onChange={(e) =>
                          onUpdateStatus(order.id, e.target.value, order.code)
                        }
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-primary focus:outline-none cursor-pointer disabled:opacity-50"
                      >
                        {ORDER_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => onOpenDetail(order.id)}
                        className="hover:text-primary cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-slate-50/40 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center select-none">
          <span className="text-xs text-slate-400 font-semibold text-center sm:text-left">
            Hiển thị {startIndex + 1}-{endIndex} trên tổng số {totalItems} đơn hàng
          </span>
          <div className="w-full sm:w-auto [&>div]:border-t-0 [&>div]:pt-0 [&>div]:mt-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
