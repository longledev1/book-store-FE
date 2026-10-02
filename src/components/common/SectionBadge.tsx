import React from "react";
import { Sparkles } from "lucide-react";

interface SectionBadgeProps {
  title: string;
}

export default function SectionBadge({ title }: SectionBadgeProps) {
  return (
    <h2 className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white border border-white/10 rounded-2xl text-xs md:text-sm font-extrabold uppercase tracking-wider shadow-lg shadow-primary/25 select-none hover:scale-[1.02] transition-all duration-300 cursor-default">
      <Sparkles className="w-4 h-4 text-white shrink-0 animate-pulse" />
      <span>{title}</span>
    </h2>
  );
}
