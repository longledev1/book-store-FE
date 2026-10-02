import React from "react";
import { Star } from "lucide-react";

interface ReviewFilterTabsProps {
  selectedRating?: number;
  onSelectRating: (rating?: number) => void;
}

export default function ReviewFilterTabs({
  selectedRating,
  onSelectRating,
}: ReviewFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 select-none">
      <button
        onClick={() => onSelectRating(undefined)}
        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
          selectedRating === undefined
            ? "bg-slate-900 text-white shadow-sm"
            : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50"
        }`}
      >
        Tất cả
      </button>

      {[5, 4, 3, 2, 1].map((star) => (
        <button
          key={star}
          onClick={() => onSelectRating(star)}
          className={`flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            selectedRating === star
              ? "bg-slate-900 text-white shadow-sm"
              : "border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          <span>{star}</span>
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        </button>
      ))}
    </div>
  );
}
