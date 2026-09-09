import React, { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";
import {
  uploadMultipleMediaAPI,
  type MediaFolder,
} from "../../../../services/media.service";
import { toast } from "../../../../stores/useToastStore";
import { formatBytes } from "../../../../utils/format";

interface MediaUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingFolders: MediaFolder[];
}

export default function MediaUploadDialog({
  isOpen,
  onClose,
  onSuccess,
  existingFolders,
}: MediaUploadDialogProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>("general");
  const [subFolder, setSubFolder] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = [
    "general",
    "products",
    "categories",
    "avatars",
    "banners",
    "events",
    "authors",
  ]; // Predefined folders

  // Extract existing subfolders under products to suggest
  const productSubfolders = existingFolders
    .filter((f) => f.folderPath.startsWith("products/"))
    .map((f) => f.folderPath.replace("products/", ""));

  // Generate previews when files change
  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // Clean up urls
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (newFiles.length === 0) {
        toast.error("Chỉ chấp nhận các tệp tin hình ảnh!");
        return;
      }
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (files.length === 0) {
      toast.error("Vui lòng chọn ít nhất một hình ảnh để tải lên!");
      return;
    }

    setIsUploading(true);
    try {
      // Format subFolder slug: remove spaces, lowercase, etc.
      const formattedSubFolder =
        selectedFolder === "products" && subFolder.trim()
          ? subFolder
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9-_]/g, "-")
          : undefined;

      await uploadMultipleMediaAPI(files, selectedFolder, formattedSubFolder);

      toast.success("Tải lên hình ảnh thành công!");
      setFiles([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi upload:", error);
      const errMsg =
        error.response?.data?.message ||
        "Tải lên thất bại. Vui lòng kiểm tra lại cấu hình.";
      toast.error(errMsg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-[2px] select-none">
      <div className="animate-in fade-in zoom-in-95 flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-2xl duration-200 sm:p-8">
        {/* Header */}
        <div className="mb-4 flex shrink-0 items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black tracking-tight text-slate-800 uppercase sm:text-lg">
            Tải lên hình ảnh
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="mb-4 flex-1 scrollbar-thin space-y-4 overflow-y-auto pr-1">
          {/* Folder selection */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="pl-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                Thư mục lưu trữ
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                disabled={isUploading}
                className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
              >
                {folders.map((f) => (
                  <option key={f} value={f}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-folder for Products selection */}
            {selectedFolder === "products" && (
              <div className="flex flex-col gap-1">
                <label className="pl-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                  Thư mục con / Tên sản phẩm
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={subFolder}
                    onChange={(e) => setSubFolder(e.target.value)}
                    disabled={isUploading}
                    placeholder="Nhập hoặc chọn tên thư mục..."
                    list="product-subfolders-list"
                    className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
                  />
                  <datalist id="product-subfolders-list">
                    {productSubfolders.map((sub) => (
                      <option key={sub} value={sub} />
                    ))}
                  </datalist>
                </div>
              </div>
            )}
          </div>

          {/* Drag & Drop upload zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-8 transition-all select-none ${
              isDragging
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50 border-slate-200 hover:bg-slate-50/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
            <div className="text-primary flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
              <Upload className="h-6 w-6 stroke-[1.5]" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-slate-750 text-xs font-black">
                Kéo thả nhiều ảnh vào đây
              </p>
              <p className="text-[10px] font-bold text-slate-400">
                hoặc{" "}
                <span className="text-primary font-black underline">
                  chọn từ thiết bị của bạn
                </span>
              </p>
            </div>
          </div>

          {/* Selected files previews list */}
          {files.length > 0 && (
            <div className="space-y-2">
              <label className="pl-1 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                Danh sách ảnh đã chọn ({files.length})
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="group relative flex items-center gap-2 overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50 p-2"
                  >
                    {previews[idx] ? (
                      <img
                        src={previews[idx]}
                        alt={file.name}
                        className="h-10 w-10 shrink-0 rounded-xl border border-slate-100 object-cover"
                      />
                    ) : (
                      <div className="text-slate-450 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200">
                        <ImageIcon className="h-4.5 w-4.5" />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className="text-slate-750 block truncate text-[10px] font-bold"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(idx);
                      }}
                      disabled={isUploading}
                      className="text-slate-450 absolute top-1.5 right-1.5 cursor-pointer rounded-lg border border-slate-100 bg-white p-1 opacity-0 shadow-sm transition-colors group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 focus:opacity-100 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-98 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleUploadSubmit}
            disabled={isUploading || files.length === 0}
            className="bg-primary flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang tải lên...</span>
              </>
            ) : (
              <span>Bắt đầu tải lên</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
