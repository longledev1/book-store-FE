import React, { useEffect, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { getCategoryTreeAPI } from "../../../../services/category.service";
import { getAuthorsAPI, type Author } from "../../../../services/author.service";

interface ChildCategoryOption {
  id: string;
  name: string;
  parentName?: string;
}

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  isVerified: string;
  onIsVerifiedChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  authorId: string;
  onAuthorChange: (value: string) => void;
}

// Helper to extract ONLY child/leaf categories from category tree
const extractChildCategories = (nodes: any[]): ChildCategoryOption[] => {
  const result: ChildCategoryOption[] = [];
  const traverse = (items: any[], parentName?: string) => {
    if (!Array.isArray(items)) return;
    items.forEach((item) => {
      const isParent = item.children && item.children.length > 0;
      if (isParent) {
        traverse(item.children, item.name);
      } else {
        result.push({
          id: item.id,
          name: item.name,
          parentName: parentName || item.parent?.name,
        });
      }
    });
  };
  traverse(nodes);
  return result;
};

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  isVerified,
  onIsVerifiedChange,
  sortOption,
  onSortChange,
  categoryId,
  onCategoryChange,
  authorId,
  onAuthorChange,
}: ProductFiltersProps) {
  // Category dropdown state
  const [childCategories, setChildCategories] = useState<ChildCategoryOption[]>([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  // Author dropdown state
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);
  const [authorSearch, setAuthorSearch] = useState("");

  // Fetch category tree and authors on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const treeRes = await getCategoryTreeAPI();
        const treeList = treeRes?.data?.tree || treeRes?.data || (Array.isArray(treeRes) ? treeRes : []);
        const childrenOnly = extractChildCategories(treeList);
        setChildCategories(childrenOnly);
      } catch (e) {
        console.error("Lỗi khi tải danh mục cho bộ lọc:", e);
      }
    };

    const loadAuthors = async () => {
      try {
        const authorRes = await getAuthorsAPI(1, 100);
        setAuthors(authorRes.data || []);
      } catch (e) {
        console.error("Lỗi khi tải tác giả cho bộ lọc:", e);
      }
    };

    loadCategories();
    loadAuthors();
  }, []);

  // Filter child categories by search query
  const filteredChildCategories = childCategories.filter((cat) => {
    const query = categorySearch.toLowerCase().trim();
    if (!query) return true;
    return (
      cat.name.toLowerCase().includes(query) ||
      (cat.parentName && cat.parentName.toLowerCase().includes(query))
    );
  });

  // Filter authors by search query
  const filteredAuthors = authors.filter((auth) => {
    const query = authorSearch.toLowerCase().trim();
    if (!query) return true;
    return auth.name.toLowerCase().includes(query);
  });

  const selectedCategoryObj = childCategories.find((c) => c.id === categoryId);
  const selectedAuthorObj = authors.find((a) => a.id === authorId);

  return (
    <div className="rounded-2xl border border-slate-200/50 bg-white p-4 shadow-sm select-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap items-center">
        
        {/* 1. Search Input */}
        <div className="relative flex-1 min-w-[200px] w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200/60 bg-slate-50 py-2 pr-4 pl-9 text-xs font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4"
          />
        </div>

        {/* 2. Category Filter (Child Categories Only) */}
        <div className="relative w-full sm:w-44">
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsAuthorOpen(false);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-all hover:bg-slate-100/80 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5"
          >
            <span className="truncate pr-2 text-slate-700 font-semibold">
              {selectedCategoryObj ? selectedCategoryObj.name : "Tất cả danh mục"}
            </span>
            {categoryId ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onCategoryChange("");
                }}
                className="hover:bg-slate-200 rounded-full p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                title="Xóa lọc danh mục"
              >
                <X className="h-3.5 w-3.5 shrink-0" />
              </span>
            ) : (
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
            )}
          </button>

          {/* Category Dropdown Popover */}
          {isCategoryOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
              <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Tìm danh mục con..."
                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50 py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                    autoFocus
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
                  <div
                    onClick={() => {
                      onCategoryChange("");
                      setIsCategoryOpen(false);
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs font-semibold transition-colors ${
                      !categoryId ? "bg-blue-50/70 font-bold text-primary" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>Tất cả danh mục</span>
                  </div>

                  {filteredChildCategories.length === 0 ? (
                    <div className="p-2 text-center text-[11px] font-bold italic text-slate-400">
                      Không tìm thấy danh mục con nào.
                    </div>
                  ) : (
                    filteredChildCategories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          onCategoryChange(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs font-semibold transition-colors ${
                          categoryId === cat.id ? "bg-blue-50/70 font-bold text-primary" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex flex-col truncate">
                          <span>{cat.name}</span>
                          {cat.parentName && (
                            <span className="text-[10px] text-slate-400 font-medium truncate">({cat.parentName})</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 3. Author Filter */}
        <div className="relative w-full sm:w-44">
          <button
            type="button"
            onClick={() => {
              setIsAuthorOpen(!isAuthorOpen);
              setIsCategoryOpen(false);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition-all hover:bg-slate-100/80 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5"
          >
            <span className="truncate pr-2 text-slate-700 font-semibold">
              {selectedAuthorObj ? selectedAuthorObj.name : "Tất cả tác giả"}
            </span>
            {authorId ? (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onAuthorChange("");
                }}
                className="hover:bg-slate-200 rounded-full p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                title="Xóa lọc tác giả"
              >
                <X className="h-3.5 w-3.5 shrink-0" />
              </span>
            ) : (
              <ChevronDown className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${isAuthorOpen ? "rotate-180" : ""}`} />
            )}
          </button>

          {/* Author Dropdown Popover */}
          {isAuthorOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsAuthorOpen(false)} />
              <div className="absolute top-full left-0 z-20 mt-1 w-64 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={authorSearch}
                    onChange={(e) => setAuthorSearch(e.target.value)}
                    placeholder="Tìm tác giả..."
                    className="w-full rounded-xl border border-slate-200/80 bg-slate-50 py-1.5 pr-3 pl-8 text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all"
                    autoFocus
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 scrollbar-thin">
                  <div
                    onClick={() => {
                      onAuthorChange("");
                      setIsAuthorOpen(false);
                    }}
                    className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs font-semibold transition-colors ${
                      !authorId ? "bg-blue-50/70 font-bold text-primary" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>Tất cả tác giả</span>
                  </div>

                  {filteredAuthors.length === 0 ? (
                    <div className="p-2 text-center text-[11px] font-bold italic text-slate-400">
                      Không tìm thấy tác giả nào.
                    </div>
                  ) : (
                    filteredAuthors.map((auth) => (
                      <div
                        key={auth.id}
                        onClick={() => {
                          onAuthorChange(auth.id);
                          setIsAuthorOpen(false);
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-lg p-2 text-xs font-semibold transition-colors ${
                          authorId === auth.id ? "bg-blue-50/70 font-bold text-primary" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{auth.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 4. Status Filter */}
        <div className="w-full sm:w-40">
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

        {/* 5. Verification Filter */}
        <div className="w-full sm:w-40">
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

        {/* 6. Sort Option */}
        <div className="w-full sm:w-40">
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value)}
            className="focus:border-primary focus:ring-primary/5 w-full cursor-pointer rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-all outline-none focus:bg-white focus:ring-4"
          >
            <option value="">Mặc định</option>
            <option value="createdAt_DESC">Mới nhất</option>
            <option value="createdAt_ASC">Cũ nhất</option>
            <option value="price_ASC">Giá: Thấp → Cao</option>
            <option value="price_DESC">Giá: Cao → Thấp</option>
            <option value="name_ASC">Tên: A → Z</option>
            <option value="name_DESC">Tên: Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
}
