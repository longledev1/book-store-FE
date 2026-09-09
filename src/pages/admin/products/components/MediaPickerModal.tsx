import React, { useState, useEffect } from "react";
import { X, Search, CheckCircle2, ArrowLeft, ArrowRight, Loader2, Image as ImageIcon } from "lucide-react";
import { getMediasAPI, type Media } from "../../../../services/media.service";
import { resolveMediaUrl } from "../../../../utils/format";
import Pagination from "../../../../components/ui/Pagination";
import { useDebounce } from "../../../../hooks/useDebounce";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedMediaList: Media[]) => void;
  alreadySelectedMediaIds: string[];
  defaultFolder?: string;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  alreadySelectedMediaIds,
  defaultFolder = "products",
}: MediaPickerModalProps) {
  const [medias, setMedias] = useState<Media[]>([]);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);
  const [folderPath, setFolderPath] = useState<string>(defaultFolder);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const limit = 18;
  const debouncedSearchQuery = useDebounce(searchQuery, 600);

  // Fetch medias when folder, search, or page changes
  useEffect(() => {
    if (!isOpen) return;

    const fetchPickerMedias = async () => {
      setIsLoading(true);
      try {
        const response = await getMediasAPI(
          currentPage,
          limit,
          folderPath || undefined,
          debouncedSearchQuery.trim() || undefined
        );
        setMedias(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Lỗi khi tải danh sách Picker Media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPickerMedias();
  }, [folderPath, debouncedSearchQuery, currentPage, isOpen]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [folderPath, debouncedSearchQuery]);

  // Reset selected state and folderPath when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedMedias([]);
      setFolderPath(defaultFolder);
    }
  }, [isOpen, defaultFolder]);

  if (!isOpen) return null;

  const toggleSelectMedia = (media: Media) => {
    // Check if already attached to product
    if (alreadySelectedMediaIds.includes(media.id)) return;

    const isSelected = selectedMedias.some((m) => m.id === media.id);
    if (isSelected) {
      setSelectedMedias((prev) => prev.filter((m) => m.id !== media.id));
    } else {
      setSelectedMedias((prev) => [...prev, media]);
    }
  };

  const handleConfirmSelection = () => {
    onSelect(selectedMedias);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center z-[60] p-4 select-none animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 flex flex-col h-[85vh] text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
          <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span>Chọn ảnh từ Media</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filters and Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 shrink-0">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
              Thư mục
            </label>
            <select
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all"
            >
              <option value="products">Products</option>
              <option value="authors">Authors</option>
              <option value="general">General</option>
              <option value="categories">Categories</option>
              <option value="avatars">Avatars</option>
              <option value="banners">Banners</option>
              <option value="events">Events</option>
              <option value="">Tất cả thư mục</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
              Tìm kiếm
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tệp theo tên..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto pr-1 mb-4 scrollbar-thin">
          {isLoading ? (
            <div className="h-full min-h-[30vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-xs text-slate-450 font-bold">Đang tải tệp tin...</span>
            </div>
          ) : medias.length === 0 ? (
            <div className="h-full min-h-[30vh] border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 p-6">
              <ImageIcon className="w-10 h-10 text-slate-350 stroke-[1.2]" />
              <p className="text-xs font-bold text-slate-650">Thư mục trống</p>
              <p className="text-[10px] text-slate-400">Không tìm thấy hình ảnh phù hợp trong folder này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {medias.map((media) => {
                const isSelected = selectedMedias.some((m) => m.id === media.id);
                const isAlreadyAttached = alreadySelectedMediaIds.includes(media.id);

                return (
                  <div
                    key={media.id}
                    onClick={() => toggleSelectMedia(media)}
                    className={`group aspect-square rounded-2xl border bg-white relative overflow-hidden flex items-center justify-center transition-all ${
                      isAlreadyAttached
                        ? "border-slate-100 opacity-40 cursor-not-allowed"
                        : isSelected
                        ? "border-primary ring-4 ring-primary/10 cursor-pointer"
                        : "border-slate-200/60 hover:border-primary/40 cursor-pointer"
                    }`}
                  >
                    <img
                      src={resolveMediaUrl(media.fileUrl)}
                      alt={media.altText || media.fileName}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    {/* Overlay for status */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <div className="bg-white rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
                        </div>
                      </div>
                    )}

                    {isAlreadyAttached && (
                      <div className="absolute inset-0 bg-slate-900/5 flex items-center justify-center">
                        <span className="bg-slate-900/65 backdrop-blur-[1px] text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-lg">
                          Đã thêm
                        </span>
                      </div>
                    )}

                    {/* Hover filename indicator */}
                    <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-[1px] py-1 px-1.5 text-[8px] font-bold text-white truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {media.fileName}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination & Footer actions */}
        <div className="border-t border-slate-100 pt-3 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-grow flex justify-center sm:justify-start">
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 select-none">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-bold rounded-xl active:scale-98 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleConfirmSelection}
              disabled={selectedMedias.length === 0}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-blue-700 active:scale-98 transition-all shadow-sm shadow-blue-500/10 disabled:opacity-50"
            >
              Chọn {selectedMedias.length} ảnh
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
