import React, { useState, useEffect } from "react";
import { X, Edit3, Loader2 } from "lucide-react";
import { updateMediaAPI, type Media } from "../../../../services/media.service";
import { toast } from "../../../../stores/useToastStore";

interface MediaEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  media: Media | null;
  onSuccess: () => void;
}

export default function MediaEditDialog({
  isOpen,
  onClose,
  media,
  onSuccess,
}: MediaEditDialogProps) {
  const [altText, setAltText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (media) {
      setAltText(media.altText || "");
    }
  }, [media, isOpen]);

  if (!isOpen || !media) return null;

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateMediaAPI(media.id, { altText: altText.trim() });
      toast.success("Cập nhật thông tin mô tả tệp tin thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật altText:", error);
      const errMsg = error.response?.data?.message || "Không thể cập nhật thông tin. Vui lòng thử lại.";
      toast.error(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 flex flex-col text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
          <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-primary shrink-0" />
            <span>Chỉnh sửa thông tin</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1 select-none">
              Tên tệp tin (Chỉ đọc)
            </label>
            <input
              type="text"
              value={media.fileName}
              disabled
              className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-xl text-xs font-semibold text-slate-500 outline-none select-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1 select-none">
              Alt Text (Mô tả hình ảnh)
            </label>
            <textarea
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Nhập mô tả hình ảnh cho SEO..."
              disabled={isSaving}
              rows={3}
              className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4"
              autoFocus
            />
            <p className="text-[10px] text-slate-400 font-medium pl-1 select-none">
              Mô tả thay thế giúp tối ưu hóa công cụ tìm kiếm (SEO) và hỗ trợ công cụ đọc màn hình.
            </p>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3 select-none">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-blue-700 active:scale-98 transition-all cursor-pointer shadow-sm shadow-blue-500/10 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>Lưu thay đổi</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
