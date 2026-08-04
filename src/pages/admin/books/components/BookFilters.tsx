import React from "react";
import { Search, Filter } from "lucide-react";
import { categoriesData } from "../../../../constants/categoriesData";

interface BookFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
}

export default function BookFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange
}: BookFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
      
      {/* Search Input */}
      <div className="sm:col-span-2 relative">
        <Search className="absolute top-1/2 left-3 w-4 h-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm tên sách hoặc tác giả..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder-slate-400"
        />
      </div>

      {/* Category Filter */}
      <div className="relative">
        <Filter className="absolute top-1/2 left-3 w-4 h-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full appearance-none pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-700 outline-none cursor-pointer focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
        >
          <option value="all">Tất cả danh mục</option>
          {categoriesData.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

    </div>
  );
}
