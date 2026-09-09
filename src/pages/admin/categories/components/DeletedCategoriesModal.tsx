import React, { useState, useEffect } from "react";
import { X, RotateCcw, Search, Trash2 } from "lucide-react";
import { getDeletedCategoriesAPI, restoreCategoryAPI, hardDeleteCategoryAPI, type Category } from "../../../../services/category.service";
import { useDebounce } from "../../../../hooks/useDebounce";
import { toast } from "../../../../stores/useToastStore";
import Pagination from "../../../../components/ui/Pagination";
import ConfirmDeleteDialog from "../../../../components/ui/ConfirmDeleteDialog";

interface DeletedCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export default function DeletedCategoriesModal({
  isOpen,
  onClose,
  onRestoreSuccess,
}: DeletedCategoriesModalProps) {
  const [deletedCategories, setDeletedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5; // Compact size for modal listings

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Hard delete confirmation states
  const [isHardDeleteDialogOpen, setIsHardDeleteDialogOpen] = useState(false);
  const [categoryToHardDelete, setCategoryToHardDelete] = useState<Category | null>(null);

  const fetchDeletedCategories = async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const response = await getDeletedCategoriesAPI(currentPage, limit, debouncedSearchTerm);
      setDeletedCategories(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục đã xóa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedCategories();
  }, [isOpen, currentPage, debouncedSearchTerm]);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  if (!isOpen) return null;

  const handleRestore = async (category: Category) => {
    try {
      await restoreCategoryAPI(category.id);
      toast.success(`Khôi phục danh mục "${category.name}" thành công!`);
      fetchDeletedCategories();
      onRestoreSuccess();
    } catch (error) {
      console.error("Lỗi khi khôi phục danh mục:", error);
      toast.error("Không thể khôi phục danh mục. Vui lòng thử lại.");
    }
  };

  const handleHardDeleteClick = (category: Category) => {
    setCategoryToHardDelete(category);
    setIsHardDeleteDialogOpen(true);
  };

  const handleHardDeleteConfirm = async () => {
    if (!categoryToHardDelete) return;

    try {
      await hardDeleteCategoryAPI(categoryToHardDelete.id);
      toast.success(`Xóa vĩnh viễn danh mục "${categoryToHardDelete.name}" thành công!`);
      setIsHardDeleteDialogOpen(false);
      setCategoryToHardDelete(null);
      fetchDeletedCategories();
      onRestoreSuccess();
    } catch (error: any) {
      console.error("Lỗi khi xóa vĩnh viễn danh mục:", error);
      const errorMessage = error.response?.data?.message || "Không thể xóa vĩnh viễn danh mục. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + deletedCategories.length, totalItems);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white w-full max-w-7xl rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 flex flex-col text-left relative min-h-[85vh] max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight">
              Danh mục đã xóa
            </h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Danh sách các danh mục đã bị xóa tạm thời (Soft Delete)
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
            placeholder="Tìm kiếm trong danh sách đã xóa..."
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
          ) : deletedCategories.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 py-12 text-center">
              <span className="text-xs font-bold text-slate-400">
                {searchTerm.trim()
                  ? "Không tìm thấy danh mục nào khớp với từ khóa."
                  : "Thùng rác trống. Chưa có danh mục nào bị xóa."}
              </span>
            </div>
          ) : (
            <div className="overflow-y-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-100 whitespace-nowrap">
                    <th className="px-4 py-3 w-16">STT</th>
                    <th className="px-4 py-3">Danh mục</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3 text-center w-64 whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                  {deletedCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-3 text-slate-500 font-bold">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-extrabold whitespace-nowrap">
                        {category.name}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px] font-bold">
                        {category.slug}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleRestore(category)}
                            title="Khôi phục danh mục"
                            className="flex items-center justify-center gap-1 hover:text-green-650 cursor-pointer rounded-lg px-2.5 py-1 text-slate-500 transition-colors hover:bg-green-50 border border-transparent hover:border-green-100 text-[11px] font-extrabold whitespace-nowrap"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Khôi phục</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleHardDeleteClick(category)}
                            title="Xóa vĩnh viễn"
                            className="flex items-center justify-center gap-1 hover:text-rose-600 cursor-pointer rounded-lg px-2.5 py-1 text-slate-500 transition-colors hover:bg-rose-50 border border-transparent hover:border-rose-100 text-[11px] font-extrabold whitespace-nowrap"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa vĩnh viễn</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Table Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 items-center">
            <span className="text-xs text-slate-400 font-semibold text-center sm:text-left select-none">
              Hiển thị {startIndex + 1}-{endIndex} trên tổng số {totalItems} danh mục đã xóa
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
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98"
          >
            Đóng
          </button>
        </div>

      </div>

      {/* Confirmation Dialog to Hard Delete Category */}
      <ConfirmDeleteDialog
        isOpen={isHardDeleteDialogOpen}
        onClose={() => {
          setIsHardDeleteDialogOpen(false);
          setCategoryToHardDelete(null);
        }}
        onConfirm={handleHardDeleteConfirm}
        title="Xác nhận xóa vĩnh viễn"
        itemName={categoryToHardDelete?.name || ""}
        itemType="danh mục"
        warningText="Cảnh báo: Hành động này không thể hoàn tác và sẽ xóa sạch mọi danh mục con và sách liên kết với danh mục này!"
        confirmButtonText="Xóa vĩnh viễn"
        isHardDelete={true}
      />
    </div>
  );
}
