import { useState } from "react";
import { PieChart, ShoppingCart } from "lucide-react";
import type { OrderStatusAnalyticsItem } from "@/services/analytics.service";

interface OrderStatusDonutCardProps {
  data: OrderStatusAnalyticsItem[];
  isLoading: boolean;
}

// Color palette for statuses
const STATUS_COLORS: Record<string, { stroke: string; bg: string; text: string }> = {
  COMPLETED: { stroke: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700" },
  SHIPPING: { stroke: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700" },
  DELIVERING: { stroke: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700" },
  CONFIRMED: { stroke: "#06b6d4", bg: "bg-cyan-50", text: "text-cyan-700" },
  PROCESSING: { stroke: "#06b6d4", bg: "bg-cyan-50", text: "text-cyan-700" },
  PENDING: { stroke: "#8b5cf6", bg: "bg-purple-50", text: "text-purple-700" },
  CANCELLED: { stroke: "#f43f5e", bg: "bg-rose-50", text: "text-rose-700" },
  REFUNDED: { stroke: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700" },
  RETURNED: { stroke: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700" },
};

const FALLBACK_PALETTE = [
  { stroke: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-700" },
  { stroke: "#ec4899", bg: "bg-pink-50", text: "text-pink-700" },
  { stroke: "#14b8a6", bg: "bg-teal-50", text: "text-teal-700" },
  { stroke: "#eab308", bg: "bg-yellow-50", text: "text-yellow-700" },
];

export default function OrderStatusDonutCard({
  data,
  isLoading,
}: OrderStatusDonutCardProps) {
  const [hoveredStatus, setHoveredStatus] = useState<string | null>(null);

  const totalOrders = data.reduce((acc, item) => acc + item.count, 0);

  // SVG circle calculation
  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute strokeDasharray and strokeDashoffset for each slice
  let accumulatedPercent = 0;
  const slices = data.map((item, idx) => {
    const pct =
      item.percentage > 0
        ? item.percentage
        : totalOrders > 0
        ? (item.count / totalOrders) * 100
        : 0;
    const strokeDasharray = `${(pct / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += pct;

    const colorConfig =
      STATUS_COLORS[item.status] ||
      FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];

    return {
      ...item,
      pct,
      strokeDasharray,
      strokeDashoffset,
      colorConfig,
    };
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/60">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-850 tracking-tight">
              Trạng Thái Đơn Hàng
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Tỷ lệ hoàn thành & hủy đơn
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">
            Tổng đơn
          </span>
          <span className="text-sm font-black text-slate-800">
            {totalOrders.toLocaleString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Content Body */}
      {isLoading ? (
        <div className="h-[260px] flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-purple-500 animate-spin" />
        </div>
      ) : totalOrders === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-xs font-semibold text-slate-400">
          Chưa có dữ liệu đơn hàng trong kỳ này
        </div>
      ) : (
        <div className="flex flex-col items-center py-3 space-y-4">
          {/* Centered Donut Chart SVG */}
          <div className="relative flex-shrink-0 my-1">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
            >
              {/* Background circle track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth={strokeWidth}
              />
              {/* Slices */}
              {slices.map((slice) => {
                const isHovered = hoveredStatus === slice.status;
                return (
                  <circle
                    key={slice.status}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={slice.colorConfig.stroke}
                    strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    strokeLinecap="butt"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredStatus(slice.status)}
                    onMouseLeave={() => setHoveredStatus(null)}
                  />
                );
              })}
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
              <ShoppingCart className="w-5 h-5 text-slate-300 mb-0.5" />
              <span className="text-xl font-black text-slate-800">
                {hoveredStatus
                  ? slices.find((s) => s.status === hoveredStatus)?.count || 0
                  : totalOrders.toLocaleString("vi-VN")}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                {hoveredStatus
                  ? slices.find((s) => s.status === hoveredStatus)?.label || "Đơn hàng"
                  : "Tổng đơn"}
              </span>
            </div>
          </div>

          {/* Status Breakdown Legend List */}
          <div className="w-full space-y-1.5 select-none pt-1">
            {slices.map((slice) => {
              const isHovered = hoveredStatus === slice.status;
              return (
                <div
                  key={slice.status}
                  onMouseEnter={() => setHoveredStatus(slice.status)}
                  onMouseLeave={() => setHoveredStatus(null)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    isHovered ? "bg-slate-100/90 scale-[1.01]" : "hover:bg-slate-50"
                  }`}
                >
                  {/* Left: Status Dot & Label */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: slice.colorConfig.stroke }}
                    />
                    <span
                      className="text-xs font-bold text-slate-700 truncate"
                      title={slice.label || slice.status}
                    >
                      {slice.label || slice.status}
                    </span>
                  </div>

                  {/* Right: Count & Percentage */}
                  <div className="flex items-center gap-3 text-right flex-shrink-0">
                    <span className="text-xs font-black text-slate-850 tabular-nums">
                      {slice.count}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 w-10 text-right tabular-nums">
                      {slice.pct.toFixed(0)}%
                    </span>
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
