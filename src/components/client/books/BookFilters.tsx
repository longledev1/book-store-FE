import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useDebounce } from "../../../hooks/useDebounce";

interface BookFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceFilter: string;
  setPriceFilter: (filter: string) => void;
  authorFilter: string;
  setAuthorFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  availableAuthors: string[];
}

export default function BookFilters({
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  authorFilter,
  setAuthorFilter,
  sortBy,
  setSortBy,
  availableAuthors,
}: BookFiltersProps) {
  // Local state for immediate typing feedback
  const [inputValue, setInputValue] = useState<string>(searchQuery);
  const debouncedSearchQuery = useDebounce<string>(inputValue, 300);

  // Sync debounced query back to parent
  useEffect(() => {
    setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setSearchQuery]);

  // Sync local input value when parent resets searchQuery (e.g. category switch)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const ADMIN_API_URL = {
    development: "http://localhost:8080/api",
    production: "https://bookstore-backend-production.up.railway.app/api",
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 rounded-3xl border border-slate-200/50 bg-white p-4 text-left shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {/* Search keyword */}
      <div className="flex flex-col gap-1">
        <span className="text-primary pl-1 text-[10px] font-extrabold tracking-wider uppercase select-none">
          Tìm tên sách:
        </span>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tìm tên..."
            className="placeholder-slate-405 focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200/60 bg-slate-50 py-1.5 pr-3 pl-9 text-xs font-bold text-slate-700 shadow-sm transition-all outline-none focus:bg-white focus:ring-4"
          />
        </div>
      </div>

      {/* Author Select dropdown */}
      <div className="flex flex-col gap-1">
        <span className="text-primary pl-1 text-[10px] font-extrabold tracking-wider uppercase select-none">
          Tác giả:
        </span>
        <div className="relative">
          <select
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
            className="text-slate-750 focus:border-primary focus:ring-primary/5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-bold shadow-sm transition-all outline-none focus:ring-4"
          >
            <option value="all">Tất cả tác giả</option>
            {availableAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Price filter dropdown */}
      <div className="flex flex-col gap-1">
        <span className="text-primary pl-1 text-[10px] font-extrabold tracking-wider uppercase select-none">
          Khoảng giá:
        </span>
        <div className="relative">
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="text-slate-750 focus:border-primary focus:ring-primary/5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-bold shadow-sm transition-all outline-none focus:ring-4"
          >
            <option value="all">Tất cả giá</option>
            <option value="under-150">Dưới 150.000đ</option>
            <option value="150-300">150k - 300k</option>
            <option value="above-300">Trên 300.000đ</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Sorting dropdown */}
      <div className="flex flex-col gap-1">
        <span className="text-primary pl-1 text-[10px] font-extrabold tracking-wider uppercase select-none">
          Sắp xếp:
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-slate-750 focus:border-primary focus:ring-primary/5 w-full cursor-pointer appearance-none rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 pr-8 text-xs font-bold shadow-sm transition-all outline-none focus:ring-4"
          >
            <option value="latest">Mới nhất</option>
            <option value="best-seller">Bán chạy</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
    </div>
  );
}
