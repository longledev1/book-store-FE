import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookMarked, Package } from "lucide-react";
import {
  getPublicCategoryTreeAPI,
  type CategoryTreeItem,
} from "@/services/category.service";
import { getProductsForClientAPI } from "@/services/product.service";
import { parentCategories, categoriesData } from "@/constants/categoriesData";

interface MegaMenuProps {
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MegaMenu({
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const [categoryTree, setCategoryTree] = useState<CategoryTreeItem[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [subcatProductsMap, setSubcatProductsMap] = useState<
    Record<string, any[]>
  >({});
  const [loadingSubcatIds, setLoadingSubcatIds] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const fetchCategoryTree = async () => {
      try {
        const res: any = await getPublicCategoryTreeAPI();
        const treeData = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        if (treeData.length > 0) {
          setCategoryTree(treeData);
          setActiveCategoryId(treeData[0].id);
        }
      } catch (error) {
        console.warn(
          "Lỗi khi tải cây danh mục công khai, dùng dữ liệu dự phòng:",
          error,
        );
      }
    };

    fetchCategoryTree();
  }, []);

  const isUsingApi = categoryTree.length > 0;
  const activeApiCategory = isUsingApi
    ? categoryTree.find((c) => c.id === activeCategoryId) || categoryTree[0]
    : null;

  const activeMockCategory = !isUsingApi
    ? categoriesData.find((c) => c.id === (activeCategoryId || "technology"))
    : null;

  // Fetch products for each subcategory of active parent category sequentially to prevent HTTP 429 ThrottlerException
  useEffect(() => {
    if (!activeApiCategory?.children || activeApiCategory.children.length === 0)
      return;

    let isMounted = true;

    const fetchSubcatProducts = async () => {
      for (const subcat of activeApiCategory.children!) {
        if (!isMounted) break;
        if (subcatProductsMap[subcat.id]) continue; // cached

        setLoadingSubcatIds((prev) => ({ ...prev, [subcat.id]: true }));
        try {
          const res: any = await getProductsForClientAPI(
            1,
            4,
            undefined,
            subcat.id,
          );
          const list = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : [];

          if (isMounted) {
            setSubcatProductsMap((prev) => ({ ...prev, [subcat.id]: list }));
          }
        } catch (err) {
          console.warn(`Lỗi khi tải sản phẩm cho danh mục ${subcat.name}:`, err);
        } finally {
          if (isMounted) {
            setLoadingSubcatIds((prev) => ({ ...prev, [subcat.id]: false }));
          }
        }

        // Small 60ms delay between requests to respect NestJS Throttler rate limits
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    };

    fetchSubcatProducts();

    return () => {
      isMounted = false;
    };
  }, [activeApiCategory]);

  return (
    <div
      className="animate-in fade-in slide-in-from-top-1 absolute top-16 right-0 left-0 z-45 flex h-[420px] w-full border-b border-slate-200 bg-white shadow-2xl duration-150"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="mx-auto flex h-full w-full max-w-[1440px] px-4 md:px-8">
        {/* Left Panel: Category list */}
        <div className="flex h-full w-80 shrink-0 flex-col overflow-y-auto border-r border-slate-100 bg-slate-50/60 p-5 text-left">
          <h4 className="px-3 pb-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase select-none">
            Danh mục sản phẩm
          </h4>
          <div className="flex flex-col gap-1.5">
            {isUsingApi
              ? categoryTree.map((cat) => {
                  const isCurrent = activeApiCategory?.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveCategoryId(cat.id)}
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        onClose();
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                        isCurrent
                          ? "text-primary border-slate-150 border bg-white shadow-sm"
                          : "text-slate-650 border border-transparent hover:bg-slate-100/50 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isCurrent && (
                        <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                      )}
                    </button>
                  );
                })
              : parentCategories.map((cat) => {
                  const isCurrent =
                    (activeCategoryId || "technology") === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onMouseEnter={() => setActiveCategoryId(cat.id)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                        isCurrent
                          ? "text-primary border-slate-150 border bg-white shadow-sm"
                          : "text-slate-650 border border-transparent hover:bg-slate-100/50 hover:text-slate-900"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isCurrent && (
                        <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                      )}
                    </button>
                  );
                })}
          </div>
        </div>

        {/* Right Panel: Subcategories Detail */}
        <div className="flex h-full flex-grow flex-col overflow-y-auto p-8 text-left">
          {/* Header title */}
          <div className="mb-6 flex shrink-0 items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="text-primary border-primary/5 flex h-7 w-7 items-center justify-center rounded-lg border bg-blue-50">
                <BookMarked className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-slate-800">
                {isUsingApi
                  ? activeApiCategory?.name
                  : activeMockCategory?.name}
              </h3>
            </div>

            <Link
              to={
                isUsingApi && activeApiCategory
                  ? `/books?category=${activeApiCategory.id}`
                  : "/books"
              }
              onClick={onClose}
              className="text-primary text-xs font-bold transition-colors hover:text-blue-700 hover:underline"
            >
              Xem tất cả trong danh mục
            </Link>
          </div>

          {isUsingApi ? (
            activeApiCategory?.children &&
            activeApiCategory.children.length > 0 ? (
              <div className="flex-grow">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                  {activeApiCategory.children.map((subcat) => {
                    const products = subcatProductsMap[subcat.id] || [];
                    const isLoadingProds = loadingSubcatIds[subcat.id];

                    return (
                      <div
                        key={subcat.id}
                        className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left"
                      >
                        <h5 className="border-b border-slate-200/60 pb-1.5 text-xs font-bold tracking-wider text-slate-800 uppercase">
                          {subcat.name}
                        </h5>

                        {/* Products List from API */}
                        {products.length > 0 ? (
                          <ul className="space-y-2.5">
                            {products.map((product) => {
                              const authorName =
                                product.authors?.[0]?.name ||
                                "Tác giả nổi tiếng";

                              return (
                                <li key={product.id}>
                                  <Link
                                    to={`/books/${product.slug || product.id}`}
                                    className="hover:text-primary block max-w-[200px] truncate text-xs font-medium text-slate-600 transition-colors hover:underline"
                                    title={`${product.name} - ${authorName}`}
                                    onClick={onClose}
                                  >
                                    <span className="block truncate font-semibold text-slate-800">
                                      {product.name}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[10px] font-normal text-slate-400">
                                      {authorName}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        ) : isLoadingProds ? (
                          <div className="py-2 text-[10px] font-medium text-slate-400 animate-pulse">
                            Đang tải sản phẩm...
                          </div>
                        ) : (
                          <div className="py-2 text-[10px] italic text-slate-400">
                            Chưa có sản phẩm nào
                          </div>
                        )}

                        <Link
                          to={`/books?category=${subcat.id}`}
                          className="text-primary inline-block pt-1 text-xs font-bold transition-colors hover:text-blue-700 hover:underline"
                          onClick={onClose}
                        >
                          Xem tất cả ({products.length}) →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-grow flex-col items-center justify-center gap-2.5 py-12 text-slate-400">
                <Package className="h-10 w-10 stroke-[1.5] opacity-30" />
                <span className="text-xs font-medium">
                  Chưa có danh mục con trong nhóm này...
                </span>
              </div>
            )
          ) : activeMockCategory?.categories &&
            activeMockCategory.categories.length > 0 ? (
            <div className="flex-grow">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                {activeMockCategory.categories.map((subcat) => (
                  <div key={subcat.id} className="space-y-3">
                    <h5 className="border-b border-slate-100 pb-1.5 text-xs font-bold tracking-wider text-slate-800 uppercase">
                      {subcat.name}
                    </h5>
                    <ul className="space-y-2.5">
                      {subcat.books.map((book) => (
                        <li key={book.id}>
                          <Link
                            to={`/books/${book.id}`}
                            className="hover:text-primary block max-w-[200px] truncate text-xs font-medium text-slate-500 transition-colors hover:underline"
                            title={`${book.title} - ${book.author}`}
                            onClick={onClose}
                          >
                            <span className="block truncate font-semibold text-slate-700">
                              {book.title}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] font-normal text-slate-400">
                              {book.author}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/books?category=${subcat.id}`}
                      className="text-primary inline-block pt-1 text-xs font-bold transition-colors hover:text-blue-700 hover:underline"
                      onClick={onClose}
                    >
                      Xem tất cả
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-grow flex-col items-center justify-center gap-2.5 py-12 text-slate-400">
              <Package className="h-10 w-10 stroke-[1.5] opacity-30" />
              <span className="text-xs font-medium">
                Danh mục đang được cập nhật sản phẩm...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
