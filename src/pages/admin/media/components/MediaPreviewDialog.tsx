import {
  X,
  Calendar,
  HardDrive,
  Edit3,
  Trash2,
  FileText,
  Info,
  Move,
} from "lucide-react";
import { type Media } from "../../../../services/media.service";
import { formatBytes, resolveMediaUrl, formatDate } from "../../../../utils/format";

interface MediaPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  media: Media | null;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onMoveClick: () => void;
}

export default function MediaPreviewDialog({
  isOpen,
  onClose,
  media,
  onEditClick,
  onDeleteClick,
  onMoveClick,
}: MediaPreviewDialogProps) {
  if (!isOpen || !media) return null;

  const isImage = media.mimeType?.startsWith("image/");
  const formattedDate = formatDate(media.createdAt, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log("MediaPreviewDialog - media:", resolveMediaUrl(media.fileUrl));
  return (
    <div className="animate-fade-in fixed inset-0 z-45 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-[2px] select-none">
      <div className="animate-in fade-in zoom-in-95 flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-2xl duration-200 sm:p-8">
        {/* Header */}
        <div className="mb-4 flex shrink-0 items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="flex items-center gap-2 text-base font-black tracking-tight text-slate-800 uppercase sm:text-lg">
            <Info className="text-primary h-5 w-5 shrink-0" />
            <span>Chi tiết tệp tin</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mb-4 flex-grow scrollbar-thin space-y-5 overflow-y-auto pr-1">
          {/* Main Image/File Preview Area */}
          <div className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200/50 bg-slate-50">
            {isImage ? (
              <img
                src={resolveMediaUrl(media.fileUrl)}
                alt={media.altText || media.fileName}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-slate-350 flex flex-col items-center gap-2 select-none">
                <FileText className="h-16 w-16 stroke-[1.1]" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  {media.mimeType}
                </span>
              </div>
            )}

            {/* Alt text overlay */}
            {media.altText && (
              <div className="absolute right-3 bottom-3 left-3 rounded-xl border border-white/5 bg-slate-900/70 p-3 text-xs leading-normal font-bold text-white backdrop-blur-[2px]">
                Alt Text: {media.altText}
              </div>
            )}
          </div>

          {/* Details list info card */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 select-text sm:grid-cols-2">
            <div className="space-y-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                  Tên tệp tin
                </span>
                <span className="text-xs font-bold break-all text-slate-700">
                  {media.fileName}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                  Đường dẫn thư mục
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold break-all text-slate-700">
                  <HardDrive className="h-3.5 w-3.5 text-slate-400" />
                  {media.folderPath}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                  MIME Type
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {media.mimeType || "image/png"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                  Dung lượng
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {formatBytes(media.size)}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                  Ngày tải lên
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {formattedDate}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase select-none">
                  Alt Text (Mô tả thay thế)
                </span>
                <span
                  className={`text-xs font-bold ${media.altText ? "text-slate-700" : "text-slate-400 italic"}`}
                >
                  {media.altText || "Chưa thiết lập"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-100 pt-3">
          {/* Danger delete trigger */}
          <button
            type="button"
            onClick={onDeleteClick}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-100/50 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition-all hover:bg-rose-100 active:scale-98"
          >
            <Trash2 className="h-4 w-4" />
            <span>Xóa tệp tin</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMoveClick}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-98"
            >
              <Move className="h-4 w-4" />
              <span>Di chuyển</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-98"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={onEditClick}
              className="bg-primary flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98"
            >
              <Edit3 className="h-4 w-4" />
              <span>Chỉnh sửa Alt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
