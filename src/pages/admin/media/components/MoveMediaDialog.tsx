import React, { useState, useEffect } from "react";
import { Move, FolderOpen, Loader2, X } from "lucide-react";
import { getMediaFoldersAPI, moveMediaGroupAPI, type MediaFolder } from "../../../../services/media.service";
import { toast } from "../../../../stores/useToastStore";

interface MoveMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mediaIds: string[];
  currentFolder?: string;
  onSuccess?: () => void;
}

export default function MoveMediaDialog({
  isOpen,
  onClose,
  mediaIds,
  currentFolder = "products",
  onSuccess,
}: MoveMediaDialogProps) {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDestFolder, setSelectedDestFolder] = useState<string>("");
  const [apiError, setApiError] = useState<string | null>(null);

  // Extract base and subfolder from path (e.g. products/nghe-thuat-song -> base: products, sub: nghe-thuat-song)
  const parseFolderPath = (path: string) => {
    const parts = path.split("/");
    const base = parts[0] || "products";
    const sub = parts.slice(1).join("/");
    return { base, sub };
  };

  const { base: currentBase } = parseFolderPath(currentFolder);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDestFolders = async () => {
      setIsLoadingFolders(true);
      setApiError(null);
      setSelectedDestFolder("");
      try {
        const response = await getMediaFoldersAPI();
        const allFolders = response.data || [];
        
        // Filter folders:
        // 1. Must be in the same base category (e.g., if current is "products/*", show only "products/*" targets)
        // 2. Do not show the current folder path as a moving target (redundant)
        // 3. Must be a subfolder (path contains a slash), do not allow moving to raw root folder "products"
        const filtered = allFolders.filter((f) => {
          const isSameBase = f.folderPath.startsWith(`${currentBase}/`);
          const isCurrent = f.folderPath === currentFolder;
          return isSameBase && !isCurrent;
        });

        setFolders(filtered);
      } catch (err) {
        console.error("Lỗi khi tải danh sách thư mục đích:", err);
        setApiError("Không thể tải danh sách thư mục.");
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchDestFolders();
  }, [isOpen, currentFolder, currentBase]);

  if (!isOpen) return null;

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestFolder) {
      setApiError("Vui lòng chọn thư mục đích.");
      return;
    }

    const { base, sub } = parseFolderPath(selectedDestFolder);
    if (!base || !sub) {
      setApiError("Thư mục đích không hợp lệ.");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      await moveMediaGroupAPI({
        mediaIds,
        baseFolder: base,
        subFolder: sub,
      });

      toast.success(`Đã di chuyển ${mediaIds.length} tệp tin thành công!`);
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi di chuyển media:", error);
      const errMsg = error.response?.data?.message || "Di chuyển tệp tin thất bại.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200/50 shadow-2xl p-6 flex flex-col text-left relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Move className="w-5 h-5 text-primary" />
            <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight">
              Di chuyển tệp tin
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

        {/* Form Body */}
        <form onSubmit={handleMoveSubmit} className="space-y-4">
          
          {/* Summary info */}
          <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Đã chọn:</span>
              <span className="text-primary font-black bg-blue-50 px-2 py-0.5 rounded-lg">
                {mediaIds.length} tệp tin
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Thư mục hiện tại:</span>
              <span className="font-bold text-slate-700 truncate max-w-[200px]" title={currentFolder}>
                {currentFolder || "Nhiều thư mục"}
              </span>
            </div>
          </div>

          {/* Select destination folder */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-0.5 select-none">
              <span>Chuyển đến:</span>
              <span className="text-rose-500">*</span>
            </label>

            {isLoadingFolders ? (
              <div className="flex items-center justify-center py-4 bg-slate-50 border border-slate-200/50 rounded-2xl">
                <Loader2 className="w-5 h-5 text-primary animate-spin mr-2" />
                <span className="text-xs text-slate-400 font-bold select-none">Đang tải thư mục đích...</span>
              </div>
            ) : folders.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-200 rounded-2xl bg-amber-50/20 text-center">
                <p className="text-xs text-amber-700 font-bold">
                  Không tìm thấy thư mục con nào khác thuộc "{currentBase}".
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  Hãy tạo thêm thư mục con ở trang Media trước khi di chuyển.
                </p>
              </div>
            ) : (
              <div className="relative w-full">
                <select
                  value={selectedDestFolder}
                  onChange={(e) => setSelectedDestFolder(e.target.value)}
                  className="w-full text-xs md:text-sm px-4 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-350 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none shadow-sm focus:shadow-md appearance-none cursor-pointer text-slate-750 font-semibold"
                >
                  <option value="">-- Chọn thư mục con đích --</option>
                  {folders.map((f) => (
                    <option key={f.folderPath} value={f.folderPath}>
                      {f.folderPath} ({f.totalFiles} ảnh)
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Action error display */}
          {apiError && (
            <p className="text-xs text-rose-500 font-semibold animate-fade-in pl-1">
              {apiError}
            </p>
          )}

          {/* Dialog Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-650 transition-all hover:bg-slate-200 active:scale-98 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedDestFolder || folders.length === 0}
              className="bg-primary flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang di chuyển...</span>
                </>
              ) : (
                <>
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Di chuyển</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
