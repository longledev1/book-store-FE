import React from "react";
import { Heart, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export interface BookCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  isNew?: boolean;
  aiScore?: number;
  showAiScore?: boolean;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export default function BookCard({
  id,
  title,
  author,
  category,
  price,
  rating,
  image,
  aiScore,
  showAiScore = false,
  isFavorited = false,
  onToggleFavorite,
}: BookCardProps) {
  return (
    <Link
      to={`/books/${id}`}
      className="group border-border-light hover:border-primary/25 relative flex h-full cursor-pointer flex-col justify-between rounded-3xl border bg-white p-4 text-left transition-all duration-300 hover:shadow-md"
    >
      <div>
        {/* Book cover image */}
        <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              if (onToggleFavorite) {
                onToggleFavorite(id, e);
              }
            }}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-slate-50"
          >
            <Heart
              className={`h-4.5 w-4.5 transition-colors ${
                isFavorited
                  ? "fill-rose-500 text-rose-500"
                  : "group-hover:text-slate-650 text-slate-400"
              }`}
            />
          </button>

          {/* AI Match percentage tag (visible only on AI Recommendations) */}
          {showAiScore && aiScore !== undefined && (
            <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg bg-emerald-500/90 px-2.5 py-1.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-sm select-none">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-white" />
              <span>{aiScore}% Match</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1">
          <span className="text-primary text-[10px] font-extrabold tracking-wider uppercase">
            {category}
          </span>
          <h4 className="text-neutral-dark group-hover:text-primary line-clamp-1 text-sm font-bold transition-colors duration-200">
            {title}
          </h4>
          <p className="text-muted-text text-xs leading-none font-medium">
            {author}
          </p>
        </div>
      </div>

      {/* Bottom Row: Price & Star Rating */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        <span className="text-neutral-dark text-sm font-bold">{price}</span>
        <div className="text-neutral-dark flex items-center gap-1 text-xs font-bold select-none">
          <Star className="fill-warning text-warning h-3.5 w-3.5" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
