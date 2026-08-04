import React, { useState } from "react";
import { Plus } from "lucide-react";

import { mockBooks, type Book } from "../../../constants/booksData";
import { useDebounce } from "../../../hooks/useDebounce";

// Local Sub-components from nested components/ directory
import BookFilters from "./components/BookFilters";
import BookTable from "./components/BookTable";
import BookFormDialog from "./components/BookFormDialog";

export default function BookManagementPage() {
  // Local list state starting with initial mockBooks
  const [books, setBooks] = useState<Book[]>(mockBooks);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Pagination state (6 books per page for demo readability)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Add Book Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Filter books list based on search and parent category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
                          book.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || book.parentCategoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBooks = filteredBooks.slice(startIndex, totalItems > 0 ? endIndex : 0);

  const handleAddBook = (bookData: Omit<Book, "id" | "aiScore">) => {
    const createdBook: Book = {
      ...bookData,
      id: String(books.length + 1),
      aiScore: 90
    };

    setBooks(prev => [createdBook, ...prev]);
    setIsModalOpen(false);
    setCurrentPage(1); // Jump back to page 1 to show the new book
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này khỏi hệ thống?")) {
      setBooks(prev => prev.filter(b => b.id !== id));
      setCurrentPage(1);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight uppercase">
            Quản lý danh sách sách
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-0.5 select-none">
            Tổng cộng có {books.length} cuốn sách trong hệ thống.
          </p>
        </div>

        {/* Add new book button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-500/10 self-start sm:self-auto active:scale-98 select-none"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Thêm sách mới</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <BookFilters
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        categoryFilter={categoryFilter}
        onCategoryChange={(val) => { setCategoryFilter(val); setCurrentPage(1); }}
      />

      {/* 3. Table Container */}
      <BookTable
        books={paginatedBooks}
        onDelete={handleDeleteBook}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 5. ADD NEW BOOK MODAL FORM */}
      <BookFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddBook}
      />

    </div>
  );
}
