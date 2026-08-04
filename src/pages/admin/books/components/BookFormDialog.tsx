import React, { useState } from "react";
import { X } from "lucide-react";
import { categoriesData } from "../../../../constants/categoriesData";
import { type Book } from "../../../../constants/booksData";

interface BookFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookData: Omit<Book, "id" | "aiScore">) => void;
}

export default function BookFormDialog({
  isOpen,
  onClose,
  onSubmit
}: BookFormDialogProps) {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    parentCategoryId: "technology",
    category: "Dạy Web & Mobile",
    price: "",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300",
    isNew: false,
    rating: 4.8
  });

  if (!isOpen) return null;

  const activeParentData = categoriesData.find(c => c.id === newBook.parentCategoryId);
  const subCategoryOptions = activeParentData ? activeParentData.categories : [];

  const handleParentCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;
    const parentData = categoriesData.find(c => c.id === parentId);
    const defaultSub = parentData && parentData.categories.length > 0 
      ? parentData.categories[0].name 
      : "Khác";

    setNewBook(prev => ({
      ...prev,
      parentCategoryId: parentId,
      category: defaultSub
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim() || !newBook.price.trim()) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    let formattedPrice = newBook.price.trim();
    if (!formattedPrice.endsWith("đ") && !formattedPrice.endsWith("Đ")) {
      formattedPrice += ".000đ";
    }

    onSubmit({
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      parentCategoryId: newBook.parentCategoryId,
      category: newBook.category,
      price: formattedPrice,
      rating: Number(newBook.rating),
      image: newBook.image.trim(),
      isNew: newBook.isNew
    });

    // Reset fields
    setNewBook({
      title: "",
      author: "",
      parentCategoryId: "technology",
      category: "Dạy Web & Mobile",
      price: "",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300",
      isNew: false,
      rating: 4.8
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 space-y-5 text-left relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight">
            Thêm sách mới vào hệ thống
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Book Title */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
              Tên cuốn sách <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tên sách..."
              value={newBook.title}
              onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          {/* Author */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
              Tác giả <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Nhập tên tác giả..."
              value={newBook.author}
              onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          {/* Grid 2-Column: Parent Category & Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Parent Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
                Danh mục cha
              </label>
              <select
                value={newBook.parentCategoryId}
                onChange={handleParentCategoryChange}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold text-slate-750 outline-none cursor-pointer focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              >
                {categoriesData.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
                Danh mục con
              </label>
              <select
                value={newBook.category}
                onChange={(e) => setNewBook(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-bold text-slate-750 outline-none cursor-pointer focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              >
                {subCategoryOptions.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
                {subCategoryOptions.length === 0 && (
                  <option value="Khác">Khác</option>
                )}
              </select>
            </div>

          </div>

          {/* Grid 2-Column: Price & Rating */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
                Giá bán <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 189.000đ hoặc 189"
                value={newBook.price}
                onChange={(e) => setNewBook(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            {/* Rating */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
                Điểm đánh giá (Rating)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={newBook.rating}
                onChange={(e) => setNewBook(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

          </div>

          {/* Cover Image Link */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1">
              Đường dẫn ảnh bìa (Cover URL)
            </label>
            <input
              type="text"
              placeholder="https://example.com/cover.jpg"
              value={newBook.image}
              onChange={(e) => setNewBook(prev => ({ ...prev, image: e.target.value }))}
              className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          {/* Checkbox: Is New? */}
          <div className="flex items-center gap-2 pt-2 select-none">
            <input
              type="checkbox"
              id="isNew"
              checked={newBook.isNew}
              onChange={(e) => setNewBook(prev => ({ ...prev, isNew: e.target.checked }))}
              className="w-4.5 h-4.5 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer"
            />
            <label htmlFor="isNew" className="text-xs text-slate-600 font-bold cursor-pointer">
              Đánh dấu đây là sách mới phát hành (New Book Tag)
            </label>
          </div>

          {/* Form Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 select-none">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-250 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-blue-700 active:scale-98 transition-all cursor-pointer shadow-sm shadow-blue-500/10"
            >
              Xác nhận thêm
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
