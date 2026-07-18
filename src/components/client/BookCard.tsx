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
  onToggleFavorite
}: BookCardProps) {
  return (
    <Link
      to={`/books/${id}`}
      className="group bg-white rounded-3xl border border-border-light p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-primary/25 relative text-left h-full cursor-pointer"
    >
      <div>
        {/* Book cover image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-50 border border-slate-100 shadow-sm mb-4">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              if (onToggleFavorite) {
                onToggleFavorite(id, e);
              }
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors cursor-pointer z-10 hover:bg-slate-50"
          >
            <Heart
              className={`w-4.5 h-4.5 transition-colors ${
                isFavorited
                  ? "text-rose-500 fill-rose-500"
                  : "text-slate-400 group-hover:text-slate-650"
              }`}
            />
          </button>

          {/* AI Match percentage tag (visible only on AI Recommendations) */}
          {showAiScore && aiScore !== undefined && (
            <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1 select-none">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{aiScore}% Match</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-primary tracking-wider uppercase">
            {category}
          </span>
          <h4 className="font-bold text-sm text-neutral-dark line-clamp-1 group-hover:text-primary transition-colors duration-200">
            {title}
          </h4>
          <p className="text-xs text-muted-text font-medium leading-none">
            {author}
          </p>
        </div>
      </div>

      {/* Bottom Row: Price & Star Rating */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
        <span className="font-bold text-sm text-neutral-dark">
          {price}
        </span>
        <div className="flex items-center gap-1 text-xs font-bold text-neutral-dark select-none">
          <Star className="w-3.5 h-3.5 fill-warning text-warning" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
