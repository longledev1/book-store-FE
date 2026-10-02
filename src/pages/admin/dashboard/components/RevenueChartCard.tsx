import { useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import type { RevenueAnalyticsItem } from "@/services/analytics.service";
import { formatPrice } from "@/utils/format";

interface RevenueChartCardProps {
  data: RevenueAnalyticsItem[];
  isLoading: boolean;
  period: "day" | "month";
  onPeriodChange: (period: "day" | "month") => void;
}

export default function RevenueChartCard({
  data,
  isLoading,
  period,
  onPeriodChange,
}: RevenueChartCardProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Totals for the selected timeframe
  const totalRevenue = data.reduce((acc, item) => acc + (item.revenue || 0), 0);
  const totalCost = data.reduce((acc, item) => acc + (item.cost || 0), 0);
  const totalProfit = data.reduce((acc, item) => acc + (item.profit || 0), 0);
  const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0";

  // SVG Chart Dimensions
  const svgWidth = 700;
  const svgHeight = 260;
  const paddingX = 45;
  const paddingBottom = 35;
  const paddingTop = 20;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(
    1,
    ...data.map((d) => Math.max(d.revenue || 0, d.cost || 0, d.profit || 0))
  );

  // Helper to format large numbers for Y-axis
  const formatYAxis = (val: number) => {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
    return `${val}`;
  };

  // Helper to format date for X-axis
  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    if (period === "month") {
      const parts = dateStr.split("-");
      return parts.length >= 2 ? `T${parts[1]}/${parts[0]}` : dateStr;
    }
    const parts = dateStr.split("-");
    return parts.length >= 3 ? `${parts[2]}/${parts[1]}` : dateStr;
  };

  // Helper to format date for Tooltip
  const formatTooltipDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `Ngày ${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (parts.length === 2) {
      return `Tháng ${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  // Calculate points
  const points = data.map((d, index) => {
    const x =
      data.length > 1
        ? paddingX + (index / (data.length - 1)) * chartWidth
        : paddingX + chartWidth / 2;
    const yRev = svgHeight - paddingBottom - ((d.revenue || 0) / maxVal) * chartHeight;
    const yProfit = svgHeight - paddingBottom - ((d.profit || 0) / maxVal) * chartHeight;
    const yCost = svgHeight - paddingBottom - ((d.cost || 0) / maxVal) * chartHeight;
    return { x, yRev, yProfit, yCost, data: d };
  });

  const revLinePath = points.length
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.yRev}`).join(" ")
    : "";
  const profitLinePath = points.length
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.yProfit}`).join(" ")
    : "";

  const revAreaPath = points.length
    ? `${revLinePath} L ${points[points.length - 1].x},${svgHeight - paddingBottom} L ${
        points[0].x
      },${svgHeight - paddingBottom} Z`
    : "";

  const profitAreaPath = points.length
    ? `${profitLinePath} L ${points[points.length - 1].x},${svgHeight - paddingBottom} L ${
        points[0].x
      },${svgHeight - paddingBottom} Z`
    : "";

  // 4 Y-axis guide lines
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => ({
    val: maxVal * pct,
    y: svgHeight - paddingBottom - pct * chartHeight,
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center border border-blue-100/60">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-850 tracking-tight">
              Doanh Thu & Lợi Nhuận
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Biến động doanh thu, giá vốn và tỷ suất lợi nhuận ròng
          </p>
        </div>

        {/* Period Switcher: Day / Month */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => onPeriodChange("day")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              period === "day"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Theo Ngày
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange("month")}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              period === "month"
                ? "bg-white text-primary shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Theo Tháng
          </button>
        </div>
      </div>

      {/* KPI Sub-bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-100/80 my-2">
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
            Doanh thu kỳ này
          </span>
          <span className="text-base sm:text-lg font-black text-blue-600">
            {formatPrice(totalRevenue)}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
            Giá vốn ước tính
          </span>
          <span className="text-base sm:text-lg font-black text-slate-700">
            {formatPrice(totalCost)}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
            Lợi nhuận ròng
          </span>
          <span className="text-base sm:text-lg font-black text-emerald-600">
            {formatPrice(totalProfit)}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
            Tỷ suất LN (Margin)
          </span>
          <span className="text-base sm:text-lg font-black text-slate-850 flex items-center gap-1">
            {profitMargin}%
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500 inline" />
          </span>
        </div>
      </div>

      {/* Main SVG Chart Area */}
      <div className="relative w-full pt-3">
        {isLoading ? (
          <div className="h-[260px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl animate-pulse">
            <div className="text-xs font-semibold text-slate-400">Đang tải dữ liệu biểu đồ...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[260px] w-full flex items-center justify-center bg-slate-50/50 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400">
              Không có dữ liệu trong khoảng thời gian đã chọn
            </div>
          </div>
        ) : (
          <div className="relative w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[500px] overflow-visible"
            >
              <defs>
                {/* Revenue Gradient */}
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
                {/* Profit Gradient */}
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y-axis Grid lines & labels */}
              {yTicks.map((tick, i) => (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={tick.y}
                    x2={svgWidth - paddingX}
                    y2={tick.y}
                    stroke="#f1f5f9"
                    strokeDasharray={i === 0 ? "none" : "3 3"}
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={tick.y + 3}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94a3b8"
                    fontWeight="500"
                  >
                    {formatYAxis(tick.val)}
                  </text>
                </g>
              ))}

              {/* Area Fills */}
              <path d={revAreaPath} fill="url(#revenueGrad)" />
              <path d={profitAreaPath} fill="url(#profitGrad)" />

              {/* Revenue Line */}
              <path
                d={revLinePath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Profit Line */}
              <path
                d={profitLinePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & hover triggers */}
              {points.map((p, idx) => {
                const isHovered = hoveredIdx === idx;
                const showLabel =
                  points.length <= 10 ||
                  idx === 0 ||
                  idx === points.length - 1 ||
                  idx % Math.ceil(points.length / 6) === 0;

                return (
                  <g key={idx}>
                    {/* Hover guide line */}
                    {isHovered && (
                      <line
                        x1={p.x}
                        y1={paddingTop}
                        x2={p.x}
                        y2={svgHeight - paddingBottom}
                        stroke="#94a3b8"
                        strokeDasharray="2 2"
                        strokeWidth="1"
                      />
                    )}

                    {/* Revenue dot */}
                    <circle
                      cx={p.x}
                      cy={p.yRev}
                      r={isHovered ? 5 : 3.5}
                      fill="#ffffff"
                      stroke="#2563eb"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-150"
                    />

                    {/* Profit dot */}
                    <circle
                      cx={p.x}
                      cy={p.yProfit}
                      r={isHovered ? 5 : 3}
                      fill="#ffffff"
                      stroke="#10b981"
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-150"
                    />

                    {/* X-axis date label */}
                    {showLabel && (
                      <text
                        x={p.x}
                        y={svgHeight - paddingBottom + 16}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#94a3b8"
                        fontWeight="600"
                      >
                        {formatDateLabel(p.data.date)}
                      </text>
                    )}

                    {/* Interactive hover target */}
                    <rect
                      x={p.x - chartWidth / (points.length * 2)}
                      y={paddingTop}
                      width={Math.max(20, chartWidth / points.length)}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Popup */}
            {hoveredIdx !== null && points[hoveredIdx] && (() => {
              const currentPoint = points[hoveredIdx];
              const xPct = (currentPoint.x / svgWidth) * 100;
              const minY = Math.min(currentPoint.yRev, currentPoint.yProfit);
              const isNearLeft = xPct < 22;
              const isNearRight = xPct > 78;
              const isNearTop = minY < 105;

              const translateX = isNearLeft
                ? "14px"
                : isNearRight
                ? "calc(-100% - 14px)"
                : "-50%";
              const translateY = isNearTop
                ? "14px"
                : "calc(-100% - 14px)";

              return (
                <div
                  className="absolute z-30 pointer-events-none bg-slate-900/95 text-white text-xs rounded-2xl p-3 shadow-2xl border border-slate-700/50 backdrop-blur-md transition-transform duration-75 min-w-[200px]"
                  style={{
                    left: `${xPct}%`,
                    top: `${minY}px`,
                    transform: `translate(${translateX}, ${translateY})`,
                  }}
                >
                  <div className="font-bold text-slate-200 pb-1.5 border-b border-slate-700/70 mb-2 flex items-center justify-between gap-4">
                    <span className="text-white font-extrabold text-[11.5px]">
                      {formatTooltipDate(currentPoint.data.date)}
                    </span>
                    <span className="text-[10.5px] text-slate-300 font-semibold bg-slate-800/90 px-2 py-0.5 rounded-md">
                      {currentPoint.data.orders || 0} đơn
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5 text-blue-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                        Doanh thu:
                      </span>
                      <span className="font-black text-white">
                        {formatPrice(currentPoint.data.revenue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        Lợi nhuận:
                      </span>
                      <span className="font-black text-emerald-300">
                        {formatPrice(currentPoint.data.profit)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4 text-[11px]">
                      <span className="flex items-center gap-1.5 text-rose-300 font-medium">
                        <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0" />
                        Giá vốn:
                      </span>
                      <span className="font-black text-rose-300">
                        {formatPrice(currentPoint.data.cost)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-center gap-5 pt-3 mt-1 border-t border-slate-100 text-xs font-semibold text-slate-500 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600" />
          <span>Doanh thu</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Lợi nhuận ròng</span>
        </div>
      </div>
    </div>
  );
}
