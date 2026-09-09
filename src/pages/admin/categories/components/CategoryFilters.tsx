import React from "react";
import { Search } from "lucide-react";

interface CategoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  isVerified: string;
  onIsVerifiedChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
}

export default function CategoryFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  isVerified,
  onIsVerifiedChange,
  sortOption,
  onSortChange,
}: CategoryFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm danh mục..."
            className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200/60 bg-slate-50 py-2 pr-4 pl-9 text-xs font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-44">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="focus:border-primary focus:ring-primary/5 w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Hoạt động</option>
            <option value="0">Không hoạt động</option>
          </select>
        </div>

        {/* Verification Filter */}
        <div className="w-full sm:w-44">
          <select
            value={isVerified}
            onChange={(e) => onIsVerifiedChange(e.target.value)}
            className="focus:border-primary focus:ring-primary/5 w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
          >
            <option value="">Tất cả xác minh</option>
            <option value="true">Đã xác minh</option>
            <option value="false">Chưa xác minh</option>
          </select>
        </div>

        {/* Sort Option */}
        <div className="w-full sm:w-44">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="focus:border-primary focus:ring-primary/5 w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
          >
            <option value="">Mặc định</option>
            <option value="createdAt_DESC">Mới nhất</option>
            <option value="createdAt_ASC">Cũ nhất</option>
            <option value="name_ASC">Tên A → Z</option>
            <option value="name_DESC">Tên Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
