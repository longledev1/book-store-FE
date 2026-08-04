import React from "react";

interface BookStatusBadgeProps {
  isNew: boolean;
}

export default function BookStatusBadge({ isNew }: BookStatusBadgeProps) {
  if (isNew) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider border border-emerald-100">
        Mới
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-wider border border-blue-100">
      Bán chạy
    </span>
  );
}
