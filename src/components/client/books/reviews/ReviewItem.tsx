import React, { useState } from "react";
import {
  Star,
  CheckCircle,
  Trash2,
  Edit3,
  EyeOff,
  ShieldCheck,
  CornerDownRight,
  X,
} from "lucide-react";
import {
  adminReplyReviewAPI,
  adminUpdateReviewAPI,
  type ReviewItem as ReviewItemType,
} from "@/services/review.service";
import { formatDate } from "@/lib/formatDate";
import { toast } from "@/stores/useToastStore";

interface ReviewItemProps {
  item: ReviewItemType;
  isAdmin: boolean;
  isMyReview: boolean;
  onRefresh: () => void;
  onOpenDeleteDialog: (target: {
    id: string;
    commentSnippet: string;
    type: "OWNER_DELETE" | "ADMIN_REJECT" | "ADMIN_HARD_DELETE";
  }) => void;
}

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";

export default function ReviewItem({
  item,
  isAdmin,
  isMyReview,
  onRefresh,
  onOpenDeleteDialog,
}: ReviewItemProps) {
  // Admin Action States
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(item.rating);
  const [editComment, setEditComment] = useState(item.comment);

  // Admin Submit Reply
  const handleAdminSubmitReply = async () => {
    if (!replyText.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    try {
      await adminReplyReviewAPI(item.id, replyText.trim());
      toast.success("Phản hồi đánh giá thành công!");
      setIsReplying(false);
      setReplyText("");
      onRefresh();
    } catch (err: any) {
      console.error("Lỗi admin phản hồi:", err);
      toast.error("Gửi phản hồi thất bại.");
    }
  };

  // Admin Save Edit
  const handleAdminSaveEdit = async () => {
    if (!editComment.trim()) {
      toast.error("Nội dung đánh giá không được để trống.");
      return;
    }
    try {
      await adminUpdateReviewAPI(item.id, {
        rating: editRating,
        comment: editComment.trim(),
      });
      toast.success("Cập nhật bài đánh giá thành công!");
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      console.error("Lỗi admin sửa đánh giá:", err);
      toast.error("Không thể sửa bài đánh giá.");
    }
  };

  return (
    <div className="pt-5 space-y-3 text-left">
      {/* User Header & Toolbar */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={item.user?.avatarUrl || DEFAULT_AVATAR}
            alt={item.user?.fullName || "Khách hàng"}
            className="h-10 w-10 rounded-full object-cover border border-slate-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-xs font-black text-slate-800">
                {item.user?.fullName || "Khách hàng mua sách"}
              </h5>
              {item.isPurchased && (
                <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100">
                  <CheckCircle className="h-3 w-3" /> Đã mua hàng
                </span>
              )}
            </div>

            {/* Stars & Date */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3.5 w-3.5 ${
                      s <= item.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-medium text-slate-400">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions Toolbar for Owner or Admin */}
        <div className="flex items-center gap-2 select-none">
          {isAdmin && (
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {/* Admin Sửa */}
              <button
                onClick={() => {
                  setIsEditing(true);
                  setEditRating(item.rating);
                  setEditComment(item.comment);
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
                title="Admin chỉnh sửa bài viết này"
              >
                <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                <span>Sửa</span>
              </button>

              {/* Admin Phản hồi */}
              <button
                onClick={() => {
                  setIsReplying(true);
                  setReplyText(item.adminReply || "");
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
                title="Admin phản hồi đánh giá"
              >
                <CornerDownRight className="h-3.5 w-3.5 text-emerald-600" />
                <span>Phản hồi</span>
              </button>

              {/* Admin Ẩn (REJECTED) */}
              <button
                onClick={() =>
                  onOpenDeleteDialog({
                    id: item.id,
                    commentSnippet: item.comment,
                    type: "ADMIN_REJECT",
                  })
                }
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-amber-700 hover:bg-amber-100/60 transition-all cursor-pointer"
                title="Chuyển trạng thái REJECTED (Ẩn đánh giá này)"
              >
                <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                <span>Ẩn</span>
              </button>

              {/* Admin Xóa vĩnh viễn (Hard Delete) */}
              <button
                onClick={() =>
                  onOpenDeleteDialog({
                    id: item.id,
                    commentSnippet: item.comment,
                    type: "ADMIN_HARD_DELETE",
                  })
                }
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200/60 transition-all cursor-pointer"
                title="Xóa vĩnh viễn khỏi CSDL (Hard Delete)"
              >
                <Trash2 className="h-3.5 w-3.5 text-slate-500" />
                <span>Xóa vĩnh viễn</span>
              </button>
            </div>
          )}

          {!isAdmin && isMyReview && (
            <button
              onClick={() =>
                onOpenDeleteDialog({
                  id: item.id,
                  commentSnippet: item.comment,
                  type: "OWNER_DELETE",
                })
              }
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
              title="Xóa đánh giá của bạn"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Review Body (or Admin Edit Form) */}
      {isEditing ? (
        <div className="ml-13 space-y-3 rounded-2xl border border-blue-200 bg-blue-50/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-blue-700 uppercase">
              Admin Chỉnh sửa bài đánh giá
            </span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Rating picker for Edit */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Số sao:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setEditRating(star)}
                  className="cursor-pointer p-0.5"
                >
                  <Star
                    className={`h-4 w-4 ${
                      star <= editRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Textarea for Edit */}
          <textarea
            rows={3}
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 outline-none focus:border-primary"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAdminSaveEdit}
              className="bg-primary hover:bg-blue-650 rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-sm cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      ) : (
        <div className="pl-13 space-y-1">
          {item.title && (
            <h6 className="text-xs font-bold text-slate-800">{item.title}</h6>
          )}
          <p className="text-xs leading-relaxed text-slate-600 font-medium whitespace-pre-line">
            {item.comment}
          </p>
        </div>
      )}

      {/* Admin Reply Input Box */}
      {isReplying && (
        <div className="ml-13 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-700 uppercase flex items-center gap-1.5">
              <CornerDownRight className="h-4 w-4" /> Admin Phản hồi bài đánh giá
            </span>
            <button
              onClick={() => setIsReplying(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Nhập nội dung câu trả lời từ Admin..."
            className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReplying(false)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAdminSubmitReply}
              className="bg-emerald-600 hover:bg-emerald-700 rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-sm cursor-pointer"
            >
              Gửi phản hồi
            </button>
          </div>
        </div>
      )}

      {/* Existing Admin Reply Display */}
      {item.adminReply && !isReplying && (
        <div className="ml-13 rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs text-left space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary font-bold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Phản hồi từ LuminaBook Admin</span>
              {item.adminReplyAt && (
                <span className="text-[10px] font-semibold text-slate-400">
                  • {formatDate(item.adminReplyAt)}
                </span>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setIsReplying(true);
                  setReplyText(item.adminReply || "");
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Sửa phản hồi
              </button>
            )}
          </div>
          <p className="text-slate-600 font-medium">{item.adminReply}</p>
        </div>
      )}
    </div>
  );
}
