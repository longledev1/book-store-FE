import React from "react";
import { Search } from "lucide-react";

interface CategoryChildrenFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  isVerified: string;
  onIsVerifiedChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
}

export default function CategoryChildrenFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  isVerified,
  onIsVerifiedChange,
  sortOption,
  onSortChange,
}: CategoryChildrenFiltersProps) {
  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm danh mục con..."
            className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200/60 bg-slate-50 py-1.5 pr-4 pl-9 text-xs font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4"
          />
        </div>

        {/* Filters and Sort Wrapper */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="w-[calc(50%-4px)] sm:w-auto sm:flex-1 md:w-36">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="focus:border-primary focus:ring-primary/5 w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="w-[calc(50%-4px)] sm:w-auto sm:flex-1 md:w-36">
            <select
              value={isVerified}
              onChange={(e) => onIsVerifiedChange(e.target.value)}
              className="focus:border-primary focus:ring-primary/5 w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
            >
              <option value="">Tất cả xác minh</option>
              <option value="true">Đã xác minh</option>
              <option value="false">Chưa xác minh</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="w-full sm:w-auto sm:flex-1 md:w-36">
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
              className="focus:border-primary focus:ring-primary/5 w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
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
    </div>
  );
}
