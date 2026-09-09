import React from "react";
import { Edit3, Trash2, BookOpen, Image as ImageIcon } from "lucide-react";
import { formatPrice, resolveProductImageUrl } from "../../../../utils/format";
import { type Product } from "../../../../services/product.service";
import Pagination from "../../../../components/ui/Pagination";

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
}: ProductTableProps) {

  const getProductImage = (product: Product) => {
    let rawUrl = "";
    if (product.imgUrl) rawUrl = product.imgUrl;
    else if (product.albums && product.albums.length > 0) {
      const sortedAlbums = [...product.albums].sort((a, b) => a.displayOrder - b.displayOrder);
      rawUrl = sortedAlbums[0]?.media?.url || sortedAlbums[0]?.mediaUrl || "";
    }
    return resolveProductImageUrl(rawUrl);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-sm select-none">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Table Headers */}
          <thead>
            <tr className="text-slate-455 border-b border-slate-200/60 bg-slate-50/70 text-[10px] font-black tracking-wider uppercase whitespace-nowrap">
              <th className="px-6 py-4 w-16 text-center">STT</th>
              <th className="px-6 py-4 w-20 text-center">Ảnh</th>
              <th className="px-6 py-4">Tên sản phẩm</th>
              <th className="px-6 py-4">Danh mục</th>
              <th className="px-6 py-4">Tác giả</th>
              <th className="px-6 py-4 text-right">Giá bán</th>
              <th className="px-6 py-4 text-center">Tồn kho</th>
              <th className="px-6 py-4 text-center">Đã bán</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Xác minh</th>
              <th className="w-24 px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 text-xs font-semibold sm:text-sm">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="py-20 text-center text-xs font-bold text-slate-400"
                >
                  Không tìm thấy sản phẩm nào trong hệ thống.
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
                const imageSrc = getProductImage(product);
                const categoriesDisplay = product.categories && product.categories.length > 0
                  ? product.categories.map((c: any) => c.name || c).join(", ")
                  : "Chưa phân loại";
                
                const authorsDisplay = product.authors && product.authors.length > 0
                  ? product.authors.map((a: any) => a.name || a).join(", ")
                  : "Ẩn danh";

                const isVisible = product.status === 1 || String(product.status) === "1";
                const hasDiscount = product.finalPrice && product.price && product.price > product.finalPrice;

                return (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-slate-50/30"
                  >
                    {/* STT */}
                    <td className="px-6 py-3 text-slate-500 font-bold text-center">
                      {startIndex + index + 1}
                    </td>

                    {/* Image */}
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-10 h-14 object-cover rounded-lg border border-slate-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-350">
                            <BookOpen className="w-5.5 h-5.5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="px-6 py-3 max-w-xs sm:max-w-sm">
                      <div className="flex flex-col">
                        <span className="text-slate-850 font-extrabold line-clamp-2">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* Categories */}
                    <td className="px-6 py-3 max-w-[150px]">
                      <span className="text-slate-500 font-semibold truncate block" title={categoriesDisplay}>
                        {categoriesDisplay}
                      </span>
                    </td>

                    {/* Authors */}
                    <td className="px-6 py-3 max-w-[120px]">
                      <span className="text-slate-500 font-semibold truncate block" title={authorsDisplay}>
                        {authorsDisplay}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-rose-600 font-extrabold">
                          {formatPrice(product.finalPrice !== undefined ? product.finalPrice : product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[10px] text-slate-400 font-semibold line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-3 text-center text-slate-650 font-bold">
                      {product.stockQuantity || 0}
                    </td>

                    {/* Sold */}
                    <td className="px-6 py-3 text-center text-slate-500">
                      {product.soldCount || 0}
                    </td>

                    {/* Visibility status badge */}
                    <td className="px-6 py-3 text-center whitespace-nowrap">
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
                    <td className="px-6 py-3 text-center whitespace-nowrap">
                      {product.isVerified ? (
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
                    <td className="px-6 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit?.(product)}
                          className="hover:text-primary cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete?.(product)}
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
