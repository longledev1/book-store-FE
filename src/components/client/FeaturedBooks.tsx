import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

import SectionBadge from "./SectionBadge";
import BookCard from "./BookCard";

// Swiper core styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { mockBooks } from "../../constants/booksData";

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

export default function FeaturedBooks() {
  const [activeFilter, setActiveFilter] = useState<"all" | "newest" | "ai">("all");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getFilteredBooks = () => {
    let list = [...mockBooks];
    if (activeFilter === "newest") {
      list = list.filter((b) => b.isNew);
    } else if (activeFilter === "ai") {
      list = list.sort((a, b) => b.aiScore - a.aiScore);
    }
    return list;
  };

  const filteredBooks = getFilteredBooks();
  const bookPairs = chunkArray(filteredBooks, 2);

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
                <span>AI xếp hạng đặc biệt dựa trên sở thích của bạn</span>
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
          {filteredBooks.length === 0 ? (
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
                    {pair.map((book) => (
                      <BookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        category={book.category}
                        price={book.price}
                        rating={book.rating}
                        image={book.image}
                        isNew={book.isNew}
                        aiScore={book.aiScore}
                        showAiScore={activeFilter === "ai"}
                        isFavorited={!!wishlist[book.id]}
                        onToggleFavorite={toggleWishlist}
                      />
                    ))}
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
