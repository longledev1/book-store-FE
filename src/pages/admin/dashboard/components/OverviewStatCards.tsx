import {
  DollarSign,
  ShoppingBag,
  BookOpen,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { OverviewAnalyticsData } from "@/services/analytics.service";
import { formatPrice } from "@/utils/format";

interface OverviewStatCardsProps {
  data: OverviewAnalyticsData | null;
  isLoading: boolean;
}

export default function OverviewStatCards({
  data,
  isLoading,
}: OverviewStatCardsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 bg-white rounded-3xl border border-slate-200/70 shadow-xs animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-2xl bg-slate-100" />
              <div className="w-12 h-5 rounded-full bg-slate-100" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="w-16 h-3 rounded bg-slate-100" />
              <div className="w-24 h-6 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Tổng Doanh Thu",
      value: formatPrice(data.revenue.current),
      previousText: `${formatPrice(data.revenue.previous)} kỳ trước`,
      growth: data.revenue.growthRate,
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Tổng Đơn Hàng",
      value: data.orders.current.toLocaleString("vi-VN"),
      previousText: `${data.orders.previous.toLocaleString("vi-VN")} đơn kỳ trước`,
      growth: data.orders.growthRate,
      icon: ShoppingBag,
      iconBg: "bg-blue-50 text-primary border-blue-100",
    },
    {
      title: "Sách Đã Bán",
      value: data.booksSold.current.toLocaleString("vi-VN") + " cuốn",
      previousText: `${data.booksSold.previous.toLocaleString("vi-VN")} cuốn kỳ trước`,
      growth: data.booksSold.growthRate,
      icon: BookOpen,
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Khách Hàng Mới",
      value: data.customers.current.toLocaleString("vi-VN") + " người",
      previousText: `${data.customers.previous.toLocaleString("vi-VN")} người kỳ trước`,
      growth: data.customers.growthRate,
      icon: Users,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      title: "Giá Trị TB / Đơn (AOV)",
      value: formatPrice(data.averageOrderValue.current),
      previousText: `${formatPrice(data.averageOrderValue.previous)} kỳ trước`,
      growth: data.averageOrderValue.growthRate,
      icon: CreditCard,
      iconBg: "bg-sky-50 text-sky-600 border-sky-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isPositive = card.growth >= 0;
        const isZero = card.growth === 0;

        return (
          <div
            key={idx}
            className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            {/* Top Row: Icon + Growth Badge */}
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${card.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Growth rate badge */}
              <div
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                  isZero
                    ? "bg-slate-50 text-slate-500 border-slate-200"
                    : isPositive
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/60"
                    : "bg-rose-50 text-rose-600 border-rose-200/60"
                }`}
                title={`So với cùng kỳ trước đó: ${card.growth}%`}
              >
                {isZero ? null : isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>
                  {isPositive && !isZero ? "+" : ""}
                  {card.growth}%
                </span>
              </div>
            </div>

            {/* Bottom Row: Title + Main Value */}
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-400 block tracking-tight">
                {card.title}
              </span>
              <h3 className="text-lg md:text-xl font-black text-slate-850 tracking-tight">
                {card.value}
              </h3>
              <p className="text-[11px] font-medium text-slate-400 truncate pt-0.5">
                {card.previousText}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
