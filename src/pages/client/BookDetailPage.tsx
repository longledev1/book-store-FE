import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { mockBooks } from "../../constants/booksData";
import { categoriesData } from "../../constants/categoriesData";
import SectionBadge from "../../components/client/SectionBadge";
import BookCard from "../../components/client/BookCard";

// Helper to generate full book properties if not present in mockBooks
const getFullBookDetails = (bookId: string) => {
  const found = mockBooks.find((b) => b.id === bookId);

  // Pick cover based on bookId or fallback
  const images = [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=600",
  ];

  const hash = bookId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageIndex = hash % images.length;

  if (found) return found;

  return {
    id: bookId,
    title: "Tác Phẩm Chọn Lọc Lumina",
    author: "Nhiều Tác Giả",
    price: "189.000đ",
    rating: 4.8,
    image: images[imageIndex],
    isNew: false,
    category: "Sách Hay",
  };
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const book = getFullBookDetails(id || "1");

  // State hooks
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isExpandedDescription, setIsExpandedDescription] =
    useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Find parent and subcategory dynamically based on book
  const findCategoryHierarchy = (book: any) => {
    let parentCat = categoriesData.find((c) => c.id === book.parentCategoryId);
    let subCat = parentCat?.categories.find(
      (s) => s.name === book.category || s.id === book.category,
    );

    if (!parentCat) {
      for (const parent of categoriesData) {
        const foundSub = parent.categories.find(
          (s) =>
            s.name === book.category ||
            s.id === book.category ||
            s.books.some((b) => String(b.id) === String(book.id)),
        );
        if (foundSub) {
          parentCat = parent;
          subCat = foundSub;
          break;
        }
      }
    }

    // Final fallback
    if (!parentCat) {
      parentCat = categoriesData[0]; // technology
    }
    if (!subCat && parentCat) {
      subCat = parentCat.categories[0];
    }

    return {
      parent: parentCat,
      sub: subCat,
    };
  };

  const { parent: parentCategory, sub: subCategory } =
    findCategoryHierarchy(book);

  // Slider scroll ref & handler
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.8;
      sliderRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Get similar books list (prioritize same category)
  const recommendedBooks = mockBooks
    .filter(
      (b) =>
        b.id !== book.id &&
        (b.category === book.category || b.category === "Công nghệ"),
    )
    .concat(mockBooks.filter((b) => b.id !== book.id))
    .filter(
      (value, index, self) =>
        self.findIndex((b) => b.id === value.id) === index,
    )
    .slice(0, 8);

  // Demo gallery images (12 total images to match the +8 placeholder in mockup)
  const galleryImages = [
    book.image,
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1460518451285-cd3ab43ec357?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300",
  ];

  // Helper values for spec table
  const hash = book.title.length;
  const bookCode = `LUM-${1000 + Number(book.id || 1)}`;
  const bookLang = hash % 2 === 0 ? "Tiếng Việt" : "Tiếng Anh (Bản dịch)";
  const bookWeight = `${300 + (hash % 5) * 40}g`;
  const bookPages = `${280 + (hash % 10) * 20} trang`;

  // Compute original price based on price
  const priceNum = parseInt(book.price.replace(/\D/g, ""), 10);
  const originalPrice = `${Math.floor(priceNum * 1.1)}.000đ`;

  // Demo long description content
  const longDescription = `Cuốn sách này là một tác phẩm xuất sắc mang tính đột phá, cung cấp những kiến thức chuyên sâu và các góc nhìn hoàn toàn mới về chủ đề nghiên cứu. Tác giả đã kết hợp hài hòa giữa lý thuyết học thuật vững chắc và những case study thực tiễn vô cùng sinh động. Qua từng chương sách, người đọc sẽ đi từ những khái niệm nền tảng cơ bản nhất cho đến các mô hình thực hành chuyên sâu nâng cao, giúp giải quyết triệt để các bài toán thực tế thường gặp.

Không chỉ dừng lại ở lý thuyết suông, cuốn sách còn là người đồng hành đáng tin cậy mở ra các phương pháp tiếp cận mới mẻ, giúp kích hoạt tư duy sáng tạo và định hướng phát triển vượt bậc. Lối hành văn mạch lạc, hấp dẫn cùng cách phân tích vấn đề thấu đáo sẽ cuốn hút độc giả ngay từ những trang sách đầu tiên. 

Đây chắc chắn là một tài liệu không thể thiếu trên kệ sách của bất kỳ ai đang muốn nâng cao kiến thức học thuật cũng như rèn luyện kỹ năng thực chiến đỉnh cao trong thời đại công nghệ số đầy biến động ngày nay. Tác phẩm đã được dịch ra hơn 20 ngôn ngữ và nhận được vô số giải thưởng danh giá từ các hiệp hội uy tín trên thế giới.`;

  return (
    <div className="min-h-screen bg-slate-50/30 pt-8 pb-16 text-left font-sans">
      <div className="container-custom">
        {/* Breadcrumb Navigation link */}
        <div className="mb-8 flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
          <Link
            to={`/books?category=${parentCategory.id}`}
            className="hover:text-primary transition-colors"
          >
            {parentCategory.name}
          </Link>
          <span>/</span>
          <Link
            to={`/books?subcategory=${subCategory.id}`}
            className="hover:text-primary transition-colors"
          >
            {subCategory.name}
          </Link>
          <span>/</span>
          <span className="max-w-[200px] truncate font-bold text-slate-600">
            {book.title}
          </span>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: Gallery & CTA Buttons - Narrower (col-span-4) & Sticky */}
          <div className="z-10 space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            {/* Big Main Display Image */}
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-sm">
              <img
                src={galleryImages[activeImageIndex]}
                alt={book.title}
                className="h-full w-full object-cover"
              />

              {/* Floating Favorite Heart button */}
              <button
                onClick={() => setIsFavorited((prev) => !prev)}
                className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow transition-all hover:bg-slate-50 active:scale-90"
              >
                <Heart
                  className={`h-4.5 w-4.5 transition-colors ${
                    isFavorited
                      ? "fill-rose-500 text-rose-500"
                      : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Gallery (Shows exactly 4 clickable thumbnails + 5th custom +N overlay block) */}
            <div className="grid grid-cols-5 gap-2 select-none md:gap-3">
              {galleryImages.slice(0, 4).map((img, idx) => {
                const isSelected = activeImageIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border bg-white transition-all ${
                      isSelected
                        ? "border-primary ring-primary/10 scale-98 ring-2"
                        : "border-slate-200/60 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}

              {/* 5th custom block showing remaining images count */}
              {galleryImages.length > 4 && (
                <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border border-transparent bg-[#3F3F46] text-white shadow-sm select-none">
                  <span className="text-xs font-black sm:text-sm">
                    +{galleryImages.length - 4}
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between rounded-3xl border border-slate-200/50 bg-white p-4 shadow-sm select-none">
              <span className="text-slate-455 pl-1 text-xs font-bold tracking-wider uppercase">
                Số lượng mua:
              </span>
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-slate-50 px-2 py-1">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  className="text-slate-550 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-200/60"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-black text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="text-slate-550 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-200/60"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col gap-4 select-none sm:flex-row">
              {/* Add to Cart button */}
              <button className="flex flex-grow cursor-pointer items-center justify-center gap-2 rounded-2xl border border-indigo-200/50 bg-[#EEF2FF] px-6 py-3.5 font-extrabold text-[#4F46E5] shadow-sm transition-all hover:bg-[#E0E7FF] hover:shadow active:scale-98">
                <ShoppingCart className="h-4.5 w-4.5" />
                <span>Thêm vào giỏ</span>
              </button>

              {/* Buy Now button */}
              <button className="bg-primary flex flex-grow cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-extrabold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98">
                <span>Mua ngay</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Spaced boxes for easier readability */}
          <div className="space-y-6 lg:col-span-8">
            {/* BOX 1: Core details & Pricing */}
            <div className="space-y-5 rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-sm sm:p-8">
              <h1 className="text-xl leading-snug font-black tracking-tight text-slate-800 uppercase sm:text-2xl">
                {book.title}
              </h1>

              {/* Author & Cover Meta */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-slate-100 pb-4 text-xs font-semibold sm:grid-cols-2 sm:text-sm">
                <p className="text-slate-455">
                  Tác giả:{" "}
                  <Link
                    to={`/author/${encodeURIComponent(book.author)}`}
                    className="font-bold text-primary hover:underline cursor-pointer"
                  >
                    {book.author}
                  </Link>
                </p>
                <p className="text-slate-455">
                  Hình thức bìa:{" "}
                  <span className="font-bold text-slate-800">Bìa Mềm</span>
                </p>
              </div>

              {/* Rating stars & counts */}
              <div className="flex flex-wrap items-center gap-3 select-none">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const isFilled = i < Math.floor(book.rating);
                    return (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          isFilled
                            ? "fill-warning text-warning"
                            : "fill-slate-100 text-slate-200"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-warning cursor-pointer text-xs font-bold hover:underline">
                  (100 đánh giá)
                </span>
                <span className="text-xs text-slate-300">|</span>
                <span className="text-slate-455 text-xs font-bold">
                  Đã bán 1.3k
                </span>
              </div>

              {/* Pricing details */}
              <div className="pt-2">
                {/* Big price in primary blue */}
                <span className="text-primary text-3xl font-black sm:text-4xl">
                  {book.price}
                </span>
              </div>
            </div>

            {/* BOX 2: Spec Details Table */}
            <div className="space-y-4 rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-sm sm:p-8">
              <h3 className="text-primary border-b border-slate-100 pb-3 text-sm font-black tracking-wider uppercase select-none md:text-base">
                Thông tin chi tiết
              </h3>

              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Mã hàng (ISBN)
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookCode}
                  </span>
                </div>
                <div className="grid grid-cols-12 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Tác giả
                  </span>
                  <span className="col-span-8 font-bold">
                    <Link
                      to={`/author/${encodeURIComponent(book.author)}`}
                      className="text-primary hover:underline cursor-pointer"
                    >
                      {book.author}
                    </Link>
                  </span>
                </div>
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Năm xuất bản
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    2025
                  </span>
                </div>
                <div className="grid grid-cols-12 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Ngôn ngữ
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookLang}
                  </span>
                </div>
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Trọng lượng (gr)
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookWeight}
                  </span>
                </div>
                <div className="grid grid-cols-12 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Số trang
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookPages}
                  </span>
                </div>
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Hình thức
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    Bìa Mềm
                  </span>
                </div>
              </div>
            </div>

            {/* BOX 3: Description Block with Read-More collapse feature */}
            <div className="space-y-4 rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-sm sm:p-8">
              <h3 className="text-primary border-b border-slate-100 pb-3 text-sm font-black tracking-wider uppercase select-none md:text-base">
                Mô tả sản phẩm
              </h3>

              <div className="relative space-y-3">
                {/* Truncated container */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpandedDescription ? "max-h-[1000px]" : "max-h-36"
                  }`}
                >
                  {/* Title of description */}
                  <h4 className="mb-3 text-sm leading-snug font-extrabold text-slate-800 sm:text-base">
                    {book.title}
                  </h4>

                  <p className="text-xs leading-relaxed font-medium whitespace-pre-line text-slate-500 sm:text-sm">
                    {longDescription}
                  </p>

                  {/* Faded overlay at bottom when collapsed */}
                  {!isExpandedDescription && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>

                {/* Read more toggle button */}
                <button
                  onClick={() => setIsExpandedDescription((prev) => !prev)}
                  className="text-primary flex cursor-pointer items-center gap-1 pt-1 text-xs font-black transition-colors select-none hover:text-blue-700"
                >
                  <span>
                    {isExpandedDescription ? "Thu gọn mô tả" : "Xem thêm mô tả"}
                  </span>
                  {isExpandedDescription ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Books Section Slider */}
        <div className="mt-16 border-t border-slate-200/60 pt-10 text-left">
          <div className="mb-8 flex items-center justify-between select-none">
            <SectionBadge title="Sản phẩm tương tự" />

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory scrollbar-none gap-5 overflow-x-auto scroll-smooth pb-4"
          >
            {recommendedBooks.map((item) => (
              <div
                key={item.id}
                className="max-w-[280px] min-w-[240px] flex-shrink-0 snap-start sm:min-w-[280px]"
              >
                <BookCard
                  id={item.id}
                  title={item.title}
                  author={item.author}
                  category={item.category}
                  price={item.price}
                  rating={item.rating}
                  image={item.image}
                  isNew={item.isNew}
                  aiScore={item.aiScore}
                  showAiScore={!!item.aiScore}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
