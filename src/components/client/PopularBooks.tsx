import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import SectionBadge from "./SectionBadge";
import BookCard from "./BookCard";

import { mockBooks } from "../../constants/booksData";

const categoriesFilterList = [
  { id: "all", label: "Tất cả" },
  { id: "TÂM LÝ", label: "Tâm lý" },
  { id: "KINH DOANH", label: "Kinh doanh" },
  { id: "KHOA HỌC", label: "Khoa học & CN" },
  { id: "LỊCH SỬ", label: "Lịch sử" }
];

export default function PopularBooks() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getFilteredBooks = () => {
    const popularBookIds = ["8", "12", "14", "16", "9", "10", "13", "15"];
    const popularBooksList = mockBooks.filter((book) => popularBookIds.includes(book.id));

    if (activeTab === "all") return popularBooksList;
    return popularBooksList.filter((book) => {
      if (activeTab === "TÂM LÝ") {
        return book.parentCategoryId === "psychology";
      }
      if (activeTab === "KINH DOANH") {
        return book.parentCategoryId === "business";
      }
      if (activeTab === "KHOA HỌC") {
        return book.parentCategoryId === "science" || book.parentCategoryId === "technology";
      }
      if (activeTab === "LỊCH SỬ") {
        return book.parentCategoryId === "history";
      }
      return book.parentCategoryId === activeTab;
    });
  };

  const filteredBooks = getFilteredBooks();

  return (
    <section className="py-16 md:py-24 bg-slate-50/50 border-b border-border-light font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
        
        {/* Header: Title on Left, Filters on Right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="text-left space-y-3 max-w-xl">
            <SectionBadge title="Sách phổ biến" />
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Những tác phẩm xuất sắc được cộng đồng độc giả yêu thích và bình chọn nhiều nhất tại LuminaBook.
            </p>
          </div>

          {/* Category tabs on Right */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-full border border-border-light shadow-sm shrink-0 self-start lg:self-auto">
            {categoriesFilterList.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-text hover:text-neutral-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Popular Books Filtered Grid */}
        {filteredBooks.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl bg-white">
            Không tìm thấy sách phổ biến thuộc thể loại này.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
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
                isFavorited={!!wishlist[book.id]}
                onToggleFavorite={toggleWishlist}
              />
            ))}
          </div>
        )}

        {/* Bottom Call to Action Button */}
        <div className="pt-4 text-center">
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-650 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
          >
            <span>Xem tất cả sách phổ biến</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
