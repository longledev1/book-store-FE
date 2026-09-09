import React from "react";

interface ProductFormFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export default function ProductFormFooter({ onClose, isSubmitting }: ProductFormFooterProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3 shrink-0">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer"
      >
        Hủy bỏ
      </button>
      <button
        type="submit"
        form="product-form"
        disabled={isSubmitting}
        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-blue-700 active:scale-98 transition-all cursor-pointer shadow-sm shadow-blue-500/10 disabled:opacity-50"
      >
        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </div>
  );
}
