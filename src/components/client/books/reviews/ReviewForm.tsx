import React, { useState } from "react";
import { Star, Send, Loader2 } from "lucide-react";
import { createReviewAPI } from "@/services/review.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/stores/useToastStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";

interface ReviewFormProps {
  productId: string;
  onSubmitSuccess: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Rất tệ",
  2: "Tệ",
  3: "Bình thường",
  4: "Rất tốt",
  5: "Tuyệt vời",
};

export default function ReviewForm({ productId, onSubmitSuccess }: ReviewFormProps) {
  const currentUser = useAuthStore((state) => state.user);
  const { requireAuth } = useRequireAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    requireAuth(async () => {
      if (!comment.trim()) {
        toast.error("Vui lòng nhập nội dung đánh giá của bạn.");
        return;
      }

      setIsSubmitting(true);
      try {
        await createReviewAPI({
          productId,
          rating,
          comment: comment.trim(),
        });

        toast.success("Cảm ơn bạn đã gửi đánh giá cho sản phẩm!");
        setComment("");
        setRating(5);
        onSubmitSuccess();
      } catch (err: any) {
        console.error("Lỗi gửi đánh giá:", err);
        const msg = err?.response?.data?.message || err?.message || "Không thể gửi đánh giá";
        toast.error(typeof msg === "string" ? msg : "Gửi đánh giá thất bại");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmitReview}
      className="space-y-3.5 rounded-2xl border border-slate-200/70 bg-slate-50/60 p-4 sm:p-5 text-left"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Đánh giá của bạn:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const current = hoverRating || rating;
              return (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= current
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-xs font-bold text-amber-600">
            {RATING_LABELS[hoverRating || rating]}
          </span>
        </div>
      </div>

      {/* Comment textarea */}
      <div className="relative">
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onFocus={() => {
            if (!currentUser) {
              requireAuth(() => {});
            }
          }}
          placeholder="Viết nhận xét của bạn về cuốn sách này..."
          required
          className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-blue-650 flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span>Gửi đánh giá</span>
        </button>
      </div>
    </form>
  );
}
