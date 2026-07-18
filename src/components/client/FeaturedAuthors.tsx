import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import SectionBadge from "./SectionBadge";

// Swiper core styles
import "swiper/css";

interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

const mockAuthorsRow1: Author[] = [
  {
    id: "1",
    name: "Alex Rivers",
    role: "Chuyên gia Kinh tế số",
    bio: "Hơn 15 năm nghiên cứu chiến lược số hóa doanh nghiệp toàn cầu.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "Kỹ sư Trí tuệ nhân tạo (AI)",
    bio: "Chuyên gia NLP và học máy tại Silicon Valley, tác giả sách AI bán chạy.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "3",
    name: "Dr. James Miller",
    role: "Chuyên gia Tâm lý học hành vi",
    bio: "Tiến sĩ tâm lý học nhận thức, chuyên nghiên cứu về hành vi kết nối xã hội.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "4",
    name: "Maya Lee",
    role: "Nhà thiết kế Sáng tạo",
    bio: "Giám đốc nghệ thuật, truyền cảm hứng tư duy thiết kế đột phá.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "5",
    name: "Yuval Noah Harari",
    role: "Nhà Sử học & Triết gia",
    bio: "Giáo sư Lịch sử thế giới, tác giả các tác phẩm lược sử nhân loại vĩ đại.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "6",
    name: "Dale Carnegie",
    role: "Bậc thầy Thuật Đắc Nhân Tâm",
    bio: "Huyền thoại phát triển bản thân và nghệ thuật giao tiếp thuyết phục.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=350"
  }
];

const mockAuthorsRow2: Author[] = [
  {
    id: "7",
    name: "Stephen Hawking",
    role: "Nhà Vật lý Lý thuyết Vũ trụ",
    bio: "Thiên tài vật lý hiện đại, mở lối khám phá hố đen và vũ trụ học.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "8",
    name: "Robert Kiyosaki",
    role: "Tác giả Tài chính Cá nhân",
    bio: "Nhà đầu tư lỗi lạc, truyền bá tư duy độc lập tài chính Cha Giàu Cha Nghèo.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "9",
    name: "Eran Katz",
    role: "Kỷ lục gia Trí nhớ Thế giới",
    bio: "Tác giả phương pháp rèn luyện trí não, mở khóa giới hạn ghi nhớ.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "10",
    name: "Paulo Coelho",
    role: "Tiểu thuyết gia lừng danh",
    bio: "Tác giả Nhà Giả Kim - tác phẩm dịch ra nhiều ngôn ngữ nhất hành tinh.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "11",
    name: "Eric Ries",
    role: "Cha đẻ Khởi nghiệp Tinh gọn",
    bio: "Nhà tiên phong phương pháp phát triển sản phẩm đột phá cho startup.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=350"
  },
  {
    id: "12",
    name: "Richard Thaler",
    role: "Giải Nobel Kinh tế học",
    bio: "Nhà kinh tế học hành vi tiên phong nghiên cứu tâm lý học quyết định tài chính.",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=350"
  }
];

export default function FeaturedAuthors() {
  // Duplicate arrays to ensure Swiper has enough slides to perform continuous linear infinite scrolling loop
  const duplicatedRow1 = [...mockAuthorsRow1, ...mockAuthorsRow1, ...mockAuthorsRow1];
  const duplicatedRow2 = [...mockAuthorsRow2, ...mockAuthorsRow2, ...mockAuthorsRow2];

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
              disableOnInteraction: false
            }}
            breakpoints={{
              480: { slidesPerView: 2.5 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1400: { slidesPerView: 6 }
            }}
            className="authors-marquee-swiper !overflow-visible"
          >
            {duplicatedRow1.map((author, index) => (
              <SwiperSlide key={`${author.id}-row1-${index}`}>
                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer">
                  {/* Background author picture */}
                  <img
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
                </div>
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
              reverseDirection: true // Slides right!
            }}
            breakpoints={{
              480: { slidesPerView: 2.5 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1400: { slidesPerView: 6 }
            }}
            className="authors-marquee-swiper !overflow-visible"
          >
            {duplicatedRow2.map((author, index) => (
              <SwiperSlide key={`${author.id}-row2-${index}`}>
                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer">
                  {/* Background author picture */}
                  <img
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
                </div>
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

      </div>

    </section>
  );
}
