import React from "react";
import { Search } from "lucide-react";

interface AuthorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function AuthorFilters({
  searchTerm,
  onSearchChange,
}: AuthorFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm tác giả..."
          className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200/60 bg-slate-50 py-2 pr-4 pl-9 text-xs font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4"
        />
      </div>
    </div>
  );
}
