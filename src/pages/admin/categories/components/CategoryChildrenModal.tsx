import React, { useState, useEffect, useMemo } from "react";
import { X, Edit3, Trash2 } from "lucide-react";
import { type Category } from "../../../../services/category.service";
import CategoryChildrenFilters from "./CategoryChildrenFilters";

interface CategoryChildrenModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory: Category | null;
  childrenCategories: any[];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  isVerified: string;
  onIsVerifiedChange: (value: string) => void;
  sortOption: string;
  onSortChange: (value: string) => void;
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
}

export default function CategoryChildrenModal({
  isOpen,
  onClose,
  parentCategory,
  childrenCategories,
  isLoading,
  searchTerm,
  onSearchChange,
  status,
  onStatusChange,
  isVerified,
  onIsVerifiedChange,
  sortOption,
  onSortChange,
  onEdit,
  onDelete,
}: CategoryChildrenModalProps) {
  // Client-side filter and sort logic on childrenCategories based on props
  const filteredAndSortedChildren = useMemo(() => {
    let result = [...childrenCategories];

    // 1. Search filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (sub) =>
          sub.name?.toLowerCase().includes(query) ||
          sub.slug?.toLowerCase().includes(query)
      );
    }

    // 2. Status filter
    if (status !== "") {
      result = result.filter((sub) => {
        const rawStatus = sub.status;
        const isVisible =
          rawStatus === 1 ||
          rawStatus === "1" ||
          rawStatus === true ||
          (typeof rawStatus === "string" &&
            (rawStatus.toLowerCase() === "active" ||
              rawStatus.toLowerCase() === "hoat_dong" ||
              rawStatus.toLowerCase() === "visible"));

        return status === "1" ? isVisible : !isVisible;
      });
    }

    // 3. Verification filter
    if (isVerified !== "") {
      const targetVerified = isVerified === "true";
      result = result.filter((sub) => sub.isVerified === targetVerified);
    }

    // 4. Sort option
    if (sortOption === "createdAt_DESC") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === "createdAt_ASC") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOption === "name_ASC") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortOption === "name_DESC") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }

    return result;
  }, [childrenCategories, searchTerm, status, isVerified, sortOption]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-[2px] select-none">
      <div className="animate-in fade-in zoom-in-95 relative min-h-[85vh] max-h-[92vh] w-full max-w-7xl flex flex-col rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-2xl duration-200 sm:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-black tracking-tight text-slate-800 uppercase sm:text-lg">
              Danh mục con
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-slate-400">
              Danh mục cấp dưới của:{" "}
              <span className="text-primary font-bold">
                {parentCategory?.name}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col min-h-0 space-y-4 mb-4">
          {/* Modal local filters */}
          <CategoryChildrenFilters
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            status={status}
            onStatusChange={onStatusChange}
            isVerified={isVerified}
            onIsVerifiedChange={onIsVerifiedChange}
            sortOption={sortOption}
            onSortChange={onSortChange}
          />

          {isLoading ? (
            // Spinner
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
              <span className="mt-3 text-xs font-bold text-slate-400">
                Đang tải danh mục con...
              </span>
            </div>
          ) : filteredAndSortedChildren.length === 0 ? (
            // Empty message
            <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
              <span className="text-xs font-bold text-slate-400">
                {childrenCategories.length === 0
                  ? "Danh mục này chưa có danh mục con."
                  : "Không tìm thấy danh mục con phù hợp với điều kiện lọc."}
              </span>
            </div>
          ) : (
            // Table of children categories
            <div className="overflow-y-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 whitespace-nowrap">
                    <th className="px-6 py-3.5">Danh mục</th>
                    <th className="px-6 py-3.5">Slug</th>
                    <th className="px-6 py-3.5 text-center">Hiển thị</th>
                    <th className="px-6 py-3.5 text-center">Duyệt</th>
                    <th className="w-28 px-6 py-3.5 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {filteredAndSortedChildren.map((sub: any) => {
                    const rawStatus = sub.status;
                    const isVisible =
                      rawStatus === 1 ||
                      rawStatus === "1" ||
                      rawStatus === true ||
                      (typeof rawStatus === "string" &&
                        (rawStatus.toLowerCase() === "active" ||
                          rawStatus.toLowerCase() === "hoat_dong" ||
                          rawStatus.toLowerCase() === "visible"));

                    return (
                      <tr
                        key={sub.id}
                        className="transition-colors hover:bg-slate-50/40"
                      >
                        {/* Name */}
                        <td className="px-6 py-3.5 font-extrabold text-slate-800">
                          {sub.name}
                        </td>

                        {/* Slug */}
                        <td className="px-6 py-3.5 font-mono text-[11px] font-bold text-slate-400">
                          {sub.slug}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-3.5 text-center">
                          {isVisible ? (
                            <span className="inline-flex items-center rounded-lg border border-green-100 bg-green-50 px-2.5 py-0.5 text-xs font-extrabold text-green-700">
                              Hiển thị
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-extrabold text-slate-500">
                              Đang ẩn
                            </span>
                          )}
                        </td>

                        {/* Verified */}
                        <td className="px-6 py-3.5 text-center">
                          {sub.isVerified ? (
                            <span className="text-blue-650 inline-flex items-center rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-extrabold">
                              Đã duyệt
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-xs font-extrabold text-amber-700">
                              Chưa duyệt
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onEdit?.(sub)}
                              className="hover:text-primary cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete?.(sub)}
                              className="cursor-pointer rounded-lg p-1 text-slate-450 transition-colors hover:bg-rose-50 hover:text-rose-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer close button */}
        <div className="flex justify-end border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
