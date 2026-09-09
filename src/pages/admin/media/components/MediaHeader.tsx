import React from "react";
import { UploadCloud, FolderHeart } from "lucide-react";

interface MediaHeaderProps {
  onUploadClick: () => void;
}

export default function MediaHeader({ onUploadClick }: MediaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 select-none">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-primary border border-blue-100/50">
            <FolderHeart className="w-4.5 h-4.5" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">
            Quản lý Media
          </h2>
        </div>
        <p className="text-xs text-slate-450 font-bold pl-10 select-none">
          Quản lý và tổ chức kho hình ảnh, tài liệu hệ thống
        </p>
      </div>

      <button
        type="button"
        onClick={onUploadClick}
        className="cursor-pointer rounded-2xl bg-primary px-4 py-2.5 text-xs font-black text-white shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-98 transition-all shrink-0"
      >
        <UploadCloud className="w-4.5 h-4.5" />
        <span>Tải lên ảnh mới</span>
      </button>
    </div>
  );
}
