import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface CategoryHardDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  categoryName: string;
}

export default function CategoryHardDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  categoryName,
}: CategoryHardDeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 space-y-5 text-left relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-black uppercase tracking-tight">
              Xác nhận xóa vĩnh viễn
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
          <p>
            Bạn có chắc chắn muốn xóa vĩnh viễn danh mục{" "}
            <span className="font-extrabold text-slate-800">"{categoryName}"</span> khỏi hệ thống?
          </p>
          <p className="text-rose-500 text-[11px] font-extrabold bg-rose-50/50 p-2.5 border border-rose-100 rounded-xl">
            Cảnh báo: Hành động này không thể hoàn tác và sẽ xóa sạch mọi danh mục con và sách liên kết với danh mục này!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 select-none font-sans">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 active:scale-98 transition-all cursor-pointer shadow-sm shadow-rose-500/10"
          >
            Xóa vĩnh viễn
          </button>
        </div>

      </div>
    </div>
  );
}
