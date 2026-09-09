import React from "react";
import { type Media } from "../../../../services/media.service";
import { FileImage } from "lucide-react";
import { formatBytes, resolveMediaUrl } from "../../../../utils/format";

interface MediaCardProps {
  media: Media;
  onClick: () => void;
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

export default function MediaCard({ media, onClick, isSelected = false, onSelect }: MediaCardProps) {
  const isImage = media.mimeType?.startsWith("image/");

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-2xl border transition-all overflow-hidden flex flex-col cursor-pointer select-none relative ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "border-slate-200/60 hover:border-primary/40 hover:shadow-md"
      }`}
    >
      {/* Selection Checkbox Overlay */}
      {onSelect && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(e);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-md flex items-center justify-center border transition-all cursor-pointer ${
            isSelected 
              ? "bg-primary border-primary text-white scale-105" 
              : "bg-white/80 backdrop-blur-[1px] border-slate-300 hover:border-slate-450 hover:bg-white opacity-0 group-hover:opacity-100 focus:opacity-100"
          }`}
        >
          {isSelected && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      )}

      {/* Thumbnail Preview Area */}
      <div className="aspect-square w-full bg-slate-50 relative flex items-center justify-center border-b border-slate-100 overflow-hidden">
        {isImage ? (
          <img
            src={resolveMediaUrl(media.fileUrl)}
            alt={media.altText || media.fileName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLElement).style.display = "none";
              const nextSib = (e.target as HTMLElement).nextElementSibling;
              if (nextSib) (nextSib as HTMLElement).classList.remove("hidden");
            }}
          />
        ) : null}
        
        {/* Placeholder Fallback Icon */}
        <div className={`flex flex-col items-center gap-1.5 text-slate-355 ${isImage ? "hidden absolute" : ""}`}>
          <FileImage className="w-10 h-10 stroke-[1.2]" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{media.mimeType?.split("/")[1] || "FILE"}</span>
        </div>

        {/* Quick info altText badge */}
        {media.altText && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/65 backdrop-blur-[2px] rounded-lg text-[9px] font-bold text-white max-w-[65%] truncate">
            Alt: {media.altText}
          </div>
        )}
      </div>

      {/* Info Details Footer */}
      <div className="p-3 flex flex-col gap-0.5 min-h-[56px] justify-center bg-white">
        <span className="text-xs font-bold text-slate-700 truncate block group-hover:text-primary transition-colors" title={media.fileName}>
          {media.fileName}
        </span>
        <span className="text-[10px] text-slate-450 font-semibold select-none">
          {formatBytes(media.size)}
        </span>
      </div>
    </div>
  );
}
