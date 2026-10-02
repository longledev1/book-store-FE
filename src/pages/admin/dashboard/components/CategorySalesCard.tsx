import { FolderKanban } from "lucide-react";
import type { CategorySalesItem } from "@/services/analytics.service";
import { formatPrice } from "@/utils/format";

interface CategorySalesCardProps {
  data: CategorySalesItem[];
  isLoading: boolean;
}

const BAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-indigo-500",
];

export default function CategorySalesCard({
  data,
  isLoading,
}: CategorySalesCardProps) {
  // Sort descending by revenue
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);
  const totalCategoryRevenue = sortedData.reduce((acc, c) => acc + c.revenue, 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-100/60">
            <FolderKanban className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-850 tracking-tight">
              Doanh Số Theo Danh Mục
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Tỷ trọng doanh thu giữa các thể loại sách
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="py-6 space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-2 animate-pulse">
              <div className="flex justify-between">
                <div className="w-24 h-3 bg-slate-200 rounded" />
                <div className="w-16 h-3 bg-slate-200 rounded" />
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : sortedData.length === 0 ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          Chưa có doanh số theo danh mục trong kỳ này
        </div>
      ) : (
        <div className="space-y-4 py-4">
          {sortedData.map((cat, idx) => {
            const pct =
              cat.percentage > 0
                ? cat.percentage
                : totalCategoryRevenue > 0
                ? (cat.revenue / totalCategoryRevenue) * 100
                : 0;
            const barColor = BAR_COLORS[idx % BAR_COLORS.length];

            return (
              <div key={cat.categoryId || idx} className="space-y-1.5">
                {/* Category Info Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 truncate min-w-0 flex-1 pr-2" title={cat.categoryName}>
                    {cat.categoryName}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      {cat.booksSold.toLocaleString("vi-VN")} cuốn
                    </span>
                    <span className="font-black text-slate-850">
                      {formatPrice(cat.revenue)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 w-11 text-right tabular-nums">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
