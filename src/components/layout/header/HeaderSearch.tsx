import React from "react";
import { Search, Sparkles } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";

export default function HeaderSearch() {
  const { setIsAISearchOpen } = useUIStore();

  return (
    <div className="mx-6 hidden max-w-xl flex-grow items-center justify-center gap-3 md:flex">
      <div className="relative w-full max-w-xs lg:max-w-sm">
        <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          className="focus:border-primary/50 focus:ring-primary/10 text-neutral-dark w-full rounded-full border border-slate-200/60 bg-slate-50 py-1.5 pr-4 pl-10 text-xs font-medium placeholder-slate-400 transition-all hover:bg-slate-100/50 focus:bg-white focus:ring-4 focus:outline-none"
        />
      </div>

      <button
        onClick={() => setIsAISearchOpen(true)}
        className="from-primary shadow-primary/20 hover:shadow-primary/30 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
      >
        <Sparkles className="h-3.5 w-3.5 animate-pulse text-white" />
        <span>Tìm sách với AI</span>
      </button>
    </div>
  );
}
