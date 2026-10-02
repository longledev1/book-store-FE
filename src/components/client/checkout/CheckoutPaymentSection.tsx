import React from "react";
import { Truck, CreditCard } from "lucide-react";

interface CheckoutPaymentSectionProps {
  paymentMethod: "COD" | "VNPAY";
  setPaymentMethod: (method: "COD" | "VNPAY") => void;
}

export default function CheckoutPaymentSection({
  paymentMethod,
  setPaymentMethod,
}: CheckoutPaymentSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-5 text-left font-sans">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
          2
        </div>
        <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-wide">
          Phương thức thanh toán
        </h3>
      </div>

      <div className="space-y-3">
        {/* Option 1: COD */}
        <label
          onClick={() => setPaymentMethod("COD")}
          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            paymentMethod === "COD"
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-slate-200/80 bg-white hover:border-slate-300"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-xs font-extrabold text-slate-800">
                Thanh toán khi nhận hàng (COD)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Bạn sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sách.
            </p>
          </div>
        </label>

        {/* Option 2: VNPAY */}
        <label
          onClick={() => setPaymentMethod("VNPAY")}
          className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            paymentMethod === "VNPAY"
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-slate-200/80 bg-white hover:border-slate-300"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="VNPAY"
            checked={paymentMethod === "VNPAY"}
            onChange={() => setPaymentMethod("VNPAY")}
            className="mt-1 accent-primary cursor-pointer"
          />
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span className="text-xs font-extrabold text-slate-800">
                Thanh toán qua VNPAY (ATM / QR Code / Visa)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Thanh toán online an toàn qua cổng VNPAY bằng ứng dụng ngân hàng hoặc thẻ ATM/Visa.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
