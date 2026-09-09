import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ProductCategorySelectorProps {
  categoryTree: any[];
  expandedParents: Record<string, boolean>;
  setExpandedParents: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ProductCategorySelector({
  categoryTree,
  expandedParents,
  setExpandedParents,
  selectedCategories,
  setSelectedCategories,
}: ProductCategorySelectorProps) {
  const toggleExpand = (id: string) => {
    setExpandedParents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCategoryNode = (node: any) => {
    const isParent = node.children && node.children.length > 0;
    const isExpanded = !!expandedParents[node.id];

    if (isParent) {
      return (
        <div key={node.id} className="space-y-1 pl-2">
          <div 
            onClick={() => toggleExpand(node.id)}
            className="flex items-center gap-1.5 py-1 px-1.5 hover:bg-slate-100/70 rounded-lg cursor-pointer text-xs font-bold text-slate-700 select-none"
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            <span>{node.name}</span>
          </div>
          {isExpanded && (
            <div className="pl-4 border-l border-slate-100 space-y-1 ml-2">
              {node.children.map((child: any) => renderCategoryNode(child))}
            </div>
          )}
        </div>
      );
    }

    const isChecked = selectedCategories.includes(node.id);
    return (
      <label key={node.id} className="flex items-center gap-2 py-1 px-1.5 hover:bg-slate-150 rounded-lg cursor-pointer text-xs font-semibold text-slate-650 pl-6 select-none">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            setSelectedCategories(prev =>
              isChecked ? prev.filter(id => id !== node.id) : [...prev, node.id]
            );
          }}
          className="rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer w-3.5 h-3.5"
        />
        <span>{node.name}</span>
      </label>
    );
  };

  const visibleCategoryTree = Array.isArray(categoryTree)
    ? categoryTree.filter((node) => node.children && node.children.length > 0)
    : [];

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1 select-none">
        Danh mục liên kết (Chỉ được chọn danh mục con)
      </label>
      <div className="border border-slate-200/60 bg-slate-50 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
        {visibleCategoryTree.length === 0 ? (
          <span className="text-[11px] text-slate-400 font-bold italic">Không có danh mục nào</span>
        ) : (
          visibleCategoryTree.map((node) => renderCategoryNode(node))
        )}
      </div>
    </div>
  );
}
