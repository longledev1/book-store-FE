import React, { useState, useEffect } from "react";
import { RotateCcw, Plus, Trash2 } from "lucide-react";
import {
  getAuthorsAPI,
  deleteAuthorAPI,
  getDeletedAuthorsAPI,
  type Author,
} from "../../../services/author.service";
import AuthorTable from "./components/AuthorTable";
import AuthorFilters from "./components/AuthorFilters";
import AuthorFormDialog from "./components/AuthorFormDialog";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import DeletedAuthorsModal from "./components/DeletedAuthorsModal";
import { useDebounce } from "../../../hooks/useDebounce";
import { toast } from "../../../stores/useToastStore";

export default function AuthorManagementPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  // Search Author states
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Modal dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [authorToEdit, setAuthorToEdit] = useState<Author | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const fetchDeletedCount = async () => {
    try {
      const response = await getDeletedAuthorsAPI(1, 1);
      setDeletedCount(response.pagination?.total || 0);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng tác giả đã xóa:", error);
    }
  };

  const fetchAuthorsList = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const response = await getAuthorsAPI(
        currentPage,
        limit,
        debouncedSearchTerm,
      );
      setAuthors(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 0);
      fetchDeletedCount();
    } catch (error) {
      console.error("Lỗi khi tải danh sách tác giả:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthorsList();
  }, [currentPage, debouncedSearchTerm]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (author: Author) => {
    setAuthorToEdit(author);
    setIsFormDialogOpen(true);
  };

  const handleDelete = (author: Author) => {
    setAuthorToDelete(author);
    setIsDeleteDialogOpen(true);
  };

  const handleCreate = () => {
    setAuthorToEdit(null);
    setIsFormDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!authorToDelete) return;
    try {
      await deleteAuthorAPI(authorToDelete.id);
      toast.success("Xóa tác giả thành công!");
      setIsDeleteDialogOpen(false);
      setAuthorToDelete(null);
      fetchAuthorsList();
    } catch (error: any) {
      console.error("Lỗi khi xóa tác giả:", error);
      const errorMessage = error.response?.data?.message || "Không thể xóa tác giả. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + authors.length, totalItems);

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase sm:text-2xl">
            Quản lý tác giả
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-400 sm:text-sm">
            Danh sách các tác giả viết sách thuộc hệ thống LuminaBook.ai
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDeletedModalOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 active:scale-98 transition-all"
          >
            <Trash2 className="h-4 w-4 text-slate-500" />
            <span>Tác giả đã xóa ({deletedCount})</span>
          </button>
          <button
            onClick={handleCreate}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition-all hover:bg-blue-700 active:scale-98 shadow-sm shadow-blue-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm tác giả</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <AuthorFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main content states */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200/50 bg-white p-12 shadow-sm">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
          <span className="mt-4 text-xs font-bold text-slate-400">
            Đang tải dữ liệu tác giả...
          </span>
        </div>
      ) : isError ? (
        // Error state
        <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 rounded-3xl border border-slate-200/50 bg-white p-12 text-center shadow-sm">
          <span className="text-xs font-bold text-rose-500">
            Đã xảy ra lỗi khi kết nối với hệ thống API tác giả.
          </span>
          <button
            onClick={fetchAuthorsList}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-98"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : authors.length === 0 ? (
        // Empty state
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200/50 bg-white p-12 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-400">
            Chưa có tác giả nào trên hệ thống.
          </span>
        </div>
      ) : (
        // Data table
        <AuthorTable
          authors={authors}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal/Form to Create/Edit Author */}
      <AuthorFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => setIsFormDialogOpen(false)}
        onSuccess={fetchAuthorsList}
        authorToEdit={authorToEdit}
      />

      {/* Confirmation Dialog to Delete Author */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setAuthorToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa tác giả"
        itemName={authorToDelete?.name || ""}
        itemType="tác giả"
        warningText="Lưu ý: Tác giả bị xóa sẽ được đưa vào mục &quot;Tác giả đã xóa&quot; và có thể khôi phục lại bất kỳ lúc nào!"
        confirmButtonText="Xóa tác giả"
        isHardDelete={false}
      />

      {/* Deleted Authors Modal */}
      <DeletedAuthorsModal
        isOpen={isDeletedModalOpen}
        onClose={() => setIsDeletedModalOpen(false)}
        onRestoreSuccess={fetchAuthorsList}
      />
    </div>
  );
}
