import React from "react";
import { Sparkles } from "lucide-react";

export default function CatalogBanner() {
  return (
    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px] bg-[url('/bright_book_banner.jpg')] bg-cover bg-center overflow-hidden flex items-center justify-center text-center">
      
      {/* Warm sunburst/orange gradient overlay to enhance text readability and match layout */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 via-amber-950/30 to-amber-950/65 pointer-events-none" />

      {/* Centered Typography Content */}
      <div className="relative z-10 max-w-3xl px-4 mx-auto space-y-4 md:space-y-5 flex flex-col items-center">
        
        {/* Glowing Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest select-none shadow-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Thư viện tri thức thông minh</span>
        </div>

        {/* Huge bold heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase drop-shadow-lg leading-tight select-none">
          Lumina <span className="text-amber-300">Book Day</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="text-xs sm:text-sm md:text-base text-amber-50/90 font-bold max-w-xl leading-relaxed drop-shadow-md px-2">
          Khám phá hàng ngàn đầu sách công nghệ, kinh doanh, nghệ thuật chọn lọc và nhận các gợi ý lộ trình đọc sách cá nhân hóa từ Trí tuệ nhân tạo (AI).
        </p>

        {/* Optional decorative indicator */}
        <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full shadow-sm pt-0.5" />

      </div>

    </div>
  );
}
