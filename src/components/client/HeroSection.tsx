import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Network, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUIStore } from "../../store/useUIStore";

export default function HeroSection() {
  const { introFinished, setIsAISearchOpen } = useUIStore();

  // Animation configuration constants
  const faderUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: customDelay,
        ease: [0.16, 1, 0.3, 1], // Custom easeOutExpo curve for sleek feel
      },
    }),
  };

  const springIn = {
    hidden: { opacity: 0, scale: 0.96, x: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 18,
        delay: 0.2,
      },
    },
  };

  const popBadge = (delay: number) => ({
    hidden: { opacity: 0, scale: 0.8, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12,
        delay: delay,
      },
    },
  });

  return (
    <section className="border-border-light relative w-full overflow-hidden border-b bg-gradient-to-br from-white via-blue-50/15 to-indigo-50/15 py-16 font-sans md:py-24">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-4 md:px-8 lg:grid-cols-12 lg:gap-16">
        {/* Left Side: Content & Statistics */}
        <div className="space-y-8 text-left lg:col-span-7">
          {/* Title */}
          <motion.h1
            initial="hidden"
            animate={introFinished ? "visible" : "hidden"}
            custom={0}
            variants={faderUp}
            className="text-neutral-dark text-4xl leading-[1.12] font-extrabold tracking-tight md:text-5xl lg:text-6xl"
          >
            Gõ điều bạn nghĩ <br />
            <span className="text-primary">Tìm đúng sách bạn cần</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial="hidden"
            animate={introFinished ? "visible" : "hidden"}
            custom={0.15}
            variants={faderUp}
            className="max-w-xl text-sm leading-relaxed text-slate-500 md:text-base"
          >
            Trải nghiệm công nghệ tìm kiếm ngữ nghĩa đột phá bằng trí tuệ nhân
            tạo. Thay vì nhập đúng tiêu đề, bạn chỉ cần mô tả nội dung, cốt
            truyện, hoặc cảm xúc mà bạn muốn tìm – hệ thống AI của LuminaBook sẽ
            phân tích vector và đưa ra gợi ý chính xác nhất.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial="hidden"
            animate={introFinished ? "visible" : "hidden"}
            custom={0.3}
            variants={faderUp}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/books"
              className="group flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg"
            >
              <span>Khám phá ngay</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <button 
              onClick={() => setIsAISearchOpen(true)}
              className="text-primary flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
            >
              <Sparkles className="text-primary h-4.5 w-4.5" />
              <span>Tìm sách bằng AI</span>
            </button>
          </motion.div>
        </div>

        {/* Right Side: Mockup Image & Badges */}
        <div className="relative mt-8 flex justify-center lg:col-span-5 lg:mt-0 lg:justify-end">
          {/* Main Card Container */}
          <motion.div
            initial="hidden"
            animate={introFinished ? "visible" : "hidden"}
            variants={springIn}
            className="relative w-full max-w-[400px] rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl shadow-slate-200/80 transition-transform duration-300 hover:scale-[1.01] md:max-w-[440px]"
          >
            {/* Image Box */}
            <div className="relative aspect-[4/4] overflow-hidden rounded-2xl border border-slate-100/50 bg-slate-50">
              <img
                src="/hero_ai_bookstore.png"
                alt="LuminaBook AI Semantic Search Illustration"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Badge 1: Smart Vector Match (Top Right overlay) */}
            <motion.div
              initial="hidden"
              animate={introFinished ? "visible" : "hidden"}
              variants={popBadge(0.7)}
              className="bg-primary absolute -top-3 -right-3 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[10px] font-bold text-white shadow-lg select-none"
            >
              <Network className="h-3.5 w-3.5 animate-pulse" />
              <span>Smart Vector Match</span>
            </motion.div>

            {/* Badge 2: AI Recommendation (Bottom Left overlay) */}
            <motion.div
              initial="hidden"
              animate={introFinished ? "visible" : "hidden"}
              variants={popBadge(0.95)}
              className="border-slate-150 absolute -bottom-4 -left-4 flex max-w-[210px] items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-xl select-none"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-500">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] leading-none font-bold tracking-wider text-slate-400 uppercase">
                  AI Recommendation
                </span>
                <span className="text-neutral-dark mt-1.5 text-xs font-bold">
                  Độ chính xác 98%
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
