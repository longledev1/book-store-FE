import React from "react";
import { ChevronDown } from "lucide-react";
import { categoriesData } from "../../../constants/categoriesData";

interface SidebarCategoriesProps {
  activeCategory: string;
  activeSubcategory: string;
  hoveredCategoryId: string | null;
  setHoveredCategoryId: (id: string | null) => void;
  onParentSelect: (id: string) => void;
  onSubcatSelect: (id: string, e: React.MouseEvent) => void;
}

export default function SidebarCategories({
  activeCategory,
  activeSubcategory,
  hoveredCategoryId,
  setHoveredCategoryId,
  onParentSelect,
  onSubcatSelect,
}: SidebarCategoriesProps) {
  return (
    <aside className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm text-left">
      <h4 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-5 select-none">
        Danh mục sản phẩm
      </h4>
      
      <nav className="flex flex-col gap-2">
        {categoriesData.map((cat) => {
          const isActive = activeCategory === cat.id;
          const isHovered = hoveredCategoryId === cat.id;
          const isExpanded = isActive || isHovered;

          return (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredCategoryId(cat.id)}
              onMouseLeave={() => setHoveredCategoryId(null)}
              className="flex flex-col rounded-2xl transition-all"
            >
              {/* Parent Category Button */}
              <button
                onClick={() => onParentSelect(cat.id)}
                className={`group flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-left text-xs md:text-sm font-bold transition-all ${
                  isActive
                    ? "text-primary border-slate-200/60 border bg-slate-50/20 shadow-sm"
                    : "text-slate-655 border border-transparent hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{cat.name}</span>
                <div className="flex items-center gap-1.5">
                  {isActive && (
                    <div className="bg-primary h-2 w-2 rounded-sm" />
                  )}
                  {cat.categories.length > 0 && (
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  )}
                </div>
              </button>

              {/* Subcategories Level 2 Dropdown (Animated Accordion height) */}
              {cat.categories.length > 0 && (
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isExpanded ? "max-h-60 mt-1 pb-2 pl-4" : "max-h-0"
                  }`}
                >
                  <div className="flex flex-col gap-1 border-l border-slate-100 pl-3 pt-1">
                    {/* Option to show all inside parent */}
                    <button
                      onClick={() => onParentSelect(cat.id)}
                      className={`py-1.5 text-left text-xs font-semibold cursor-pointer transition-colors block ${
                        isActive && activeSubcategory === "all"
                          ? "text-primary font-bold"
                          : "text-slate-450 hover:text-slate-800"
                      }`}
                    >
                      Tất cả {cat.name}
                    </button>
                    
                    {/* Loop subcategories */}
                    {cat.categories.map((subcat) => (
                      <button
                        key={subcat.id}
                        onClick={(e) => onSubcatSelect(subcat.id, e)}
                        className={`py-1.5 text-left text-xs font-semibold cursor-pointer transition-colors block ${
                          activeSubcategory === subcat.id
                            ? "text-primary font-bold"
                            : "text-slate-450 hover:text-slate-800"
                        }`}
                      >
                        {subcat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
