import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Package, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/utils/format";

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || searchParams.get("vnp_TxnRef") || "ORD-SUCCESS";
  const status = searchParams.get("status");
  const amountParam = searchParams.get("amount");
  const isFailed = status === "FAILED" || status === "CHECKSUM_FAILED";

  if (isFailed) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-50/40 py-12 px-4 font-sans text-center">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-md space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-500 shadow-sm border border-rose-200">
            <XCircle className="w-12 h-12" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Thanh toán thất bại
            </h1>
            <p className="text-xs md:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              Giao dịch thanh toán VNPAY cho đơn hàng <strong className="text-slate-800">{code}</strong> không thành công hoặc đã bị hủy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 select-none">
            <Link
              to="/cart"
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-xs font-extrabold text-white shadow-md transition-all hover:bg-blue-700"
            >
              <span>Thử thanh toán lại</span>
            </Link>
            <Link
              to="/books"
              className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50"
            >
              <span>Về cửa hàng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50/40 py-12 px-4 font-sans text-center">
      {/* Single Compact Bordered Box Container */}
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-md space-y-6">
        {/* Animated Green Checkmark Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-500 shadow-sm border border-emerald-200/60">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Đặt hàng thành công!
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Cảm ơn bạn đã lựa chọn mua sách tại LuminaBook. Đơn hàng của bạn đã được ghi nhận thành công trên hệ thống.
          </p>
        </div>

        {/* Inner Order Details Summary Box */}
        <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-left space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
            <span className="font-bold text-slate-500">Mã đơn hàng:</span>
            <span className="font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
              {code}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
            <span className="font-bold text-slate-500">Trạng thái đơn hàng:</span>
            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              {status === "PAID" ? "Đã thanh toán (VNPAY)" : "Chờ xác nhận (COD)"}
            </span>
          </div>

          {amountParam && (
            <div className="flex items-center justify-between pt-0.5">
              <span className="font-bold text-slate-500">Tổng tiền thanh toán:</span>
              <span className="font-black text-slate-800 text-sm">
                {formatPrice(Number(amountParam))}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons inside the Box */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 select-none">
          <Link
            to="/profile"
            className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-xs font-extrabold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98"
          >
            <Package className="w-4 h-4" />
            <span>Xem đơn hàng</span>
          </Link>
          <Link
            to="/books"
            className="w-full sm:w-1/2 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-650 shadow-sm transition-all hover:bg-slate-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tiếp tục mua sắm</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
