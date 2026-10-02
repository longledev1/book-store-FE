import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BookMarked, ChevronRight, Loader2 } from "lucide-react";

import {
  getPublicCategoryTreeAPI,
  type CategoryTreeItem,
} from "../../services/category.service";
import {
  getProductsForClientAPI,
  type Product,
} from "../../services/product.service";
import { resolveMediaUrl } from "../../utils/format";

// Helper to resolve product image from albums or imgUrl
const getProductCoverImage = (book: Product): string => {
  const firstAlbum = book.albums?.[0];
  const albumUrl =
    (firstAlbum as any)?.imageUrl ||
    firstAlbum?.media?.fileUrl ||
    firstAlbum?.media?.url ||
    firstAlbum?.mediaUrl;

  const rawUrl = albumUrl || book.imgUrl;
  const resolved = resolveMediaUrl(rawUrl);

  return resolved || "/mock_data.png";
};

// Components
import SidebarCategories from "../../components/client/books/SidebarCategories";
import BookFilters from "../../components/client/books/BookFilters";
import CatalogBookCard from "../../components/client/books/CatalogBookCard";
import Pagination from "../../components/ui/Pagination";
import CatalogBanner from "../../components/client/books/CatalogBanner";

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subcategoryParam = searchParams.get("subcategory");

  // Category Tree State
  const [categories, setCategories] = useState<CategoryTreeItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  // Filter & Sorting State
  const [sortBy, setSortBy] = useState<string>("latest");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [authorFilter, setAuthorFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Products & Pagination State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 12;

  // Load public category tree on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res: any = await getPublicCategoryTreeAPI();
        const treeData: CategoryTreeItem[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        setCategories(treeData);

        if (treeData.length > 0) {
          if (subcategoryParam) {
            const parent = treeData.find((c) =>
              c.children?.some((s) => s.slug === subcategoryParam || s.id === subcategoryParam)
            );
            if (parent) {
              const sub = parent.children?.find(
                (s) => s.slug === subcategoryParam || s.id === subcategoryParam
              );
              setActiveCategory(parent.slug || parent.id);
              setActiveSubcategory(sub?.slug || sub?.id || subcategoryParam);
            } else {
              setActiveCategory(treeData[0].slug || treeData[0].id);
            }
          } else if (categoryParam) {
            const parent = treeData.find((c) => c.slug === categoryParam || c.id === categoryParam);
            if (parent) {
              setActiveCategory(parent.slug || parent.id);
              setActiveSubcategory("all");
            } else {
              setActiveCategory(treeData[0].slug || treeData[0].id);
            }
          } else {
            setActiveCategory(treeData[0].slug || treeData[0].id);
          }
        }
      } catch (error) {
        console.error("Error loading category tree:", error);
      }
    };

    loadCategories();
  }, []);

  // Sync category state when URL searchParams change
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (subcategoryParam) {
      const parent = categories.find((c) =>
        c.children?.some((s) => s.slug === subcategoryParam || s.id === subcategoryParam)
      );
      if (parent) {
        const sub = parent.children?.find(
          (s) => s.slug === subcategoryParam || s.id === subcategoryParam
        );
        setActiveCategory(parent.slug || parent.id);
        setActiveSubcategory(sub?.slug || sub?.id || subcategoryParam);
      }
    } else if (categoryParam) {
      const parent = categories.find((c) => c.slug === categoryParam || c.id === categoryParam);
      if (parent) {
        setActiveCategory(parent.slug || parent.id);
        setActiveSubcategory("all");
      }
    }
  }, [categoryParam, subcategoryParam, categories]);

  // Find active parent category & subcategory objects
  const activeCatData = Array.isArray(categories)
    ? categories.find((c) => c.slug === activeCategory || c.id === activeCategory)
    : undefined;
  const activeSubcatData = activeCatData?.children?.find(
    (s) => s.slug === activeSubcategory || s.id === activeSubcategory
  );

  // Fetch products from API whenever query params or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let orderBy: string | undefined;
        let sort: string | undefined;

        if (sortBy === "price-asc") {
          orderBy = "price";
          sort = "ASC";
        } else if (sortBy === "price-desc") {
          orderBy = "price";
          sort = "DESC";
        } else if (sortBy === "latest") {
          orderBy = "createdAt";
          sort = "DESC";
        } else if (sortBy === "best-seller") {
          orderBy = "soldCount";
          sort = "DESC";
        }

        // Map selected active subcategory or category slug/id to real Category UUID
        const categoryIdToPass =
          activeSubcategory !== "all" && activeSubcatData
            ? activeSubcatData.id
            : activeCatData
            ? activeCatData.id
            : undefined;

        const res: any = await getProductsForClientAPI(
          currentPage,
          itemsPerPage,
          searchQuery.trim() || undefined,
          categoryIdToPass,
          authorFilter !== "all" ? authorFilter : undefined,
          orderBy,
          sort
        );

        const dataList = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        let list = dataList;
        // Apply client-side price filter if selected
        if (priceFilter !== "all") {
          list = list.filter((p: Product) => {
            if (priceFilter === "under-150") return p.price < 150000;
            if (priceFilter === "150-300") return p.price >= 150000 && p.price <= 300000;
            if (priceFilter === "above-300") return p.price > 300000;
            return true;
          });
        }

        setProducts(list);
        setTotalPages(res?.pagination?.totalPages || 1);
        setTotalItems(res?.pagination?.total || list.length);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    activeCategory,
    activeSubcategory,
    activeCatData,
    activeSubcatData,
    searchQuery,
    priceFilter,
    authorFilter,
    sortBy,
    currentPage,
  ]);

  // Reset pagination on filter parameter change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, activeSubcategory, priceFilter, sortBy, searchQuery, authorFilter]);

  const handleParentCategorySelect = (slugOrId: string) => {
    setActiveCategory(slugOrId);
    setActiveSubcategory("all");
    setSearchQuery("");
    setPriceFilter("all");
    setAuthorFilter("all");
    setSearchParams({ category: slugOrId });
  };

  const handleSubcategorySelect = (parentSlugOrId: string, subcatSlugOrId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCategory(parentSlugOrId);
    setActiveSubcategory(subcatSlugOrId);
    setSearchQuery("");
    setPriceFilter("all");
    setAuthorFilter("all");
    setSearchParams({ category: parentSlugOrId, subcategory: subcatSlugOrId });
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Available authors extracted from currently loaded product list
  const availableAuthors = React.useMemo(() => {
    const authorsSet = new Set<string>();
    products.forEach((p) => {
      const author = p.bookDetail?.author || (p as any).author;
      if (author) authorsSet.add(author);
    });
    return Array.from(authorsSet).sort();
  }, [products]);

  return (
    <div className="bg-slate-50/40 min-h-screen font-sans pb-16">
      {/* Hero Banner Component */}
      <CatalogBanner />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        {/* Main Grid: Left Sidebar & Right Contents */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR: Dynamic Categories Tree Menu */}
          <div className="md:col-span-3 md:sticky md:top-24 z-10">
            <SidebarCategories
              categories={categories}
              activeCategory={activeCategory}
              activeSubcategory={activeSubcategory}
              hoveredCategoryId={hoveredCategoryId}
              setHoveredCategoryId={setHoveredCategoryId}
              onParentSelect={handleParentCategorySelect}
              onSubcatSelect={handleSubcategorySelect}
            />
          </div>

          {/* RIGHT PANEL: Filter bar and Book list */}
          <main className="md:col-span-9 space-y-6 text-left">
            
            {/* Header: Breadcrumb title */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/5 border border-primary/10 flex h-9 w-9 items-center justify-center rounded-2xl text-primary shadow-sm">
                  <BookMarked className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm md:text-base font-extrabold tracking-tight text-slate-800 flex items-center gap-1.5 select-none">
                  <span>{activeCatData?.name || "Danh mục"}</span>
                  {activeSubcategory !== "all" && activeSubcatData && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                      <span className="text-slate-455 font-semibold text-xs">
                        {activeSubcatData.name}
                      </span>
                    </>
                  )}
                </h2>
              </div>
            </div>

            {/* Filter component */}
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

            {/* Product list / Smooth Loading State */}
            <div className="space-y-8 pt-4 min-h-[500px]">
              <div className="text-xs text-slate-400 font-semibold pl-1 select-none flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {loading && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                  )}
                  {loading && products.length === 0 ? (
                    <span>Đang tải danh sách sách...</span>
                  ) : totalItems > 0 ? (
                    <span>Hiển thị {products.length} trong tổng số {totalItems} sản phẩm</span>
                  ) : (
                    <span>Không có sản phẩm nào khớp bộ lọc</span>
                  )}
                </div>
              </div>

              {loading && products.length === 0 ? (
                /* Initial Skeleton Load (only when no products are present yet) */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-3xl border border-slate-200/50 p-4 flex flex-col justify-between h-[360px] animate-pulse"
                    >
                      <div>
                        <div className="rounded-2xl bg-slate-100 aspect-[3/4] mb-4 w-full" />
                        <div className="space-y-2">
                          <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                          <div className="h-3.5 bg-slate-200/80 rounded w-3/4" />
                          <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <div className="h-4 bg-slate-200/70 rounded w-16" />
                        <div className="h-7 bg-slate-100 rounded-xl w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !loading && products.length === 0 ? (
                <div className="py-24 text-center text-slate-450 text-xs font-bold border border-dashed border-slate-200 rounded-3xl bg-white select-none">
                  Không tìm thấy sách nào thỏa mãn bộ lọc hiện tại.
                </div>
              ) : (
                /* Smooth Grid with opacity transition during refetching */
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 transition-opacity duration-300 ${
                    loading ? "opacity-40 pointer-events-none" : "opacity-100"
                  }`}
                >
                  {products.map((book) => {
                    const formattedPrice = new Intl.NumberFormat("vi-VN").format(book.price) + "đ";
                    const authorName = book.bookDetail?.author || (book as any).author || (book as any).authors?.[0]?.name || "Nhiều tác giả";
                    const coverImg = getProductCoverImage(book);

                    return (
                      <CatalogBookCard
                        key={book.id}
                        id={book.slug || book.id}
                        title={book.name}
                        author={authorName}
                        price={formattedPrice}
                        image={coverImg}
                        subcatName={activeSubcatData?.name || activeCatData?.name || "Sách"}
                        isFavorited={!!wishlist[book.id]}
                        rawProduct={book}
                        onToggleFavorite={toggleWishlist}
                      />
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`transition-opacity duration-300 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>

          </main>

        </div>
      </div>
    </div>
  );
}
