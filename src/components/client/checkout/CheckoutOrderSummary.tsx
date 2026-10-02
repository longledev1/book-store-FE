import React from "react";
import { CreditCard, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/utils/format";
import type { CartItem } from "@/stores/useCartStore";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  finalTotal: number;
  paymentMethod: "COD" | "VNPAY";
  isSubmitting: boolean;
}

export default function CheckoutOrderSummary({
  items,
  totalAmount,
  shippingFee,
  finalTotal,
  paymentMethod,
  isSubmitting,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="space-y-6 lg:sticky lg:top-24 font-sans text-left">
      <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-5">
        <h3 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wide">
          Đơn hàng của bạn ({items.length} món)
        </h3>

        {/* Items List */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {items.map((item) => {
            const price = item.finalPrice || item.price;
            return (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-14 object-cover rounded-lg border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-800 truncate">{item.name}</h5>
                  <span className="text-slate-450 font-medium">
                    Số lượng: {item.quantity}
                  </span>
                </div>
                <span className="font-black text-slate-800 shrink-0">
                  {formatPrice(price * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs font-semibold">
          <div className="flex justify-between text-slate-500">
            <span>Tạm tính tiền sách</span>
            <span className="text-slate-800 font-bold">{formatPrice(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Phí vận chuyển</span>
            <span className="text-slate-800 font-bold">{formatPrice(shippingFee)}</span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
            <span className="text-xs font-black text-slate-800 uppercase">
              Tổng tiền thanh toán
            </span>
            <span className="text-2xl font-black text-primary">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>

        {/* Submit Order Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-xs font-extrabold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang xử lý đơn hàng...</span>
            </>
          ) : paymentMethod === "VNPAY" ? (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Thanh toán qua VNPAY</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác nhận đặt hàng (COD)</span>
            </>
          )}
        </button>
      </div>

      {/* Guarantees */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 select-none">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Bảo mật thông tin thanh toán tuyệt đối</span>
      </div>
    </div>
  );
}
