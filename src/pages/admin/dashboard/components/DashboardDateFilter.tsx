import { Calendar, RotateCcw } from "lucide-react";

export type DateRangePreset = "7d" | "30d" | "90d" | "year";

interface DashboardDateFilterProps {
  selectedPreset: DateRangePreset;
  onSelectPreset: (preset: DateRangePreset) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function DashboardDateFilter({
  selectedPreset,
  onSelectPreset,
  onRefresh,
  isLoading,
}: DashboardDateFilterProps) {
  const presets: { key: DateRangePreset; label: string }[] = [
    { key: "7d", label: "7 ngày qua" },
    { key: "30d", label: "30 ngày qua" },
    { key: "90d", label: "3 tháng qua" },
    { key: "year", label: "Năm nay" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
      {/* Preset range tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/70 rounded-xl">
        <Calendar className="w-4 h-4 text-slate-400 ml-2 mr-1 hidden sm:block" />
        {presets.map((p) => {
          const isActive = selectedPreset === p.key;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => onSelectPreset(p.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-white text-primary shadow-xs"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Refresh Button */}
      <button
        type="button"
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-650 transition-all cursor-pointer select-none active:scale-[0.98] disabled:opacity-50"
        title="Làm mới dữ liệu thống kê"
      >
        <RotateCcw
          className={`w-3.5 h-3.5 text-slate-500 ${
            isLoading ? "animate-spin text-primary" : ""
          }`}
        />
        <span className="hidden sm:inline">Làm mới</span>
      </button>
    </div>
  );
}
