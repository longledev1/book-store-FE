import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import {
  getPublicProductReviewsAPI,
  getProductReviewStatsAPI,
  deleteMyReviewAPI,
  adminUpdateReviewStatusAPI,
  adminHardDeleteReviewAPI,
  type ReviewItem as ReviewItemType,
  type ReviewStats,
} from "@/services/review.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/stores/useToastStore";
import Pagination from "@/components/ui/Pagination";
import ConfirmDeleteDialog from "@/components/ui/ConfirmDeleteDialog";

import ReviewStatsSummary from "./reviews/ReviewStatsSummary";
import ReviewFilterTabs from "./reviews/ReviewFilterTabs";
import ReviewForm from "./reviews/ReviewForm";
import ReviewItem from "./reviews/ReviewItem";

interface ProductReviewsSectionProps {
  productId: string;
}

export default function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const currentUser = useAuthStore((state) => state.user);
  const isAdmin = currentUser?.role === "ADMIN";

  // Data States
  const [reviews, setReviews] = useState<ReviewItemType[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Custom Confirm Delete Dialog State
  const [deleteDialogTarget, setDeleteDialogTarget] = useState<{
    id: string;
    commentSnippet: string;
    type: "OWNER_DELETE" | "ADMIN_REJECT" | "ADMIN_HARD_DELETE";
  } | null>(null);

  // Fetch Stats & Reviews
  const fetchStats = useCallback(async () => {
    try {
      const res = await getProductReviewStatsAPI(productId);
      const data = res?.data || res;
      setStats(data);
    } catch (err) {
      console.warn("Lỗi khi tải thống kê đánh giá:", err);
    }
  }, [productId]);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getPublicProductReviewsAPI(productId, {
        page,
        limit: 5,
        rating: selectedRatingFilter,
      });
      const items = res?.data || res?.items || [];
      const meta = res?.meta || res?.pagination;

      setReviews(items);
      if (meta) {
        setTotalPages(meta.totalPages || Math.ceil((meta.totalItems || items.length) / 5) || 1);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách đánh giá:", err);
    } finally {
      setIsLoading(false);
    }
  }, [productId, page, selectedRatingFilter]);

  useEffect(() => {
    if (productId) {
      fetchStats();
      fetchReviews();
    }
  }, [productId, fetchStats, fetchReviews]);

  const handleRefreshData = () => {
    fetchStats();
    fetchReviews();
  };

  // Confirm Delete Dialog Executor
  const handleConfirmDeleteDialog = async () => {
    if (!deleteDialogTarget) return;

    const { id, type } = deleteDialogTarget;

    try {
      if (type === "OWNER_DELETE") {
        await deleteMyReviewAPI(id);
        toast.success("Xóa bài đánh giá của bạn thành công!");
      } else if (type === "ADMIN_REJECT") {
        await adminUpdateReviewStatusAPI(id, "REJECTED");
        toast.success("Đã ẩn bài đánh giá khỏi trang web thành công (Trạng thái: REJECTED)!");
      } else if (type === "ADMIN_HARD_DELETE") {
        await adminHardDeleteReviewAPI(id);
        toast.success("Xóa vĩnh viễn bài đánh giá khỏi cơ sở dữ liệu thành công!");
      }

      setDeleteDialogTarget(null);
      handleRefreshData();
    } catch (err: any) {
      console.error("Lỗi khi xử lý xóa đánh giá:", err);
      const msg = err?.response?.data?.message || err?.message || "Không thể thực hiện thao tác xóa.";
      toast.error(typeof msg === "string" ? msg : "Thao tác thất bại");
    }
  };

  const totalReviews = stats?.totalReviews || 0;

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-sm sm:p-8">
      {/* Title Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4 select-none">
        <MessageSquare className="text-primary h-5 w-5" />
        <h3 className="text-sm font-black tracking-wider text-slate-800 uppercase sm:text-base">
          Đánh giá từ khách hàng ({totalReviews})
        </h3>
      </div>

      {/* 1. Review Rating Stats Breakdown Component */}
      <ReviewStatsSummary stats={stats} />

      {/* 2. Rating Filter Tabs Component */}
      <ReviewFilterTabs
        selectedRating={selectedRatingFilter}
        onSelectRating={(rating) => {
          setSelectedRatingFilter(rating);
          setPage(1);
        }}
      />

      {/* 3. Inline Customer Review Input Form Component */}
      <ReviewForm productId={productId} onSubmitSuccess={handleRefreshData} />

      {/* 4. Review List / Empty State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <Loader2 className="text-primary h-6 w-6 animate-spin" />
          <span className="ml-2 text-xs font-bold">Đang tải nhận xét...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xs font-semibold text-slate-400">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 space-y-5">
          {reviews.map((item) => (
            <ReviewItem
              key={item.id}
              item={item}
              isAdmin={isAdmin}
              isMyReview={Boolean(currentUser?.id && item.user?.id === currentUser.id)}
              onRefresh={handleRefreshData}
              onOpenDeleteDialog={(target) => setDeleteDialogTarget(target)}
            />
          ))}
        </div>
      )}

      {/* 5. Pagination Component */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* 6. Confirm Delete / Reject Dialog Modal */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialogTarget}
        onClose={() => setDeleteDialogTarget(null)}
        onConfirm={handleConfirmDeleteDialog}
        title={
          deleteDialogTarget?.type === "ADMIN_HARD_DELETE"
            ? "Xác nhận xóa vĩnh viễn"
            : deleteDialogTarget?.type === "ADMIN_REJECT"
            ? "Xác nhận ẩn bài đánh giá"
            : "Xác nhận xóa bài đánh giá"
        }
        itemName={deleteDialogTarget?.commentSnippet || ""}
        itemType="bài đánh giá"
        warningText={
          deleteDialogTarget?.type === "ADMIN_HARD_DELETE"
            ? "Lưu ý: Thao tác này sẽ xóa vĩnh viễn bài đánh giá khỏi hệ thống."
            : deleteDialogTarget?.type === "ADMIN_REJECT"
            ? "Lưu ý: Bài đánh giá sẽ được chuyển trạng thái REJECTED và ẩn khỏi trang sản phẩm."
            : "Lưu ý: Bài đánh giá của bạn sẽ bị xóa khỏi sản phẩm này."
        }
        confirmButtonText={
          deleteDialogTarget?.type === "ADMIN_HARD_DELETE"
            ? "Xóa vĩnh viễn"
            : deleteDialogTarget?.type === "ADMIN_REJECT"
            ? "Ẩn bài đánh giá"
            : "Xóa đánh giá"
        }
        isHardDelete={false}
      />
    </div>
  );
}
