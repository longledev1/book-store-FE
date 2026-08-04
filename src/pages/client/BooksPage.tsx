import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BookMarked, ChevronRight } from "lucide-react";

import { categoriesData, parentCategories } from "../../constants/categoriesData";
import { mockBooks } from "../../constants/booksData";

// Components
import SidebarCategories from "../../components/client/books/SidebarCategories";
import BookFilters from "../../components/client/books/BookFilters";
import CatalogBookCard from "../../components/client/books/CatalogBookCard";
import Pagination from "../../components/ui/Pagination";
import CatalogBanner from "../../components/client/books/CatalogBanner";

// Helper to generate full book properties if not present in mockBooks
const getFullBookDetails = (
  bookId: string | number, 
  title: string, 
  author: string, 
  subcatName: string, 
  subcatId: string
) => {
  const found = mockBooks.find(b => b.id === String(bookId));
  if (found) return { ...found, subcatName, subcatId };

  // Fallback to beautiful mock data for enriched books
  const images = [
    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1460518451285-cd3ab43ec357?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=300",
  ];
  
  // Deterministic values based on title length
  const hash = title.length;
  const imageIndex = hash % images.length;
  const priceVal = 120 + (hash % 15) * 15;
  const ratingVal = 4.5 + (hash % 5) * 0.1;

  return {
    id: String(bookId),
    title,
    author,
    parentCategoryId: "",
    category: subcatName,
    subcatName,
    subcatId,
    price: `${priceVal}.000đ`,
    rating: ratingVal,
    image: images[imageIndex],
    isNew: hash % 2 === 0,
    aiScore: 80 + (hash % 20),
  };
};

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  // State for active parent category and subcategory
  const [activeCategory, setActiveCategory] = useState<string>("technology");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  
  // UI Hover state for sidebar categories dropdowns
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  // Filter & Sorting state
  const [sortBy, setSortBy] = useState<string>("latest");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Pagination state (12 products per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Sync activeCategory & activeSubcategory with URL params
  useEffect(() => {
    if (categoryParam) {
      const parentExists = parentCategories.some(c => c.id === categoryParam);
      if (parentExists) {
        setActiveCategory(categoryParam);
        setActiveSubcategory("all");
        setCurrentPage(1);
      }
    } else if (subcategoryParam) {
      // Find parent category containing this subcategory
      const matchingParent = categoriesData.find(cat => 
        cat.categories.some(sub => sub.id === subcategoryParam)
      );
      if (matchingParent) {
        setActiveCategory(matchingParent.id);
        setActiveSubcategory(subcategoryParam);
        setCurrentPage(1);
      }
    }
  }, [categoryParam, subcategoryParam]);

  // Find active parent category data
  const activeCatData = categoriesData.find(c => c.id === activeCategory) || categoriesData[0];

  // Reset pagination when filter params change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSubcategory, priceFilter, sortBy, searchQuery, authorFilter]);

  const handleParentCategorySelect = (id: string) => {
    setActiveCategory(id);
    setActiveSubcategory("all");
    setSearchQuery(""); 
    setPriceFilter("all");
    setAuthorFilter("all");
    setSearchParams({ category: id });
  };

  const handleSubcategorySelect = (subcatId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    setActiveSubcategory(subcatId);
    setSearchQuery("");
    setPriceFilter("all");
    setAuthorFilter("all");
    setSearchParams({ subcategory: subcatId });
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Dynamically extract unique list of authors for the active parent category
  const availableAuthors = React.useMemo(() => {
    const authorsSet = new Set<string>();
    activeCatData.categories.forEach(sub => {
      sub.books.forEach(b => {
        const detail = getFullBookDetails(b.id, b.title, b.author, sub.name, sub.id);
        authorsSet.add(detail.author);
      });
    });
    return Array.from(authorsSet).sort();
  }, [activeCatData]);

  // Get all books under the active parent category, then apply filters & sorting
  const getFilteredBooksList = () => {
    let books: any[] = [];
    
    // Gather all books from all subcategories under active parent
    activeCatData.categories.forEach(sub => {
      sub.books.forEach(b => {
        books.push(getFullBookDetails(b.id, b.title, b.author, sub.name, sub.id));
      });
    });

    // 1. Filter by Subcategory
    if (activeSubcategory !== "all") {
      books = books.filter(b => b.subcatId === activeSubcategory);
    }

    // 1.3. Filter by Author
    if (authorFilter !== "all") {
      books = books.filter(b => b.author === authorFilter);
    }

    // 1.5. Filter by Search Query (Name)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      books = books.filter(b => b.title.toLowerCase().includes(q));
    }

    // 2. Filter by Price
    if (priceFilter !== "all") {
      books = books.filter(book => {
        const priceNum = parseInt(book.price.replace(/\D/g, ""), 10);
        if (priceFilter === "under-150") return priceNum < 150000;
        if (priceFilter === "150-300") return priceNum >= 150000 && priceNum <= 300000;
        if (priceFilter === "above-300") return priceNum > 300000;
        return true;
      });
    }

    // 3. Sort Books
    books.sort((a, b) => {
      const priceA = parseInt(a.price.replace(/\D/g, ""), 10);
      const priceB = parseInt(b.price.replace(/\D/g, ""), 10);

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "best-seller") return b.rating - a.rating;
      
      // Default: latest (new books first, then by ID descending)
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return Number(b.id) - Number(a.id);
    });

    return books;
  };

  const allFilteredBooks = getFilteredBooksList();
  
  // Pagination Calculations
  const totalItems = allFilteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBooks = allFilteredBooks.slice(startIndex, endIndex);

  // Check if we should render the Grouped Layout (matching mockup)
  const isGroupedLayout = activeSubcategory === "all" && searchQuery.trim() === "" && priceFilter === "all" && authorFilter === "all";

  return (
    <div className="bg-slate-50/40 min-h-screen font-sans pb-16">
      
      {/* 0. Hero Banner Component - Full screen width */}
      <CatalogBanner />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        
        {/* Main Grid: Left Sidebar & Right Contents */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Categories Menu with Hover Dropdowns */}
          <div className="md:col-span-3 md:sticky md:top-24 z-10">
            <SidebarCategories
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              hoveredCategoryId={hoveredCategoryId}
              setHoveredCategoryId={setHoveredCategoryId}
              onParentSelect={handleParentCategorySelect}
              onSubcatSelect={handleSubcategorySelect}
            />
          </div>

          {/* RIGHT PANEL: Extracted Filter bar and Grid list */}
          <main className="md:col-span-9 space-y-6 text-left">

            {/* 1. Header: breadcrumb category title */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/5 border border-primary/10 flex h-9 w-9 items-center justify-center rounded-2xl text-primary shadow-sm">
                  <BookMarked className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm md:text-base font-extrabold tracking-tight text-slate-800 flex items-center gap-1.5 select-none">
                  <span>{activeCatData.name}</span>
                  {activeSubcategory !== "all" && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      <span className="text-slate-455 font-semibold text-xs">
                        {activeCatData.categories.find(s => s.id === activeSubcategory)?.name}
                      </span>
                    </>
                  )}
                </h2>
              </div>
            </div>

            {/* 2. Reusable BookFilters component */}
            <BookFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priceFilter={priceFilter}
              setPriceFilter={setPriceFilter}
              authorFilter={authorFilter}
              setAuthorFilter={setAuthorFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              availableAuthors={availableAuthors}
            />

            {/* Render Grouped Layout (4 Columns) */}
            {isGroupedLayout ? (
              <div className="space-y-10 pt-4">
                {activeCatData.categories.map((subcat) => (
                  <div key={subcat.id} className="space-y-4">
                    
                    {/* Subcategory Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="text-xs md:text-sm font-extrabold tracking-wider text-slate-555 uppercase">
                        {subcat.name}
                      </h3>
                      <button
                        onClick={(e) => handleSubcategorySelect(subcat.id, e)}
                        className="text-primary hover:text-blue-700 text-xs font-bold transition-all hover:underline cursor-pointer"
                      >
                        Xem tất cả
                      </button>
                    </div>

                    {/* 4-Column Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {subcat.books.slice(0, 4).map((b) => {
                        const book = getFullBookDetails(b.id, b.title, b.author, subcat.name, subcat.id);
                        return (
                          <CatalogBookCard
                            key={book.id}
                            id={book.id}
                            title={book.title}
                            author={book.author}
                            price={book.price}
                            image={book.image}
                            subcatName={subcat.name}
                            isFavorited={!!wishlist[book.id]}
                            onToggleFavorite={toggleWishlist}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Flat Grid with 4 columns and pagination */
              <div className="space-y-8 pt-4">
                {/* Total items indicator */}
                <div className="text-xs text-slate-400 font-semibold pl-1 select-none">
                  {totalItems > 0 ? (
                    <span>Hiển thị {startIndex + 1}-{endIndex} trong tổng số {totalItems} sản phẩm</span>
                  ) : (
                    <span>Không có sản phẩm nào khớp bộ lọc</span>
                  )}
                </div>

                {paginatedBooks.length === 0 ? (
                  <div className="py-24 text-center text-slate-450 text-xs font-bold border border-dashed border-slate-200 rounded-3xl bg-white select-none">
                    Không tìm thấy sách nào thỏa mãn bộ lọc hiện tại.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {paginatedBooks.map((book) => (
                      <CatalogBookCard
                        key={book.id}
                        id={book.id}
                        title={book.title}
                        author={book.author}
                        price={book.price}
                        image={book.image}
                        subcatName={book.subcatName}
                        isFavorited={!!wishlist[book.id]}
                        onToggleFavorite={toggleWishlist}
                      />
                    ))}
                  </div>
                )}

                {/* Reusable Pagination component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
