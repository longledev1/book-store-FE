import type { ComponentType } from "react";
import { CreditCard, Banknote, Wallet } from "lucide-react";
import type { PaymentMethodAnalyticsItem } from "@/services/analytics.service";
import { formatPrice } from "@/utils/format";

interface PaymentMethodsCardProps {
  data: PaymentMethodAnalyticsItem[];
  isLoading: boolean;
}

const METHOD_CONFIG: Record<
  string,
  { label: string; icon: ComponentType<{ className?: string }>; color: string; barColor: string }
> = {
  COD: {
    label: "Thanh toán khi nhận hàng (COD)",
    icon: Banknote,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    barColor: "bg-emerald-500",
  },
  VNPAY: {
    label: "Cổng thanh toán VNPAY",
    icon: CreditCard,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    barColor: "bg-blue-500",
  },
  BANK_TRANSFER: {
    label: "Chuyển khoản ngân hàng",
    icon: Wallet,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    barColor: "bg-purple-500",
  },
};

export default function PaymentMethodsCard({
  data,
  isLoading,
}: PaymentMethodsCardProps) {
  // Filter out MOMO
  const filteredData = data.filter(
    (item) => item.method?.toUpperCase() !== "MOMO"
  );
  const totalAmountSum = filteredData.reduce((acc, item) => acc + item.totalAmount, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/60">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-850 tracking-tight">
              Phương Thức Thanh Toán
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Cơ cấu giao dịch qua cổng thanh toán
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-8 space-y-4 animate-pulse">
          <div className="h-4 bg-slate-100 rounded-full" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="h-10 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          Chưa có giao dịch thanh toán trong kỳ này
        </div>
      ) : (
        <div className="space-y-5 py-4">
          {/* Stacked Distribution Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            {filteredData.map((item, idx) => {
              const cfg =
                METHOD_CONFIG[item.method] || {
                  barColor: idx === 0 ? "bg-indigo-500" : "bg-slate-400",
                };
              const pct =
                totalAmountSum > 0
                  ? (item.totalAmount / totalAmountSum) * 100
                  : item.percentage || 0;

              return (
                <div
                  key={item.method || idx}
                  className={`h-full ${cfg.barColor} transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                  title={`${item.label || item.method}: ${pct.toFixed(1)}%`}
                />
              );
            })}
          </div>

          {/* List breakdown */}
          <div className="space-y-3">
            {filteredData.map((item) => {
              const cfg =
                METHOD_CONFIG[item.method] || {
                  label: item.label || item.method,
                  icon: Wallet,
                  color: "bg-slate-50 text-slate-600 border-slate-200",
                  barColor: "bg-slate-500",
                };
              const Icon = cfg.icon;
              const pct =
                totalAmountSum > 0
                  ? (item.totalAmount / totalAmountSum) * 100
                  : item.percentage || 0;

              return (
                <div
                  key={item.method}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs flex-shrink-0 ${cfg.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-800 block truncate">
                        {item.label || cfg.label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {item.count.toLocaleString("vi-VN")} đơn hàng
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-black text-slate-850">
                      {formatPrice(item.totalAmount)}
                    </div>
                    <div className="text-[11px] font-bold text-slate-400">
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
