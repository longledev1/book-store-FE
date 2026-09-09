import React from "react";
import { type Media } from "../../../../services/media.service";
import MediaCard from "./MediaCard";
import { Inbox, Loader2 } from "lucide-react";

interface MediaGridProps {
  medias: Media[];
  onMediaClick: (media: Media) => void;
  isLoading: boolean;
  selectedMediaIds?: string[];
  onToggleSelect?: (mediaId: string, e: React.MouseEvent) => void;
}

export default function MediaGrid({
  medias,
  onMediaClick,
  isLoading,
  selectedMediaIds = [],
  onToggleSelect,
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="flex-1 min-h-[40vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs text-slate-455 font-bold select-none">Đang tải tệp tin...</span>
      </div>
    );
  }

  if (medias.length === 0) {
    return (
      <div className="flex-1 min-h-[40vh] bg-white border border-slate-200/50 rounded-3xl flex flex-col items-center justify-center gap-4 p-8 select-none">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
          <Inbox className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-xs sm:text-sm font-black text-slate-700 uppercase tracking-tight">Thư mục trống</h4>
          <p className="text-[11px] text-slate-455 font-bold max-w-[280px] leading-normal">
            Không tìm thấy hình ảnh nào trong thư mục này. Hãy thử tải lên hình ảnh mới!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {medias.map((media) => {
        const isSelected = selectedMediaIds.includes(media.id);
        return (
          <MediaCard
            key={media.id}
            media={media}
            onClick={() => onMediaClick(media)}
            isSelected={isSelected}
            onSelect={onToggleSelect ? (e) => onToggleSelect(media.id, e) : undefined}
          />
        );
      })}
    </div>
  );
}
