import React from "react";
import { Star } from "lucide-react";
import type { ReviewStats } from "@/services/review.service";

interface ReviewStatsSummaryProps {
  stats: ReviewStats | null;
}

export default function ReviewStatsSummary({ stats }: ReviewStatsSummaryProps) {
  const avgRating = stats?.averageRating ? Number(stats.averageRating).toFixed(1) : "0.0";
  const totalReviews = stats?.totalReviews || 0;
  const breakdown = stats?.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <div className="grid grid-cols-1 items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50/50 p-5 sm:grid-cols-12 select-none">
      {/* Average Score Box */}
      <div className="flex flex-col items-center justify-center border-b border-slate-200/60 pb-4 sm:col-span-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
        <span className="text-4xl font-black text-slate-800">{avgRating}</span>
        <div className="mt-1 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-4 w-4 ${
                s <= Math.round(Number(avgRating))
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300"
              }`}
            />
          ))}
        </div>
        <span className="mt-1.5 text-xs font-semibold text-slate-400">
          Dựa trên {totalReviews} đánh giá
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-1.5 sm:col-span-8">
        {[5, 4, 3, 2, 1].map((starCount) => {
          const count = breakdown[starCount as keyof typeof breakdown] || 0;
          const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

          return (
            <div key={starCount} className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <span className="w-8 shrink-0 flex items-center gap-1">
                {starCount} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-10 text-right shrink-0 text-slate-400">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
