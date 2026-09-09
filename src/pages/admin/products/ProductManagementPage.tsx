import React, { useState, useEffect } from "react";
import { RotateCcw, Plus, Trash2 } from "lucide-react";
import {
  getProductsAPI,
  deleteProductAPI,
  getDeletedProductsAPI,
  type Product,
} from "../../../services/product.service";
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import ProductFormDialog from "./components/ProductFormDialog";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import DeletedProductsModal from "./components/DeletedProductsModal";
import { useDebounce } from "../../../hooks/useDebounce";
import { toast } from "../../../stores/useToastStore";

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Form Dialog state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Delete Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Deleted list modal state
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const fetchDeletedCount = async () => {
    try {
      const response = await getDeletedProductsAPI(1, 1);
      setDeletedCount(response.pagination?.total || 0);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng sản phẩm đã xóa:", error);
    }
  };

  const fetchProductsList = async () => {
    setIsLoading(true);
    setIsError(false);
    
    // Parse sort options
    let orderBy: string | undefined;
    let sort: string | undefined;
    if (sortOption) {
      const [field, direction] = sortOption.split("_");
      orderBy = field;
      sort = direction;
    }

    try {
      const response = await getProductsAPI(
        currentPage,
        limit,
        debouncedSearchTerm,
        status,
        isVerified,
        orderBy,
        sort,
        categoryId,
        authorId,
      );
      setProducts(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, [currentPage, debouncedSearchTerm, status, isVerified, sortOption, categoryId, authorId]);

  useEffect(() => {
    fetchDeletedCount();
  }, []);

  // Reset page when search term/filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, status, isVerified, sortOption, categoryId, authorId]);

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductAPI(productToDelete.id);
      toast.success("Xóa sản phẩm thành công!");
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      await fetchProductsList();
      await fetchDeletedCount();
    } catch (error: any) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      const errorMessage = error.response?.data?.message || "Không thể xóa sản phẩm. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddNewClick = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  // Indices calculations for display
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + products.length, totalItems);

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
            Quản lý Sản phẩm
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-0.5 select-none">
            Quản lý kho sách, thông tin sản phẩm, giá bán, tồn kho và trạng thái hiển thị.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 select-none font-sans self-start sm:self-auto">
          {/* Deleted Products Button */}
          <button
            onClick={() => setIsDeletedModalOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 text-xs font-bold px-3.5 py-2.5 transition-all cursor-pointer active:scale-98"
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>Sản phẩm đã xóa ({deletedCount})</span>
          </button>

          {/* Add New Product Button */}
          <button
            onClick={handleAddNewClick}
            className="bg-primary hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-500/10 active:scale-98"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* 2. Filters Toolbar */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        status={status}
        onStatusChange={setStatus}
        isVerified={isVerified}
        onIsVerifiedChange={setIsVerified}
        sortOption={sortOption}
        onSortChange={setSortOption}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        authorId={authorId}
        onAuthorChange={setAuthorId}
      />

      {/* 3. Table / State display */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200/50 shadow-sm">
          <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-400 mt-3 select-none">Đang tải danh sách sản phẩm...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/50 shadow-sm text-center">
          <span className="text-xs font-bold text-rose-500">Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng tải lại trang.</span>
          <button
            onClick={fetchProductsList}
            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-250 text-slate-650 text-xs font-bold rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tải lại</span>
          </button>
        </div>
      ) : (
        <ProductTable
          products={products}
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

      {/* Form Dialog for Create / Edit */}
      <ProductFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setProductToEdit(null);
        }}
        onSuccess={fetchProductsList}
        productToEdit={productToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa sản phẩm"
        itemName={productToDelete?.name || ""}
        itemType="sản phẩm"
        warningText="Lưu ý: Sản phẩm bị xóa sẽ được đưa vào mục &quot;Sản phẩm đã xóa gần đây&quot; và có thể khôi phục lại bất kỳ lúc nào!"
        confirmButtonText="Xóa sản phẩm"
        isHardDelete={false}
      />

      {/* Deleted Products Modal */}
      <DeletedProductsModal
        isOpen={isDeletedModalOpen}
        onClose={() => setIsDeletedModalOpen(false)}
        onRestoreSuccess={async () => {
          await fetchProductsList();
          await fetchDeletedCount();
        }}
      />

    </div>
  );
}
