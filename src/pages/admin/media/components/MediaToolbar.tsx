import React from "react";
import { Search, FolderOpen, ArrowRight } from "lucide-react";

interface MediaToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFolder: string;
  totalItems: number;
}

export default function MediaToolbar({
  searchQuery,
  onSearchChange,
  selectedFolder,
  totalItems,
}: MediaToolbarProps) {
  
  // Format folder path for breadcrumbs
  const getBreadcrumbs = () => {
    if (!selectedFolder) return ["Tất cả"];
    const parts = selectedFolder.split("/");
    return ["Tất cả", ...parts.map(p => {
      if (p === "general") return "General";
      if (p === "products") return "Products";
      if (p === "categories") return "Categories";
      if (p === "avatars") return "Avatars";
      if (p === "banners") return "Banners";
      if (p === "events") return "Events";
      return p.replace(/[-_]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    })];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="bg-white rounded-3xl border border-slate-200/50 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shrink-0">
      {/* Folder Path Breadcrumbs */}
      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
        <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />}
            <span
              className={`text-xs font-black truncate ${
                idx === breadcrumbs.length - 1 ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {crumb}
            </span>
          </React.Fragment>
        ))}
        <span className="text-[10px] text-slate-400 font-bold ml-1.5 select-none bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-lg">
          {totalItems} tệp tin
        </span>
      </div>

      {/* Search Bar Input */}
      <div className="relative w-full md:w-72 shrink-0">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm tệp theo tên..."
          className="focus:border-primary focus:ring-primary/5 w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-xs font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4"
        />
      </div>
    </div>
  );
}
