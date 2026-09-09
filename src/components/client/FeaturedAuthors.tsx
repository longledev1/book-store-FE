import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowRight, Sparkles, UserX } from "lucide-react";
import { Link } from "react-router-dom";

import { getAuthorsForClientAPI, type Author } from "../../services/author.service";
import { resolveMediaUrl } from "../../utils/format";
import { PLACEHOLDER_AVATAR } from "../../constants/placeholders";
import AuthorAvatar from "../common/AuthorAvatar";

// Swiper core styles
import "swiper/css";

interface DisplayAuthor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export default function FeaturedAuthors() {
  const [authorsRow1, setAuthorsRow1] = useState<DisplayAuthor[]>([]);
  const [authorsRow2, setAuthorsRow2] = useState<DisplayAuthor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await getAuthorsForClientAPI(1, 24);
        const list = response?.data || [];

        if (list.length > 0) {
          const mapped: DisplayAuthor[] = list.map((author: Author) => ({
            id: author.id,
            name: author.name,
            role: "Tác giả nổi bật",
            bio: author.describe || "Tác giả có nhiều tác phẩm tiêu biểu được bạn đọc yêu thích tại Bookstore.",
            avatar: author.avatar?.fileUrl
              ? resolveMediaUrl(author.avatar.fileUrl)
              : PLACEHOLDER_AVATAR,
          }));

          const half = Math.ceil(mapped.length / 2);
          const r1 = mapped.slice(0, half);
          const r2 = mapped.slice(half);

          setAuthorsRow1(r1);
          setAuthorsRow2(r2.length > 0 ? r2 : r1);
        } else {
          setAuthorsRow1([]);
          setAuthorsRow2([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách tác giả nổi bật:", error);
        setAuthorsRow1([]);
        setAuthorsRow2([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  // Duplicate arrays to ensure Swiper has enough slides to perform continuous linear infinite scrolling loop
  const getDuplicatedList = (list: DisplayAuthor[]) => {
    if (list.length === 0) return [];
    if (list.length < 6) {
      return [...list, ...list, ...list, ...list];
    }
    return [...list, ...list, ...list];
  };

  const duplicatedRow1 = getDuplicatedList(authorsRow1);
  const duplicatedRow2 = getDuplicatedList(authorsRow2);

  return (
    <section className="py-16 md:py-24 bg-white border-b border-border-light font-sans relative overflow-hidden">
      
      {/* Self-contained CSS injection for linear marquee sliding effect */}
      <style>{`
        .authors-marquee-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
        .authors-marquee-swiper .swiper-slide {
          cursor: pointer !important;
        }
      `}</style>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Headings - Centered & Styled like CategoryGrid */}
        <div className="text-center space-y-3">
          <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest block">
            Đội ngũ tinh hoa
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-neutral-dark tracking-tight">
            Tác Giả Nổi Bật & Tiêu Biểu
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Gặp gỡ những bộ óc vĩ đại và chuyên gia hàng đầu đứng sau các tác phẩm tri thức được yêu thích nhất.
          </p>
        </div>
      </div>

      {/* Double Row Carousel with center overlapping button */}
      <div className="relative mt-8 w-full select-none">
        
        {isLoading ? (
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 py-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-slate-100 animate-pulse border border-slate-200/50"
              />
            ))}
          </div>
        ) : authorsRow1.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <UserX className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-600">Danh sách tác giả đang được cập nhật</p>
            <p className="text-xs text-slate-400 mt-1">Vui lòng quay lại sau để xem thêm thông tin tác giả mới.</p>
          </div>
        ) : (
          <>
            {/* ROW 1: Slides Left */}
            <div className="w-full">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                slidesPerView={1.8}
                loop={true}
                speed={6000}
                allowTouchMove={false}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  480: { slidesPerView: 2.5 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                  1400: { slidesPerView: 6 },
                }}
                className="authors-marquee-swiper !overflow-visible"
              >
                {duplicatedRow1.map((author, index) => (
                  <SwiperSlide key={`${author.id}-row1-${index}`}>
                    <Link
                      to={`/author/${author.slug || author.id}`}
                      className="group relative block aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer"
                    >
                      {/* Reusable AuthorAvatar Component */}
                      <AuthorAvatar
                        src={author.avatar}
                        alt={author.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Gradient bottom overlay (Default State) */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-left transition-opacity duration-300 group-hover:opacity-0">
                        <h4 className="font-bold text-sm text-white truncate">
                          {author.name}
                        </h4>
                        <p className="text-[10px] text-slate-300 truncate font-medium">
                          {author.role}
                        </p>
                      </div>

                      {/* Full Black Blur Overlay (Hover State) */}
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-left">
                        <span className="text-[8px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Top Author</span>
                        </span>
                        <h4 className="font-bold text-base text-white tracking-tight mt-1.5 leading-none">
                          {author.name}
                        </h4>
                        <p className="text-[10px] text-blue-400 font-semibold mt-1">
                          {author.role}
                        </p>
                        <p className="text-[10px] text-slate-300 leading-relaxed mt-2.5 font-medium border-t border-slate-800/80 pt-2 line-clamp-3">
                          {author.bio}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ROW 2: Slides Right (reverseDirection: true) */}
            <div className="w-full mt-4">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={16}
                slidesPerView={1.8}
                loop={true}
                speed={6000}
                allowTouchMove={false}
                autoplay={{
                  delay: 0,
                  disableOnInteraction: false,
                  reverseDirection: true, // Slides right!
                }}
                breakpoints={{
                  480: { slidesPerView: 2.5 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                  1400: { slidesPerView: 6 },
                }}
                className="authors-marquee-swiper !overflow-visible"
              >
                {duplicatedRow2.map((author, index) => (
                  <SwiperSlide key={`${author.id}-row2-${index}`}>
                    <Link
                      to={`/author/${author.slug || author.id}`}
                      className="group relative block aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer"
                    >
                      {/* Reusable AuthorAvatar Component */}
                      <AuthorAvatar
                        src={author.avatar}
                        alt={author.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />

                      {/* Gradient bottom overlay (Default State) */}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-left transition-opacity duration-300 group-hover:opacity-0">
                        <h4 className="font-bold text-sm text-white truncate">
                          {author.name}
                        </h4>
                        <p className="text-[10px] text-slate-300 truncate font-medium">
                          {author.role}
                        </p>
                      </div>

                      {/* Full Black Blur Overlay (Hover State) */}
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 text-left">
                        <span className="text-[8px] font-bold text-primary tracking-widest uppercase flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Top Author</span>
                        </span>
                        <h4 className="font-bold text-base text-white tracking-tight mt-1.5 leading-none">
                          {author.name}
                        </h4>
                        <p className="text-[10px] text-blue-400 font-semibold mt-1">
                          {author.role}
                        </p>
                        <p className="text-[10px] text-slate-300 leading-relaxed mt-2.5 font-medium border-t border-slate-800/80 pt-2 line-clamp-3">
                          {author.bio}
                        </p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Center Overlapping Floating Button */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <Link
                to="/authors"
                className="bg-slate-950/80 backdrop-blur-md border border-slate-700/50 px-8 py-3.5 rounded-full text-[10px] font-bold tracking-widest text-white hover:text-primary hover:border-primary/50 hover:bg-slate-950 transition-all duration-300 shadow-2xl uppercase flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Khám phá tác giả</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </div>
          </>
        )}

      </div>

    </section>
  );
}
