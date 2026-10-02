import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "@/stores/useToastStore";
import { useCartStore } from "@/stores/useCartStore";

interface CatalogBookCardProps {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string;
  subcatName: string;
  isFavorited: boolean;
  rawProduct?: any;
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
  rawProduct,
  onToggleFavorite,
  onAddToCart,
}: CatalogBookCardProps) {
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
          category: subcatName || "Sách",
        });
        toast.success(`Đã thêm "${title}" vào giỏ hàng!`);
      }
    });
  };

  return (
    <Link
      to={`/books/${id}`}
      className="group bg-white rounded-3xl border border-slate-200/50 p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-primary/20 relative h-full text-left cursor-pointer"
    >
      <div>
        {/* Cover Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-slate-50 border border-slate-100 shadow-sm mb-4">
          <img
            src={image || "/mock_data.png"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/mock_data.png";
            }}
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

      {/* Bottom Actions Row: Price & Vertical Stacked Buttons */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-xs md:text-sm text-slate-800">
            {price}
          </span>
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
