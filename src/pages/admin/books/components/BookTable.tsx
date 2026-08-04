import React from "react";
import { Star, Trash2, Edit3 } from "lucide-react";
import { type Book } from "../../../../constants/booksData";
import BookStatusBadge from "./BookStatusBadge";
import Pagination from "../../../../components/ui/Pagination";

interface BookTableProps {
  books: Book[];
  onDelete: (id: string) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BookTable({
  books,
  onDelete,
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  onPageChange
}: BookTableProps) {
  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          
          {/* Table Headers */}
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/60 text-slate-455 text-[10px] font-black uppercase tracking-wider select-none">
              <th className="px-6 py-4 w-20">Ảnh bìa</th>
              <th className="px-6 py-4">Tên cuốn sách</th>
              <th className="px-6 py-4">Tác giả</th>
              <th className="px-6 py-4">Phân loại</th>
              <th className="px-6 py-4 text-right">Giá bán</th>
              <th className="px-6 py-4 text-center">Đánh giá</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center w-24">Hành động</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-semibold">
            {books.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-slate-400 text-xs font-bold">
                  Không tìm thấy cuốn sách nào khớp bộ lọc tìm kiếm.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="hover:bg-slate-50/30 transition-colors">
                  
                  {/* Cover image */}
                  <td className="px-6 py-3.5">
                    <div className="w-10 h-13 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>

                  {/* Book title */}
                  <td className="px-6 py-3.5 max-w-[200px]">
                    <span className="font-extrabold text-slate-850 line-clamp-1">
                      {book.title}
                    </span>
                  </td>

                  {/* Author */}
                  <td className="px-6 py-3.5">
                    <span className="text-slate-500 font-bold">{book.author}</span>
                  </td>

                  {/* Category Name */}
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {book.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-3.5 text-right font-black text-slate-800">
                    {book.price}
                  </td>

                  {/* Rating stars */}
                  <td className="px-6 py-3.5 text-center">
                    <div className="inline-flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-slate-700">{book.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-3.5 text-center">
                    <BookStatusBadge isNew={book.isNew} />
                  </td>

                  {/* Action buttons */}
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(book.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* 4. Table Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-slate-50/40 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
          <span className="text-xs text-slate-400 font-semibold text-center sm:text-left select-none">
            Hiển thị {startIndex + 1}-{endIndex} trên tổng số {totalItems} sản phẩm
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
