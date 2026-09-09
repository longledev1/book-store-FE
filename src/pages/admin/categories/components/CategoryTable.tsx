import React from "react";
import { Edit3, Trash2, ListTree } from "lucide-react";
import { type Category } from "../../../../services/category.service";
import Pagination from "../../../../components/ui/Pagination";

interface CategoryTableProps {
  categories: Category[];
  treeData?: any[];
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onViewChildren?: (category: Category) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CategoryTable({
  categories,
  treeData = [],
  onEdit,
  onDelete,
  onViewChildren,
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
}: CategoryTableProps) {
  // Filter only parent categories (parentId === null) for the main table rows
  const parentCategories = categories.filter((cat) => cat.parentId === null);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Table Headers */}
          <thead>
            <tr className="text-slate-455 border-b border-slate-200/60 bg-slate-50/70 text-[10px] font-black tracking-wider uppercase">
              <th className="px-6 py-4 w-16">STT</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4 text-center">Hiển thị</th>
              <th className="px-6 py-4 text-center">Duyệt</th>
              <th className="px-6 py-4">Danh mục con</th>
              <th className="w-24 px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs font-semibold sm:text-sm">
            {parentCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center text-xs font-bold text-slate-400"
                >
                  Không tìm thấy danh mục cha nào.
                </td>
              </tr>
            ) : (
              parentCategories.map((category, index) => {
                const rawStatus = category.status;
                const isVisible =
                  rawStatus === 1 ||
                  rawStatus === "1" ||
                  rawStatus === true ||
                  (typeof rawStatus === "string" &&
                    (rawStatus.toLowerCase() === "active" ||
                      rawStatus.toLowerCase() === "hoat_dong" ||
                      rawStatus.toLowerCase() === "visible"));

                // Get subcategories count from treeData
                const matchedTreeNode = treeData.find((node) => node.id === category.id);
                const childrenCount = matchedTreeNode?.children?.length || 0;

                return (
                  <tr
                    key={category.id}
                    className="transition-colors hover:bg-slate-50/30"
                  >
                    {/* STT */}
                    <td className="px-6 py-3.5 text-slate-500 font-bold">
                      {startIndex + index + 1}
                    </td>

                    {/* Category Name */}
                    <td className="px-6 py-3.5">
                      <span className="text-slate-850 font-extrabold">
                        {category.name}
                      </span>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-400">
                      {category.slug}
                    </td>

                    {/* Visibility status badge */}
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

                    {/* Verification Status Badge */}
                    <td className="px-6 py-3.5 text-center">
                      {category.isVerified ? (
                        <span className="text-blue-650 inline-flex items-center rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-extrabold">
                          Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-xs font-extrabold text-amber-700">
                          Chưa duyệt
                        </span>
                      )}
                    </td>

                    {/* Children category count and View trigger */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-extrabold border border-slate-200/60">
                          {childrenCount} danh mục con
                        </span>
                        <button
                          type="button"
                          onClick={() => onViewChildren?.(category)}
                          title="Xem danh mục con"
                          className="hover:text-primary cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100"
                        >
                          <ListTree className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(category)}
                          className="hover:text-primary cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(category)}
                          className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-slate-50/40 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
          <span className="text-xs text-slate-400 font-semibold text-center sm:text-left select-none">
            Hiển thị {startIndex + 1}-{endIndex} trên tổng số {totalItems} danh mục cha
          </span>
          <div className="w-full sm:w-auto [&>div]:border-t-0 [&>div]:pt-0 [&>div]:mt-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
