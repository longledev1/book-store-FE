import React, { useState, useEffect } from "react";
import { getMediasAPI, getMediaFoldersAPI, deleteMediaAPI, hardDeleteMediaAPI, type Media, type MediaFolder } from "../../../services/media.service";
import { toast } from "../../../stores/useToastStore";
import { useDebounce } from "../../../hooks/useDebounce";

// Import Layout Components
import MediaHeader from "./components/MediaHeader";
import MediaToolbar from "./components/MediaToolbar";
import MediaFolderPanel from "./components/MediaFolderPanel";
import MediaGrid from "./components/MediaGrid";
import Pagination from "../../../components/ui/Pagination";

// Import Dialog Components
import MediaUploadDialog from "./components/MediaUploadDialog";
import MediaPreviewDialog from "./components/MediaPreviewDialog";
import MediaEditDialog from "./components/MediaEditDialog";
import ConfirmDeleteDialog from "../../../components/ui/ConfirmDeleteDialog";
import MoveMediaDialog from "./components/MoveMediaDialog";
import BulkActionToolbar from "./components/BulkActionToolbar";

export default function MediaManagementPage() {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [medias, setMedias] = useState<Media[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const debouncedSelectedFolder = useDebounce(selectedFolder, 300);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 600);

  // Pagination states
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const limit = 24;

  // Dialog visibility states
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  // Loading and Error states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Selected media for Preview/Edit/Delete
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  
  // Selection/Move states
  const [isMoveOpen, setIsMoveOpen] = useState<boolean>(false);
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  // Fetch folders statistics
  const fetchFolders = async () => {
    try {
      const response = await getMediaFoldersAPI();
      setFolders(response.data || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thư mục:", error);
    }
  };

  // Fetch medias list based on filters
  const fetchMedias = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await getMediasAPI(
        currentPage,
        limit,
        debouncedSelectedFolder || undefined,
        debouncedSearch.trim() || undefined
      );
      setMedias(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 0);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hình ảnh:", error);
      setIsError(true);
      toast.error("Không thể tải danh sách hình ảnh. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFolders();
  }, []);

  // Reset to page 1 and set search query
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSelectFolder = (path: string) => {
    setSelectedFolder(path);
    setCurrentPage(1);
  };

  // Fetch files when folder, search keyword, or page changes
  useEffect(() => {
    setSelectedMediaIds([]); // Clear selection when changing folder/query
    fetchMedias();
  }, [debouncedSelectedFolder, debouncedSearch, currentPage]);

  const handleToggleSelect = (mediaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMediaIds((prev) =>
      prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]
    );
  };

  const handleMoveSuccess = async () => {
    setSelectedMediaIds([]);
    setSelectedMedia(null);
    await fetchFolders();
    await fetchMedias();
  };

  const handleMoveClickInPreview = () => {
    setIsPreviewOpen(false);
    setIsMoveOpen(true);
  };

  const handleMediaClick = (media: Media) => {
    // If we have selected items, click toggles selection instead of opening preview
    if (selectedMediaIds.length > 0) {
      setSelectedMediaIds((prev) =>
        prev.includes(media.id) ? prev.filter((id) => id !== media.id) : [...prev, media.id]
      );
      return;
    }
    setSelectedMedia(media);
    setIsPreviewOpen(true);
  };

  const handleEditClickInPreview = () => {
    setIsPreviewOpen(false);
    setIsEditOpen(true);
  };

  const handleDeleteClickInPreview = () => {
    setIsPreviewOpen(false);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMedia) return;
    try {
      await deleteMediaAPI(selectedMedia.id);
      toast.success("Đã xóa tệp tin media thành công!");
      setIsDeleteOpen(false);
      setSelectedMedia(null);
      
      // Refresh statistics and list
      await fetchFolders();
      await fetchMedias();
    } catch (error: any) {
      console.error("Lỗi khi xóa media:", error);
      const errMsg = error.response?.data?.message || "Xóa tệp tin media thất bại.";
      toast.error(errMsg);
    }
  };

  const handleUploadSuccess = async () => {
    await fetchFolders();
    await fetchMedias();
  };

  const handleEditSuccess = async () => {
    await fetchFolders();
    await fetchMedias();
  };

  return (
    <div className="space-y-6 flex flex-col min-h-0">
      {/* Header */}
      <MediaHeader onUploadClick={() => setIsUploadOpen(true)} />

      {/* Toolbar (Breadcrumbs + Search) */}
      <MediaToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedFolder={selectedFolder}
        totalItems={totalItems}
      />

      {/* Media Explorer Container (Folder Tree + Media Grid) */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Side: Internal Folder Navigation Panel */}
        <MediaFolderPanel
          folders={folders}
          selectedFolder={selectedFolder}
          onSelectFolder={handleSelectFolder}
        />

        {/* Right Side: Media Assets Grid */}
        <div className="flex-1 w-full space-y-4">
          <MediaGrid
            medias={medias}
            onMediaClick={handleMediaClick}
            isLoading={isLoading}
            selectedMediaIds={selectedMediaIds}
            onToggleSelect={handleToggleSelect}
          />

          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedMediaIds.length}
        onMoveClick={() => setIsMoveOpen(true)}
        onClearSelection={() => setSelectedMediaIds([])}
      />

      {/* Modals and Dialogs */}
      <MediaUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSuccess={handleUploadSuccess}
        existingFolders={folders}
      />

      <MediaPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
        onEditClick={handleEditClickInPreview}
        onDeleteClick={handleDeleteClickInPreview}
        onMoveClick={handleMoveClickInPreview}
      />

      <MediaEditDialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
        onSuccess={handleEditSuccess}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedMedia(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa tệp tin"
        itemName={selectedMedia?.fileName || ""}
        itemType="tệp tin media"
        warningText="Cảnh báo: Hình ảnh sẽ bị xóa tạm thời khỏi hệ thống. Nếu hình ảnh này đang được sử dụng trong sách hoặc banner, nó có thể không hiển thị được nữa!"
        confirmButtonText="Xóa tệp tin"
        isHardDelete={false}
      />

      <MoveMediaDialog
        isOpen={isMoveOpen}
        onClose={() => {
          setIsMoveOpen(false);
          if (selectedMediaIds.length === 0) setSelectedMedia(null);
        }}
        mediaIds={selectedMediaIds.length > 0 ? selectedMediaIds : (selectedMedia ? [selectedMedia.id] : [])}
        currentFolder={selectedMediaIds.length > 0 ? undefined : (selectedMedia?.folderPath || undefined)}
        onSuccess={handleMoveSuccess}
      />
    </div>
  );
}
