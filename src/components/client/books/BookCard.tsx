import React from "react";
import { Heart, Star, Sparkles, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "@/stores/useToastStore";
import { useCartStore } from "@/stores/useCartStore";

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
  rawProduct?: any;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  onAddToCart?: (id: string, e: React.MouseEvent) => void;
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
  rawProduct,
  onToggleFavorite,
  onAddToCart,
}: BookCardProps) {
  const { requireAuth } = useRequireAuth();
  const addItem = useCartStore((state) => state.addItem);

  const parsePrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const digits = priceStr.replace(/[^\d]/g, "");
    return Number(digits) || 0;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(() => {
      if (onAddToCart) {
        onAddToCart(id, e);
      } else {
        const priceNum = rawProduct?.price ? Number(rawProduct.price) : parsePrice(price);
        const finalPriceNum = rawProduct?.finalPrice ? Number(rawProduct.finalPrice) : priceNum;

        addItem({
          id: id,
          productId: rawProduct?.id || id,
          name: title,
          slug: rawProduct?.slug || id,
          price: priceNum,
          finalPrice: finalPriceNum,
          image: image,
          category: category || "Sách",
        });
        toast.success(`Đã thêm "${title}" vào giỏ hàng!`);
      }
    });
  };

  return (
    <Link
      to={`/books/${id}`}
      className="group border-border-light hover:border-primary/25 relative flex h-full cursor-pointer flex-col justify-between rounded-3xl border bg-white p-4 text-left transition-all duration-300 hover:shadow-md"
    >
      <div>
        {/* Book cover image */}
        <div className="relative mb-3.5 aspect-[3/4] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
          <img
            src={image || "/mock_data.png"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/mock_data.png";
            }}
          />

          {/* Favorite Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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

      {/* Bottom Actions Row: Price, Rating & Vertical Stacked Buttons */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          {/* Price */}
          <span className="text-neutral-dark text-sm font-extrabold">{price}</span>

          {/* Rating */}
          <div className="text-neutral-dark flex items-center gap-1 text-xs font-bold select-none">
            <Star className="fill-warning text-warning h-3.5 w-3.5" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Stacked Action Buttons (Top: Add to Cart, Bottom: View Details) */}
        <div className="flex flex-col gap-2 pt-0.5 select-none">
          {/* Top: Add to Cart (Primary background + White text) */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/10 transition-all cursor-pointer active:scale-[0.98]"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Thêm vào giỏ</span>
          </button>

          {/* Bottom: View Details */}
          <div className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 group-hover:border-primary/40 group-hover:bg-primary/5 text-slate-600 group-hover:text-primary text-xs font-bold transition-all cursor-pointer">
            <span>Xem chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
