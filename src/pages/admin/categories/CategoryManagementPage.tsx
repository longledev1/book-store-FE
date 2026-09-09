import React, { useState, useEffect } from "react";
import { RotateCcw, Plus, Trash2 } from "lucide-react";
import {
  getCategoryTreeAPI,
  deleteCategoryAPI,
  getDeletedCategoriesAPI,
  type Category,
} from "../../../services/category.service";
import CategoryTable from "./components/CategoryTable";
import CategoryFilters from "./components/CategoryFilters";
import CategoryChildrenModal from "./components/CategoryChildrenModal";
import CategoryFormDialog from "./components/CategoryFormDialog";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import DeletedCategoriesModal from "./components/DeletedCategoriesModal";
import { useDebounce } from "../../../hooks/useDebounce";
import { toast } from "../../../stores/useToastStore";

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; // 10 categories per page as requested

  // Search Category states
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [sortOption, setSortOption] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  // Category Tree / Children modal states
  const [treeData, setTreeData] = useState<any[]>([]);
  const [isTreeLoading, setIsTreeLoading] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Category | null>(null);

  const [isChildrenModalOpen, setIsChildrenModalOpen] = useState(false);

  // Children category filters
  const [childrenSearchTerm, setChildrenSearchTerm] = useState("");
  const [childrenStatus, setChildrenStatus] = useState("");
  const [childrenIsVerified, setChildrenIsVerified] = useState("");
  const [childrenSortOption, setChildrenSortOption] = useState("");

  // Edit category states
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Delete & Soft-deleted category states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);
  const [deletedCount, setDeletedCount] = useState(0);

  const fetchDeletedCount = async () => {
    try {
      const response = await getDeletedCategoriesAPI(1, 1);
      setDeletedCount(response.pagination?.total || 0);
    } catch (error) {
      console.error("Lỗi khi lấy số lượng danh mục đã xóa:", error);
    }
  };

  const handleViewChildren = async (parentCategory: Category) => {
    setChildrenSearchTerm("");
    setChildrenStatus("");
    setChildrenIsVerified("");
    setChildrenSortOption("");
    setSelectedParent(parentCategory);

    setIsChildrenModalOpen(true);

    if (!Array.isArray(treeData) || treeData.length === 0) {
      setIsTreeLoading(true);
      try {
        const response = await getCategoryTreeAPI();
        setTreeData(response.data?.tree || []);
      } catch (error) {
        console.error("Lỗi khi tải tree danh mục:", error);
      } finally {
        setIsTreeLoading(false);
      }
    }
  };

  const fetchCategoriesList = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const sortMapping: Record<
        string,
        { orderBy: string; sort: "ASC" | "DESC" }
      > = {
        createdAt_DESC: { orderBy: "createdAt", sort: "DESC" },
        createdAt_ASC: { orderBy: "createdAt", sort: "ASC" },
        name_ASC: { orderBy: "name", sort: "ASC" },
        name_DESC: { orderBy: "name", sort: "DESC" },
      };

      const selectedSort = sortMapping[sortOption];

      const response = await getCategoryTreeAPI(
        debouncedSearchTerm,
        status,
        isVerified,
        selectedSort?.orderBy,
        selectedSort?.sort,
      );
      const tree = response.data?.tree || [];

      // Save tree data for modal and children count
      setTreeData(tree);

      // Filter parent categories (parentId === null)
      const parentCategories = tree.filter(
        (category) => category.parentId === null,
      );

      setCategories(parentCategories);
      setTotalItems(parentCategories.length);
      setTotalPages(Math.ceil(parentCategories.length / limit));
      fetchDeletedCount();
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
    setCurrentPage(1); // Reset to first page on search or status change
  }, [debouncedSearchTerm, status, isVerified, sortOption]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryAPI(categoryToDelete.id);
      toast.success("Xóa danh mục thành công!");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategoriesList();
    } catch (error: any) {
      console.error("Lỗi khi xóa danh mục:", error);
      const errorMessage = error.response?.data?.message || "Không thể xóa danh mục. Vui lòng thử lại.";
      toast.error(errorMessage);
    }
  };

  // Indices calculations for display
  const startIndex = (currentPage - 1) * limit;
  const displayedCategories = categories.slice(startIndex, startIndex + limit);
  const endIndex = Math.min(
    startIndex + displayedCategories.length,
    totalItems,
  );

  const treeDataArray = Array.isArray(treeData) ? treeData : [];
  const selectedNode = selectedParent
    ? treeDataArray.find((node) => node.id === selectedParent.id)
    : null;

  const childrenList = selectedNode?.children || [];
  // Filter children logic

  const filteredChildrenList = [...childrenList]
    .filter((child: Category) =>
      child.name.toLowerCase().includes(childrenSearchTerm.toLowerCase()),
    )
    .filter((child: Category) =>
      childrenStatus ? String(child.status) === childrenStatus : true,
    )
    .filter((child: Category) =>
      childrenIsVerified
        ? String(child.isVerified) === childrenIsVerified
        : true,
    )
    .sort((a: Category, b: Category) => {
      switch (childrenSortOption) {
        case "createdAt_ASC":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case "createdAt_DESC":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        case "name_ASC":
          return a.name.localeCompare(b.name, "vi");

        case "name_DESC":
          return b.name.localeCompare(a.name, "vi");

        default:
          return 0;
      }
    });
  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 uppercase sm:text-2xl">
            Quản lý danh mục sách
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-slate-400 sm:text-sm">
            Danh mục và danh mục con thuộc cửa hàng sách LuminaBook.ai
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDeletedModalOpen(true)}
            className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 active:scale-98 transition-all"
          >
            <Trash2 className="h-4 w-4 text-slate-500" />
            <span>Danh mục đã xóa ({deletedCount})</span>
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary flex cursor-pointer items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm danh mục</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <CategoryFilters
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        status={status}
        onStatusChange={setStatus}
        isVerified={isVerified}
        onIsVerifiedChange={(value) => {
          setIsVerified(value);
          setCurrentPage(1);
        }}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />

      {/* Main content states */}
      {isLoading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200/50 bg-white p-12 shadow-sm">
          <div className="border-primary h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
          <span className="mt-4 text-xs font-bold text-slate-400">
            Đang tải dữ liệu danh mục...
          </span>
        </div>
      ) : isError ? (
        // Error state
        <div className="flex min-h-[300px] flex-col items-center justify-center space-y-4 rounded-3xl border border-slate-200/50 bg-white p-12 text-center shadow-sm">
          <span className="text-xs font-bold text-rose-500">
            Đã xảy ra lỗi khi kết nối với hệ thống API danh mục.
          </span>
          <button
            onClick={fetchCategoriesList}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200 active:scale-98"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Thử lại</span>
          </button>
        </div>
      ) : categories.length === 0 ? (
        // Empty state
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200/50 bg-white p-12 text-center shadow-sm">
          <span className="text-xs font-bold text-slate-400">
            Chưa có danh mục nào trên hệ thống.
          </span>
        </div>
      ) : (
        // Data table
        <CategoryTable
          categories={displayedCategories}
          treeData={treeData}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onViewChildren={handleViewChildren}
          onEdit={(category) => {
            setCategoryToEdit(category);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      {/* Modal to view children categories */}
      <CategoryChildrenModal
        isOpen={isChildrenModalOpen}
        onClose={() => setIsChildrenModalOpen(false)}
        parentCategory={selectedParent}
        childrenCategories={filteredChildrenList}
        isLoading={isTreeLoading}
        searchTerm={childrenSearchTerm}
        onSearchChange={setChildrenSearchTerm}
        status={childrenStatus}
        onStatusChange={setChildrenStatus}
        isVerified={childrenIsVerified}
        onIsVerifiedChange={setChildrenIsVerified}
        sortOption={childrenSortOption}
        onSortChange={setChildrenSortOption}
        onEdit={(category) => {
          setCategoryToEdit(category);
          setIsFormOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Modal/Form to create new category */}
      <CategoryFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setCategoryToEdit(null);
        }}
        onSuccess={fetchCategoriesList}
        categoryToEdit={categoryToEdit}
        categoriesList={categories}
      />

      {/* Confirmation Dialog to Delete Category */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa danh mục"
        itemName={categoryToDelete?.name || ""}
        itemType="danh mục"
        warningText="Lưu ý: Danh mục bị xóa sẽ được đưa vào mục &quot;Danh mục đã xóa&quot; và có thể khôi phục lại bất kỳ lúc nào!"
        confirmButtonText="Xóa danh mục"
        isHardDelete={false}
      />

      {/* Deleted Categories Modal */}
      <DeletedCategoriesModal
        isOpen={isDeletedModalOpen}
        onClose={() => setIsDeletedModalOpen(false)}
        onRestoreSuccess={fetchCategoriesList}
      />
    </div>
  );
}
