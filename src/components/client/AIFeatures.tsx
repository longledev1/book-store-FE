import React from "react";
import {
  Search,
  ThumbsUp,
  FileText,
  Globe,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { BookConstellationCanvas } from "./BookConstellationCanvas";

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

const featuresList: FeatureItem[] = [
  {
    icon: Search,
    title: "Tìm kiếm theo ý niệm",
    desc: "Hiểu ý nghĩa, ngữ cảnh sâu sắc chứ không chỉ so khớp từ khóa thô sơ.",
  },
  {
    icon: ThumbsUp,
    title: "Tủ sách cá nhân hóa",
    desc: "Gợi ý chính xác theo sở thích, hành vi đọc và hồ sơ tích hợp của bạn.",
  },
  {
    icon: FileText,
    title: "Trích đoạn & Điểm nhấn thông minh",
    desc: "Tóm tắt và phân tích chương sách, giải thích nội dung thông minh.",
  },
  {
    icon: Globe,
    title: "Góc lan tỏa tri thức",
    desc: "Tối ưu hóa khám phá nội dung, liên kết sách theo sơ đồ tri thức.",
  },
];

export default function AIFeatures() {
  return (
    <section className="relative overflow-hidden border-b border-slate-900 bg-[#0B0F19] py-16 font-sans text-white md:py-24">
      {/* Self-contained CSS injection for cards cursor-pointer */}
      <style>{`
        .ai-feature-card {
          cursor: pointer !important;
        }
      `}</style>

      {/* Background neon glow effects */}
      <div className="bg-primary/10 pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-80 w-80 translate-x-1/2 translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Text & Features List */}
          <div className="space-y-8 text-left lg:col-span-7">
            <div className="space-y-4">
              <span className="text-primary block text-[10px] font-bold tracking-widest uppercase md:text-xs">
                Tính năng nâng cao
              </span>
              <h2 className="max-w-lg text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl">
                Khi công nghệ AI thấu hiểu gu đọc sách của bạn
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
                Không chỉ là một hiệu sách trực tuyến, hệ thống được tối ưu hóa
                bằng công nghệ hiện đại để mang lại hành trình tìm kiếm và trải
                nghiệm văn học cá nhân hóa nhất dành riêng cho bạn.
              </p>
            </div>

            {/* Feature 2x2 Grid */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 pt-2 sm:grid-cols-2">
              {featuresList.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="group ai-feature-card flex gap-4 rounded-2xl border border-slate-900 bg-slate-950/20 p-4 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/10 cursor-pointer"
                  >
                    {/* Icon container */}
                    <div className="text-primary group-hover:bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-900/30 bg-blue-950/40 transition-colors duration-300 group-hover:text-white">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    {/* Info */}
                    <div className="space-y-1">
                      <h4 className="group-hover:text-primary text-sm font-bold text-slate-100 transition-colors duration-200">
                        {item.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Canvas Visualizer */}
          <div className="relative lg:col-span-5">
            <div className="group relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-950/30 shadow-2xl backdrop-blur-md cursor-pointer">
              {/* The interactive constellation canvas */}
              <BookConstellationCanvas />

              {/* Brand Logo inside Canvas Box */}
              <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-xl border border-slate-800/40 bg-slate-950/40 px-3 py-1.5 backdrop-blur-sm select-none">
                <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-lg text-white shadow-sm">
                  <BookOpen className="h-3 w-3" />
                </div>
                <span className="text-[10px] font-extrabold tracking-tight text-white">
                  Lumina<span className="text-primary">Book</span>
                </span>
              </div>

              {/* Inner glowing hover overlay */}
              <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-tr to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
