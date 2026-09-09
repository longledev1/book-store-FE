import React from "react";
import { BOOK_FORMATS, BOOK_LANGUAGES } from "../../../../constants/product.constants";

interface ProductBookDetailProps {
  bookDetail: {
    id: string;
    publisher: string;
    publishYear: string;
    pageCount: string;
    format: string;
    language: string;
  };
  setBookDetail: React.Dispatch<React.SetStateAction<{
    id: string;
    publisher: string;
    publishYear: string;
    pageCount: string;
    format: string;
    language: string;
  }>>;
}

export default function ProductBookDetail({ bookDetail, setBookDetail }: ProductBookDetailProps) {
  const updateField = (field: string, value: string) => {
    setBookDetail(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30 space-y-3">
      <span className="text-xs font-black text-slate-800 uppercase tracking-tight block border-b border-slate-100 pb-1.5">
        Chi tiết thông tin sách (Book Detail)
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">Nhà xuất bản</label>
          <input
            type="text"
            value={bookDetail.publisher}
            onChange={(e) => updateField("publisher", e.target.value)}
            placeholder="Nhập NXB..."
            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">Năm xuất bản</label>
          <input
            type="number"
            value={bookDetail.publishYear}
            onChange={(e) => updateField("publishYear", e.target.value)}
            placeholder="Ví dụ: 2026..."
            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">Số trang</label>
          <input
            type="number"
            value={bookDetail.pageCount}
            onChange={(e) => updateField("pageCount", e.target.value)}
            placeholder="Số trang..."
            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">Định dạng (Loại bìa)</label>
          <select
            value={bookDetail.format}
            onChange={(e) => updateField("format", e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
          >
            <option value="">-- Chọn loại bìa --</option>
            {BOOK_FORMATS.map((fmt) => (
              <option key={fmt} value={fmt}>
                {fmt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">Ngôn ngữ</label>
          <select
            value={bookDetail.language}
            onChange={(e) => updateField("language", e.target.value)}
            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer"
          >
            <option value="">-- Chọn ngôn ngữ --</option>
            {BOOK_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
