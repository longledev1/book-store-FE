import React from "react";
import { Edit3, Trash2, User } from "lucide-react";
import { type Author } from "../../../../services/author.service";
import { resolveMediaUrl } from "../../../../utils/format";
import Pagination from "../../../../components/ui/Pagination";

interface AuthorTableProps {
  authors: Author[];
  onEdit?: (author: Author) => void;
  onDelete?: (author: Author) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AuthorTable({
  authors,
  onEdit,
  onDelete,
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
}: AuthorTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Table Headers */}
          <thead>
            <tr className="text-slate-455 border-b border-slate-200/60 bg-slate-50/70 text-[10px] font-black tracking-wider uppercase">
              <th className="px-6 py-4 w-16">STT</th>
              <th className="px-6 py-4">Tác giả</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="w-24 px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs font-semibold sm:text-sm">
            {authors.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center text-xs font-bold text-slate-400"
                >
                  Không tìm thấy tác giả nào.
                </td>
              </tr>
            ) : (
              authors.map((author, index) => {
                return (
                  <tr
                    key={author.id}
                    className="transition-colors hover:bg-slate-50/30"
                  >
                    {/* STT */}
                    <td className="px-6 py-3.5 text-slate-500 font-bold">
                      {startIndex + index + 1}
                    </td>

                    {/* Author Name with Avatar */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                          {author.avatar?.fileUrl ? (
                            <img
                              src={resolveMediaUrl(author.avatar.fileUrl)}
                              alt={author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-4.5 h-4.5 text-slate-400" />
                          )}
                        </div>
                        <span className="text-slate-850 font-extrabold truncate">
                          {author.name}
                        </span>
                      </div>
                    </td>

                    {/* Describe */}
                    <td className="px-6 py-3.5 text-slate-400 font-medium">
                      {author.describe || <span className="italic text-slate-300 font-normal">Chưa có mô tả</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(author)}
                          className="hover:text-primary cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(author)}
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
            Hiển thị {startIndex + 1}-{endIndex} trên tổng số {totalItems} tác giả
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
