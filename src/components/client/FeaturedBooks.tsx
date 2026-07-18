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

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  isNew: boolean;
  aiScore: number;
}

const mockBooks: Book[] = [
  {
    id: "1",
    title: "Chiến Lược Số Hóa",
    author: "Alex Rivers",
    category: "KINH DOANH",
    price: "249.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 98
  },
  {
    id: "2",
    title: "Tâm Thế Trí Tuệ Nhân Tạo",
    author: "Sarah Chen",
    category: "CÔNG NGHỆ",
    price: "189.000đ",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 95
  },
  {
    id: "3",
    title: "Kết Nối Con Người",
    author: "Dr. James Miller",
    category: "TÂM LÝ",
    price: "320.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 92
  },
  {
    id: "4",
    title: "Tia Sáng Sáng Tạo",
    author: "Maya Lee",
    category: "SÁNG TẠO",
    price: "155.000đ",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 89
  },
  {
    id: "5",
    title: "Lập Trình Tương Lai",
    author: "John Doe",
    category: "CÔNG NGHỆ",
    price: "215.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 94
  },
  {
    id: "6",
    title: "Tư Duy Thiết Kế 101",
    author: "Alice W.",
    category: "SÁNG TẠO",
    price: "175.000đ",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 87
  },
  {
    id: "7",
    title: "Kinh Tế Học Hành Vi",
    author: "Richard T.",
    category: "KINH DOANH",
    price: "280.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 91
  },
  {
    id: "8",
    title: "Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    category: "LỊCH SỬ",
    price: "350.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1460518451285-cd3ab43ec357?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 96
  },
  {
    id: "9",
    title: "Tâm Lý Học Đám Đông",
    author: "Gustave Le Bon",
    category: "TÂM LÝ",
    price: "125.000đ",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 83
  },
  {
    id: "10",
    title: "Vật Lý Lý Thuyết Hiện Đại",
    author: "Stephen Hawking",
    category: "KHOA HỌC",
    price: "390.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 97
  },
  {
    id: "11",
    title: "Lược Sử Thời Gian",
    author: "Stephen Hawking",
    category: "KHOA HỌC",
    price: "195.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 90
  },
  {
    id: "12",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "TÂM LÝ",
    price: "110.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 93
  },
  {
    id: "13",
    title: "Khởi Nghiệp Tinh Gọn",
    author: "Eric Ries",
    category: "KINH DOANH",
    price: "189.000đ",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 86
  },
  {
    id: "14",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "TIỂU THUYẾT",
    price: "99.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 88
  },
  {
    id: "15",
    title: "Trí Tuệ Do Thái",
    author: "Eran Katz",
    category: "TÂM LÝ",
    price: "135.000đ",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 85
  },
  {
    id: "16",
    title: "Cha Giàu Cha Nghèo",
    author: "Robert Kiyosaki",
    category: "KINH DOANH",
    price: "150.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 91
  }
];

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
