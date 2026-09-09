import React, { useState, useEffect } from "react";
import { X, RotateCcw, Search, Trash2, BookOpen } from "lucide-react";
import {
  getDeletedProductsAPI,
  restoreProductAPI,
  hardDeleteProductAPI,
  type Product,
} from "../../../../services/product.service";
import { useDebounce } from "../../../../hooks/useDebounce";
import { toast } from "../../../../stores/useToastStore";
import Pagination from "../../../../components/ui/Pagination";
import ConfirmDeleteDialog from "../../../../components/ui/ConfirmDeleteDialog";
import { resolveProductImageUrl } from "../../../../utils/format";

interface DeletedProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export default function DeletedProductsModal({
  isOpen,
  onClose,
  onRestoreSuccess,
}: DeletedProductsModalProps) {
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5; // Compact size for modal listings

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Hard delete confirmation states
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false);
  const [productToHardDelete, setProductToHardDelete] = useState<Product | null>(null);

  const fetchDeletedProducts = async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const response = await getDeletedProductsAPI(currentPage, limit, debouncedSearchTerm);
      setDeletedProducts(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm đã xóa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, [isOpen, currentPage, debouncedSearchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  if (!isOpen) return null;

  const handleRestore = async (product: Product) => {
    try {
      await restoreProductAPI(product.id);
      toast.success(`Khôi phục sản phẩm "${product.name}" thành công!`);
      fetchDeletedProducts();
      onRestoreSuccess();
    } catch (error) {
      console.error("Lỗi khi khôi phục sản phẩm:", error);
      toast.error("Không thể khôi phục sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleHardDeleteClick = (product: Product) => {
    setProductToHardDelete(product);
    setIsHardDeleteDialogOpen(true);
  };

  const handleHardDeleteConfirm = async () => {
    if (!productToHardDelete) return;

    try {
      await hardDeleteProductAPI(productToHardDelete.id);
      toast.success(`Xóa vĩnh viễn sản phẩm "${productToHardDelete.name}" thành công!`);
      setIsHardDeleteDialogOpen(false);
      setProductToHardDelete(null);
      fetchDeletedProducts();
      onRestoreSuccess();
    } catch (error: any) {
      console.error("Lỗi khi xóa vĩnh viễn sản phẩm:", error);
      const errorMessage = error.response?.data?.message || "Không thể xóa vĩnh viễn sản phẩm. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };


  const getProductImage = (product: Product) => {
    let rawUrl = "";
    if (product.imgUrl) rawUrl = product.imgUrl;
    else if (product.albums && product.albums.length > 0) {
      const sortedAlbums = [...product.albums].sort((a, b) => a.displayOrder - b.displayOrder);
      rawUrl = sortedAlbums[0]?.media?.url || sortedAlbums[0]?.mediaUrl || "";
    }
    return resolveProductImageUrl(rawUrl);
  };

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + deletedProducts.length, totalItems);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white w-full max-w-7xl rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 flex flex-col text-left relative min-h-[85vh] max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight">
              Sản phẩm đã xóa gần đây
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Danh sách các sản phẩm đã bị xóa tạm thời (Soft Delete)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Toolbar (Search box) */}
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm sản phẩm đã xóa..."
            className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200/60 bg-slate-50 py-1.5 pr-4 pl-9 text-xs font-semibold text-slate-700 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4"
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col min-h-0 space-y-4 mb-4">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-slate-400 mt-3">Đang tải danh sách...</span>
            </div>
          ) : deletedProducts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 py-12 text-center">
              <span className="text-xs font-bold text-slate-400">
                {searchTerm.trim()
                  ? "Không tìm thấy sản phẩm nào khớp với từ khóa."
                  : "Thùng rác trống. Chưa có sản phẩm nào bị xóa gần đây."}
              </span>
            </div>
          ) : (
            <div className="overflow-y-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 whitespace-nowrap">
                    <th className="px-4 py-3 w-16 text-center">STT</th>
                    <th className="px-4 py-3 w-20 text-center">Ảnh</th>
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3 text-center w-64 whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {deletedProducts.map((product, index) => {
                    const imageSrc = getProductImage(product);
                    return (
                      <tr key={product.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-4 py-3 text-slate-500 font-bold text-center">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3">
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
                        <td className="px-4 py-3 text-slate-800 font-extrabold whitespace-nowrap">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleRestore(product)}
                              title="Khôi phục sản phẩm"
                              className="flex items-center justify-center gap-1 hover:text-green-650 cursor-pointer rounded-lg px-2.5 py-1 text-slate-500 transition-colors hover:bg-green-50 border border-transparent hover:border-green-100 text-[11px] font-extrabold whitespace-nowrap"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Khôi phục</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleHardDeleteClick(product)}
                              title="Xóa vĩnh viễn"
                              className="flex items-center justify-center gap-1 hover:text-rose-600 cursor-pointer rounded-lg px-2.5 py-1 text-slate-500 transition-colors hover:bg-rose-50 border border-transparent hover:border-rose-100 text-[11px] font-extrabold whitespace-nowrap"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Xóa vĩnh viễn</span>
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

        {/* Table Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
            <span className="text-xs text-slate-400 font-semibold text-center sm:text-left select-none">
              Hiển thị {startIndex + 1}-{endIndex} trên tổng số {totalItems} sản phẩm đã xóa
            </span>
            <div className="w-full sm:w-auto [&>div]:border-t-0 [&>div]:pt-0 [&>div]:mt-0">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

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

      {/* Confirmation Dialog to Hard Delete Product */}
      <ConfirmDeleteDialog
        isOpen={isHardDeleteDialogOpen}
        onClose={() => {
          setIsHardDeleteDialogOpen(false);
          setProductToHardDelete(null);
        }}
        onConfirm={handleHardDeleteConfirm}
        title="Xác nhận xóa vĩnh viễn"
        itemName={productToHardDelete?.name || ""}
        itemType="sản phẩm"
        warningText="Cảnh báo: Hành động này không thể hoàn tác và sẽ xóa sạch mọi thông tin liên quan đến sản phẩm này!"
        confirmButtonText="Xóa vĩnh viễn"
        isHardDelete={true}
      />
    </div>
  );
}
