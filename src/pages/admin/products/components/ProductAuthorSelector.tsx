import React from "react";
import { ChevronDown, X } from "lucide-react";
import { type Author } from "../../../../services/author.service";

interface ProductAuthorSelectorProps {
  selectedAuthors: Author[];
  setSelectedAuthors: React.Dispatch<React.SetStateAction<Author[]>>;
  authorSearch: string;
  setAuthorSearch: (val: string) => void;
  searchResults: Author[];
  isSearching: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (val: boolean) => void;
}

export default function ProductAuthorSelector({
  selectedAuthors,
  setSelectedAuthors,
  authorSearch,
  setAuthorSearch,
  searchResults,
  isSearching,
  isDropdownOpen,
  setIsDropdownOpen,
}: ProductAuthorSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1 select-none">
        Tác giả liên kết
      </label>
      
      {/* Select Trigger & Dropdown container */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center justify-between w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none hover:bg-slate-100 transition-all cursor-pointer select-none"
        >
          <span className="truncate pr-4 text-slate-600">
            {selectedAuthors.length === 0
              ? "Chọn tác giả..."
              : selectedAuthors.map((sa) => sa.name).join(", ")}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown panel */}
        {isDropdownOpen && (
          <>
            {/* Invisible overlay to catch clicks outside dropdown */}
            <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
            
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 p-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Search box inside dropdown */}
              <input
                type="text"
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                placeholder="🔍 Gõ tìm kiếm tác giả..."
                className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                autoFocus
              />

              {/* Scrollable list of authors */}
              <div className="max-h-40 overflow-y-auto space-y-0.5 scrollbar-thin">
                {isSearching ? (
                  <div className="text-[11px] text-slate-400 font-bold p-2 italic select-none">
                    Đang tải tác giả...
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-[11px] text-slate-400 font-bold p-2 italic select-none">
                    Không tìm thấy tác giả nào.
                  </div>
                ) : (
                  searchResults.map((auth) => {
                    const isAlreadySelected = selectedAuthors.some(sa => sa.id === auth.id);
                    return (
                      <div
                        key={auth.id}
                        onClick={() => {
                          if (isAlreadySelected) {
                            setSelectedAuthors(prev => prev.filter(sa => sa.id !== auth.id));
                          } else {
                            setSelectedAuthors(prev => [...prev, auth]);
                          }
                        }}
                        className={`flex items-center justify-between text-xs font-semibold p-2 rounded-lg cursor-pointer transition-colors ${
                          isAlreadySelected
                            ? "bg-blue-50/50 text-blue-700 hover:bg-blue-50/80"
                            : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>{auth.name}</span>
                        {isAlreadySelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1"></span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tag/Chip List of Selected Authors */}
      {selectedAuthors.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200/60 rounded-xl max-h-24 overflow-y-auto">
          {selectedAuthors.map((auth) => (
            <span
              key={auth.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-xs font-bold transition-all shadow-sm select-none animate-in fade-in zoom-in-95 duration-150"
            >
              <span>{auth.name}</span>
              <button
                type="button"
                onClick={() => setSelectedAuthors(prev => prev.filter(sa => sa.id !== auth.id))}
                className="hover:bg-blue-100 text-blue-500 hover:text-blue-700 rounded-full p-0.5 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
