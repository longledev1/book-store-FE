import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Sparkles, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import SectionBadge from "@/components/common/SectionBadge";
import BookCard from "@/components/client/books/BookCard";

// Swiper core styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getProductsForClientAPI, type Product } from "@/services/product.service";
import { resolveMediaUrl, formatPrice } from "@/utils/format";
import { PLACEHOLDER_BOOK_IMAGE } from "@/constants/placeholders";

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default function FeaturedBooks() {
  const [activeFilter, setActiveFilter] = useState<"all" | "newest" | "ai">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        let orderBy = "createdAt";
        let sort = "DESC";

        if (activeFilter === "ai") {
          orderBy = "soldCount";
          sort = "DESC";
        }

        const res = await getProductsForClientAPI(1, 20, undefined, undefined, undefined, orderBy, sort);
        if (isMounted && res && res.data) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách tiêu biểu:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const bookPairs = chunkArray(products, 2);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-border-light font-sans overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        
        {/* Header: Title and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left space-y-2">
            <SectionBadge title="Sách tiêu biểu & Bán chạy" />
            {activeFilter === "ai" && (
              <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                <Sparkles className="w-4 h-4 animate-pulse text-primary" />
                <span>AI xếp hạng đặc biệt dựa trên sở thích và xu hướng chọn lựa</span>
              </div>
            )}
          </div>

          {/* Right Controls: Filters and Swiper Navigation */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Filters */}
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-border-light">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-text hover:text-neutral-dark"
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveFilter("newest")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === "newest"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-text hover:text-neutral-dark"
                }`}
              >
                Mới nhất
              </button>
              <button
                onClick={() => setActiveFilter("ai")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeFilter === "ai"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-text hover:text-neutral-dark"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Đề xuất AI</span>
              </button>
            </div>

            {/* Custom Navigation Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                ref={prevRef}
                className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 bg-white hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                ref={nextRef}
                className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 bg-white hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Swiper Slider Wrapper */}
        <div className="relative pt-2">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Đang tải danh sách sách...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl">
              Không tìm thấy sách phù hợp ở bộ lọc này.
            </div>
          ) : (
            <Swiper
              key={activeFilter} // Force Swiper re-init when filter changes
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              slidesPerGroup={1}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                if (swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }
              }}
              breakpoints={{
                480: { slidesPerView: 2, slidesPerGroup: 2 },
                768: { slidesPerView: 3, slidesPerGroup: 3 },
                1024: { slidesPerView: 4, slidesPerGroup: 4 }
              }}
              className="w-full"
            >
              {bookPairs.map((pair, pairIndex) => (
                <SwiperSlide key={pairIndex}>
                  <div className="flex flex-col gap-6">
                    {pair.map((book) => {
                      const firstAlbum = book.albums?.[0];
                      const coverUrl = (firstAlbum as any)?.imageUrl
                        ? resolveMediaUrl((firstAlbum as any).imageUrl)
                        : firstAlbum?.media?.fileUrl
                        ? resolveMediaUrl(firstAlbum.media.fileUrl)
                        : book.imgUrl || PLACEHOLDER_BOOK_IMAGE;
                      const authorName = (book as any).authors?.[0]?.name || "Nhiều tác giả";
                      const categoryName = (book as any).categories?.[0]?.name || "Sách";
                      const bookPrice = formatPrice(book.finalPrice || book.price || 0);

                      return (
                        <BookCard
                          key={book.id}
                          id={book.slug || book.id}
                          title={book.name}
                          author={authorName}
                          category={categoryName}
                          price={bookPrice}
                          rating={(book as any).rating || 5.0}
                          image={coverUrl}
                          isNew={activeFilter === "newest"}
                          aiScore={(book as any).aiScore || 98}
                          showAiScore={activeFilter === "ai"}
                          isFavorited={!!wishlist[book.id]}
                          rawProduct={book}
                          onToggleFavorite={toggleWishlist}
                        />
                      );
                    })}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

      </div>
    </section>
  );
}

