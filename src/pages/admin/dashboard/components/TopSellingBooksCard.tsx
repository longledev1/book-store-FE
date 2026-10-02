import { Award, ExternalLink, Package } from "lucide-react";
import { Link } from "react-router-dom";
import type { TopSellingBookItem } from "@/services/analytics.service";
import { formatPrice, resolveMediaUrl } from "@/utils/format";

interface TopSellingBooksCardProps {
  data: TopSellingBookItem[];
  isLoading: boolean;
}

export default function TopSellingBooksCard({
  data,
  isLoading,
}: TopSellingBooksCardProps) {
  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
            1
          </span>
        );
      case 1:
        return (
          <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">
            2
          </span>
        );
      case 2:
        return (
          <span className="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
            3
          </span>
        );
      default:
        return (
          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center">
            {index + 1}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/60">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-850 tracking-tight">
              Top Sách Bán Chạy
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Sản phẩm có lượng tiêu thụ và doanh thu dẫn đầu
            </p>
          </div>
        </div>

        <Link
          to="/admin/products"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
        >
          <span>Kho hàng</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="py-8 space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/60 animate-pulse"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200" />
              <div className="w-10 h-14 rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-3 rounded bg-slate-200" />
                <div className="w-1/3 h-2.5 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="py-12 text-center text-xs font-semibold text-slate-400">
          Chưa có giao dịch bán sách trong kỳ này
        </div>
      ) : (
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-2 w-10 text-center">#</th>
                <th className="py-2.5 px-2 min-w-[200px]">Tên Sách</th>
                <th className="py-2.5 px-2 text-right">Đã bán</th>
                <th className="py-2.5 px-2 text-right">Doanh thu</th>
                <th className="py-2.5 px-2 text-right">Tồn kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60 text-xs">
              {data.map((book, idx) => (
                <tr
                  key={book.productId || idx}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Rank */}
                  <td className="py-3 px-2 text-center">
                    <div className="flex justify-center">{getRankBadge(idx)}</div>
                  </td>

                  {/* Book Info */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200/60 shadow-2xs">
                        <img
                          src={resolveMediaUrl(book.coverUrl) || "/mock_data.png"}
                          alt={book.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/mock_data.png";
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/books/${book.productId}`}
                          target="_blank"
                          className="font-bold text-slate-800 hover:text-primary transition-colors line-clamp-1 group-hover:underline"
                          title={book.name}
                        >
                          {book.name}
                        </Link>
                        <span className="text-[11px] text-slate-400 font-medium block truncate">
                          {book.authorName || "Đang cập nhật tác giả"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Quantity Sold */}
                  <td className="py-3 px-2 text-right font-black text-slate-850 whitespace-nowrap">
                    {book.soldQuantity.toLocaleString("vi-VN")}
                    <span className="text-[10px] font-normal text-slate-400 ml-1">
                      cuốn
                    </span>
                  </td>

                  {/* Revenue */}
                  <td className="py-3 px-2 text-right font-black text-emerald-600 whitespace-nowrap">
                    {formatPrice(book.revenue)}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-2 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        book.stockQuantity <= 5
                          ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Package className="w-3 h-3" />
                      {book.stockQuantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
