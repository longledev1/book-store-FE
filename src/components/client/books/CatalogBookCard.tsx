import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface CatalogBookCardProps {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string;
  subcatName: string;
  isFavorited: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onAddToCart?: (id: string, e: React.MouseEvent) => void;
}

export default function CatalogBookCard({
  id,
  title,
  author,
  price,
  image,
  subcatName,
  isFavorited,
  onToggleFavorite,
  onAddToCart,
}: CatalogBookCardProps) {
  return (
    <Link
      to={`/books/${id}`}
      className="group bg-white rounded-3xl border border-slate-200/50 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-primary/20 relative h-full text-left cursor-pointer"
    >
      <div>
        {/* Cover Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-50 border border-slate-100 shadow-sm mb-4">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Heart wishlist toggle */}
          <button
            onClick={(e) => onToggleFavorite(id, e)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center transition-colors cursor-pointer z-10 hover:bg-slate-50"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited
                  ? "text-rose-500 fill-rose-500"
                  : "text-slate-400"
              }`}
            />
          </button>
        </div>

        {/* Text Block */}
        <div className="space-y-1">
          <span className="text-[9px] font-extrabold text-primary tracking-wider uppercase truncate block">
            {subcatName}
          </span>
          <h4 className="font-bold text-xs md:text-sm text-slate-800 line-clamp-1 group-hover:text-primary transition-colors duration-200 leading-tight">
            {title}
          </h4>
          <p className="text-[11px] text-slate-455 font-medium truncate mt-0.5">
            {author}
          </p>
        </div>
      </div>

      {/* Bottom Price & Button */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
        <span className="font-bold text-xs md:text-sm text-slate-800 shrink-0">
          {price}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onAddToCart) {
              onAddToCart(id, e);
            }
          }}
          className="bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#4F46E5] text-[10px] md:text-xs font-bold px-2.5 py-2 rounded-xl transition-all cursor-pointer shrink-0"
        >
          Thêm vào giỏ
        </button>
      </div>

    </Link>
  );
}
