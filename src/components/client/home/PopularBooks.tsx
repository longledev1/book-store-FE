import React, { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

import SectionBadge from "@/components/common/SectionBadge";
import BookCard from "@/components/client/books/BookCard";

import { getProductsForClientAPI, type Product } from "@/services/product.service";
import { getPublicCategoryTreeAPI, type CategoryTreeItem } from "@/services/category.service";
import { resolveMediaUrl, formatPrice } from "@/utils/format";
import { PLACEHOLDER_BOOK_IMAGE } from "@/constants/placeholders";
import { POPULAR_TABS } from "@/constants/product.constants";

export default function PopularBooks() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [categoriesTree, setCategoriesTree] = useState<CategoryTreeItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // 1. Tải cây danh mục để lấy ID thực tế trong DB
  useEffect(() => {
    let isMounted = true;
    const fetchTree = async () => {
      try {
        const res = await getPublicCategoryTreeAPI();
        const treeData = (res as any)?.data || res || [];
        if (isMounted && Array.isArray(treeData)) {
          setCategoriesTree(treeData);
        }
      } catch (err) {
        console.warn("Lỗi khi tải danh mục cho PopularBooks:", err);
      }
    };
    fetchTree();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Tìm categoryId tương ứng với Tab được chọn
  const getCategoryIdForTab = (tabId: string): string | undefined => {
    if (tabId === "all") return undefined;
    const currentTab = POPULAR_TABS.find((t) => t.id === tabId);
    if (!currentTab?.keyword) return undefined;

    const kw = currentTab.keyword.toUpperCase();

    const searchNode = (items: CategoryTreeItem[]): CategoryTreeItem | undefined => {
      for (const item of items) {
        if (item.name.toUpperCase().includes(kw)) {
          return item;
        }
        if (item.children && item.children.length > 0) {
          const childMatch = searchNode(item.children);
          if (childMatch) return childMatch;
        }
      }
      return undefined;
    };

    return searchNode(categoriesTree)?.id;
  };

  // 3. Tải danh sách sách theo categoryId hoặc toàn bộ
  useEffect(() => {
    let isMounted = true;
    const fetchPopularProducts = async () => {
      setIsLoading(true);
      try {
        const categoryId = getCategoryIdForTab(activeTab);
        const res = await getProductsForClientAPI(
          1,
          8,
          undefined,
          categoryId,
          undefined,
          "soldCount",
          "DESC"
        );
        const dataList = res?.data || [];
        if (isMounted) {
          setProducts(dataList);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách phổ biến:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPopularProducts();
    return () => {
      isMounted = false;
    };
  }, [activeTab, categoriesTree]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50/50 border-b border-border-light font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
        
        {/* Header: Title on Left, Category Tabs on Right */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
          <div className="text-left space-y-3 max-w-xl">
            <SectionBadge title="Sách phổ biến & Bán chạy" />
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
              Những tác phẩm xuất sắc được cộng đồng độc giả yêu thích và lựa chọn nhiều nhất tại LuminaBook.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-full border border-border-light shadow-sm shrink-0 self-start lg:self-auto">
            {POPULAR_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-text hover:text-neutral-dark"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Popular Books Grid */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl bg-white">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span>Đang tải danh sách sách phổ biến...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-3xl bg-white">
            Hiện chưa có sách phổ biến thuộc thể loại này.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((book) => {
              const firstAlbum = book.albums?.[0];
              const coverUrl = (firstAlbum as any)?.imageUrl
                ? resolveMediaUrl((firstAlbum as any).imageUrl)
                : firstAlbum?.media?.fileUrl
                ? resolveMediaUrl(firstAlbum.media.fileUrl)
                : book.imgUrl || PLACEHOLDER_BOOK_IMAGE;
              const authorName = (book as any).authors?.[0]?.name || "Nhiều tác giả";
              const categoryName = (book as any).categories?.[0]?.name || "Sách";
              const bookPrice = formatPrice(book.finalPrice || book.price || 0);

              return (
                <BookCard
                  key={book.id}
                  id={book.slug || book.id}
                  title={book.name}
                  author={authorName}
                  category={categoryName}
                  price={bookPrice}
                  rating={(book as any).rating || 5.0}
                  image={coverUrl}
                  isNew={book.isVerified}
                  isFavorited={!!wishlist[book.id]}
                  rawProduct={book}
                  onToggleFavorite={toggleWishlist}
                />
              );
            })}
          </div>
        )}

        {/* Bottom Call to Action Button */}
        <div className="pt-4 text-center">
          <Link
            to="/books"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-650 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
          >
            <span>Xem tất cả sách phổ biến</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}



