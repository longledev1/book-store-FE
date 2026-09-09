import React from "react";
import { FolderOpen, X } from "lucide-react";

interface BulkActionToolbarProps {
  selectedCount: number;
  onMoveClick: () => void;
  onClearSelection: () => void;
}

export default function BulkActionToolbar({
  selectedCount,
  onMoveClick,
  onClearSelection,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-xl animate-in slide-in-from-bottom-4 duration-250 select-none font-sans">
      <div className="flex items-center gap-3">
        {/* Count Badge */}
        <span className="text-[10px] sm:text-xs font-black bg-white/15 px-2.5 py-1 rounded-xl">
          Đã chọn {selectedCount} tệp
        </span>
        <span className="hidden sm:inline text-xs text-slate-300 font-semibold">
          Chọn các tệp tin để di chuyển đồng loạt
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Clear selection button */}
        <button
          type="button"
          onClick={onClearSelection}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl"
        >
          <X className="w-4.5 h-4.5" />
          <span className="hidden sm:inline">Hủy chọn</span>
        </button>

        {/* Move bulk items button */}
        <button
          type="button"
          onClick={onMoveClick}
          className="bg-primary hover:bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer active:scale-98"
        >
          <FolderOpen className="w-4 h-4" />
          <span>Di chuyển</span>
        </button>
      </div>
    </div>
  );
}
