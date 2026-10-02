import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  PackageCheck,
} from "lucide-react";

import {
  getProductBySlugForClientAPI,
  getProductByIdForClientAPI,
  getProductsForClientAPI,
  type Product,
} from "../../services/product.service";
import { resolveMediaUrl, formatPrice } from "../../utils/format";
import SectionBadge from "@/components/common/SectionBadge";
import BookCard from "@/components/client/books/BookCard";
import ProductReviewsSection from "@/components/client/books/ProductReviewsSection";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "@/stores/useToastStore";
import { useCartStore } from "@/stores/useCartStore";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER_COVER = "/mock_data.png";

export default function BookDetailPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // State hooks
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isExpandedDescription, setIsExpandedDescription] =
    useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Scroll to top on page mount / param change
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductDetail = async () => {
      if (!paramId) return;
      setIsLoading(true);
      setIsError(false);

      try {
        let productData: any = null;
        const decodedParam = decodeURIComponent(paramId);

        // 1. Check if param is UUID vs Slug
        const isUuid =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
            decodedParam,
          );

        if (isUuid) {
          try {
            const resById = await getProductByIdForClientAPI(decodedParam);
            productData = resById?.data || resById;
          } catch (e1) {
            console.warn(
              "Lỗi khi tìm sản phẩm theo ID, thử chuyển qua Slug:",
              e1,
            );
          }
        }

        if (!productData) {
          try {
            const resBySlug = await getProductBySlugForClientAPI(decodedParam);
            productData = resBySlug?.data || resBySlug;
          } catch (e2) {
            console.warn("Lỗi khi tìm sản phẩm theo Slug, chuyển sang tìm trong danh sách:", e2);
          }
        }

        // Fallback: search in public products list if slug/id endpoints throw BE error
        if (!productData) {
          try {
            const resList = await getProductsForClientAPI(1, 100);
            const list = resList?.data || [];
            productData = list.find(
              (p: any) =>
                p.slug === decodedParam ||
                p.id === decodedParam ||
                p.name.toLowerCase() === decodedParam.toLowerCase(),
            );

            // Product found from public list fallback
            if (productData) {
              console.info("Đã tìm thấy sản phẩm từ danh sách public (Fallback FE).");
            }
          } catch (e3) {
            console.warn("Lỗi khi tìm sản phẩm trong danh sách:", e3);
          }
        }

        if (productData && productData.id) {
          setProduct(productData);
          setActiveImageIndex(0);

          // 2. Fetch recommended books (same category)
          const categoryId = productData.categories?.[0]?.id;
          try {
            const recRes = await getProductsForClientAPI(
              1,
              8,
              undefined,
              categoryId,
            );
            const recList = recRes?.data || [];
            setRecommendedBooks(
              recList.filter((p: any) => p.id !== productData.id),
            );
          } catch (recErr) {
            console.warn("Lỗi khi tải sản phẩm tương tự:", recErr);
          }
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [paramId]);

  // Slider scroll ref & handler
  const sliderRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollAmount = clientWidth * 0.8;
      sliderRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/30 py-32">
        <Loader2 className="text-primary h-9 w-9 animate-spin" />
        <span className="mt-3 text-xs font-bold text-slate-400">
          Đang tải thông tin sản phẩm...
        </span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container-custom py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">
          Không tìm thấy sản phẩm
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Sách bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ khỏi hệ thống.
        </p>
        <Link
          to="/books"
          className="bg-primary mt-4 inline-block rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-700"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  // Extract gallery images from backend albums
  // Index [0] = Cover Image (Mặt định hiển thị trước)
  // Index [1...] = Galley Thumbnails (Hiển thị mảng các ảnh bên dưới album)
  const albumMediaUrls =
    product.albums && product.albums.length > 0
      ? product.albums
          .map((alb: any) =>
            alb.imageUrl
              ? resolveMediaUrl(alb.imageUrl)
              : alb.media?.fileUrl
              ? resolveMediaUrl(alb.media.fileUrl)
              : null,
          )
          .filter(Boolean)
      : [];

  const galleryImages: string[] =
    albumMediaUrls.length > 0
      ? albumMediaUrls
      : [product.imgUrl || PLACEHOLDER_COVER];

  // Selected main image display
  const currentMainImage = galleryImages[activeImageIndex] || galleryImages[0];

  // Thumbnail list shown below (from index 1 onwards, or all images if user wants to click)
  const thumbnailImages = galleryImages;

  // Categories hierarchy
  const parentCategory = product.categories?.[0];
  const subCategory = product.categories?.[1] || parentCategory;

  // Author info
  const primaryAuthor = product.authors?.[0];
  const authorName = primaryAuthor?.name || "Nhiều tác giả";
  const authorSlugOrId = primaryAuthor?.slug || primaryAuthor?.id || "";

  // Pricing
  const originalPriceFormatted = product.price
    ? formatPrice(product.price)
    : "";
  const finalPriceFormatted = product.finalPrice
    ? formatPrice(product.finalPrice)
    : originalPriceFormatted;
  const hasDiscount =
    product.finalPrice &&
    Number(product.finalPrice) < Number(product.price);

  // Specifications
  const bookDetail = product.bookDetail || {};
  const bookCode = `LUM-${product.id.slice(0, 8).toUpperCase()}`;
  const bookPublisher = bookDetail.publisher || "Đang cập nhật";
  const bookPublishYear = bookDetail.publishYear || "2024";
  const bookLanguage = bookDetail.language || "Tiếng Việt";
  const bookFormat = bookDetail.format || "Bìa mềm";
  const bookPageCount = bookDetail.pageCount
    ? `${bookDetail.pageCount} trang`
    : "Đang cập nhật";

  // Description text
  const descriptionText =
    bookDetail.describe ||
    product.describe ||
    (product.shortDescribe
      ? product.shortDescribe.includes("Tác phẩm được đánh giá cực kỳ cao")
        ? product.shortDescribe
        : `${product.shortDescribe} Tác phẩm được đánh giá cực kỳ cao.`
      : "Chưa có nội dung mô tả chi tiết cho cuốn sách này.");

  return (
    <div className="min-h-screen bg-slate-50/30 pt-8 pb-16 text-left font-sans">
      <div className="container-custom">
        {/* Breadcrumb Navigation link */}
        <div className="mb-8 flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
          <Link to="/books" className="hover:text-primary transition-colors">
            Cửa hàng sách
          </Link>
          {parentCategory && (
            <>
              <span>/</span>
              <Link
                to={`/books?category=${parentCategory.id}`}
                className="hover:text-primary transition-colors"
              >
                {parentCategory.name}
              </Link>
            </>
          )}
          {subCategory && subCategory.id !== parentCategory?.id && (
            <>
              <span>/</span>
              <Link
                to={`/books?category=${subCategory.id}`}
                className="hover:text-primary transition-colors"
              >
                {subCategory.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="max-w-[200px] truncate font-bold text-slate-600">
            {product.name}
          </span>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: Gallery & CTA Buttons - Narrower (col-span-4) & Sticky */}
          <div className="z-10 space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            {/* Big Main Display Image (Index [0] default) */}
            <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-3xl border border-slate-200/50 bg-white shadow-sm">
              <img
                src={currentMainImage || PLACEHOLDER_COVER}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_COVER;
                }}
              />

              {/* Floating Favorite Heart button */}
              <button
                onClick={() => setIsFavorited((prev) => !prev)}
                className="absolute top-4 right-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow transition-all hover:bg-slate-50 active:scale-90"
              >
                <Heart
                  className={`h-4.5 w-4.5 transition-colors ${
                    isFavorited
                      ? "fill-rose-500 text-rose-500"
                      : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Gallery (Album Index [0] cover + Index [1...] gallery thumbnails below) */}
            {thumbnailImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2 select-none md:gap-3">
                {thumbnailImages.slice(0, 5).map((img, idx) => {
                  const isSelected = activeImageIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border bg-white transition-all ${
                        isSelected
                          ? "border-primary ring-primary/10 scale-98 ring-2"
                          : "border-slate-200/60 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={img || PLACEHOLDER_COVER}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_COVER;
                        }}
                      />
                    </button>
                  );
                })}

                {thumbnailImages.length > 5 && (
                  <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border border-transparent bg-[#3F3F46] text-white shadow-sm select-none">
                    <span className="text-xs font-black sm:text-sm">
                      +{thumbnailImages.length - 5}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between rounded-3xl border border-slate-200/50 bg-white p-4 shadow-sm select-none">
              <span className="text-slate-455 pl-1 text-xs font-bold tracking-wider uppercase">
                Số lượng mua:
              </span>
              <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-slate-50 px-2 py-1">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  className="text-slate-550 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-200/60"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-black text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="text-slate-550 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-slate-200/60"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-col gap-4 select-none sm:flex-row">
              {/* Add to Cart button */}
              <button
                onClick={() => {
                  requireAuth(() => {
                    if (product) {
                      const firstAlbum = product.albums?.[0];
                      const coverUrl = (firstAlbum as any)?.imageUrl
                        ? resolveMediaUrl((firstAlbum as any).imageUrl)
                        : firstAlbum?.media?.fileUrl
                        ? resolveMediaUrl(firstAlbum.media.fileUrl)
                        : product.imgUrl || PLACEHOLDER_COVER;

                      addItem(
                        {
                          id: product.slug || product.id,
                          productId: product.id,
                          name: product.name,
                          slug: product.slug || product.id,
                          price: Number(product.price) || 0,
                          finalPrice: Number(product.finalPrice) || Number(product.price) || 0,
                          image: coverUrl,
                          category: parentCategory?.name || "Sách",
                        },
                        quantity
                      );
                      toast.success(`Đã thêm ${quantity} cuốn "${product.name}" vào giỏ hàng!`);
                    }
                  });
                }}
                className="flex flex-grow cursor-pointer items-center justify-center gap-2 rounded-2xl border border-indigo-200/50 bg-[#EEF2FF] px-6 py-3.5 font-extrabold text-[#4F46E5] shadow-sm transition-all hover:bg-[#E0E7FF] hover:shadow active:scale-98"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                <span>Thêm vào giỏ</span>
              </button>

              {/* Buy Now button */}
              <button
                onClick={() => {
                  requireAuth(() => {
                    if (product) {
                      const firstAlbum = product.albums?.[0];
                      const coverUrl = (firstAlbum as any)?.imageUrl
                        ? resolveMediaUrl((firstAlbum as any).imageUrl)
                        : firstAlbum?.media?.fileUrl
                        ? resolveMediaUrl(firstAlbum.media.fileUrl)
                        : product.imgUrl || PLACEHOLDER_COVER;

                      addItem(
                        {
                          id: product.slug || product.id,
                          productId: product.id,
                          name: product.name,
                          slug: product.slug || product.id,
                          price: Number(product.price) || 0,
                          finalPrice: Number(product.finalPrice) || Number(product.price) || 0,
                          image: coverUrl,
                          category: parentCategory?.name || "Sách",
                        },
                        quantity
                      );
                      navigate("/checkout");
                    }
                  });
                }}
                className="bg-primary flex flex-grow cursor-pointer items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-extrabold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98"
              >
                <span>Mua ngay</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Product info, Spec table & Description */}
          <div className="space-y-6 lg:col-span-8">
            {/* BOX 1: Core details & Pricing */}
            <div className="space-y-5 rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-sm sm:p-8">
              <h1 className="text-xl leading-snug font-black tracking-tight text-slate-800 uppercase sm:text-2xl">
                {product.name}
              </h1>

              {/* Short Description */}
              {product.shortDescribe && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed italic border-l-2 border-primary/40 pl-3 py-0.5">
                  {product.shortDescribe}
                </p>
              )}

              {/* Author & Cover Meta */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-slate-100 pb-4 text-xs font-semibold sm:grid-cols-2 sm:text-sm">
                <p className="text-slate-455">
                  Tác giả:{" "}
                  {authorSlugOrId ? (
                    <Link
                      to={`/author/${authorSlugOrId}`}
                      className="text-primary cursor-pointer font-bold hover:underline"
                    >
                      {authorName}
                    </Link>
                  ) : (
                    <span className="font-bold text-slate-800">
                      {authorName}
                    </span>
                  )}
                </p>
                <p className="text-slate-455">
                  Hình thức bìa:{" "}
                  <span className="font-bold text-slate-800">
                    {bookFormat}
                  </span>
                </p>
              </div>

              {/* Rating stars & counts */}
              <div className="flex flex-wrap items-center gap-3 select-none">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="fill-warning text-warning h-4 w-4"
                    />
                  ))}
                </div>
                <span className="text-warning cursor-pointer text-xs font-bold hover:underline">
                  (5.0 đánh giá)
                </span>
                <span className="text-xs text-slate-300">|</span>
                <span className="text-slate-455 text-xs font-bold flex items-center gap-1">
                  <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Đã bán {product.soldCount || 0}
                </span>
                <span className="text-xs text-slate-300">|</span>
                <span className="text-xs font-bold text-slate-400">
                  Tồn kho: {product.stockQuantity ?? 0}
                </span>
              </div>

              {/* Pricing details */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-primary text-3xl font-black sm:text-4xl">
                  {finalPriceFormatted}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    {originalPriceFormatted}
                  </span>
                )}
              </div>
            </div>

            {/* BOX 2: Spec Details Table */}
            <div className="space-y-4 rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-sm sm:p-8">
              <h3 className="text-primary border-b border-slate-100 pb-3 text-sm font-black tracking-wider uppercase select-none md:text-base">
                Thông tin chi tiết
              </h3>

              <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Mã sản phẩm
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookCode}
                  </span>
                </div>
                <div className="grid grid-cols-12 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Tác giả
                  </span>
                  <span className="col-span-8 font-bold">
                    {authorSlugOrId ? (
                      <Link
                        to={`/author/${authorSlugOrId}`}
                        className="text-primary cursor-pointer hover:underline"
                      >
                        {authorName}
                      </Link>
                    ) : (
                      <span>{authorName}</span>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Nhà xuất bản
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookPublisher}
                  </span>
                </div>
                <div className="grid grid-cols-12 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Năm xuất bản
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookPublishYear}
                  </span>
                </div>
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Ngôn ngữ
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookLanguage}
                  </span>
                </div>
                <div className="grid grid-cols-12 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Số trang
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookPageCount}
                  </span>
                </div>
                <div className="grid grid-cols-12 bg-slate-50/20 p-3.5 text-xs font-semibold sm:text-sm">
                  <span className="text-slate-455 col-span-4 font-medium">
                    Hình thức
                  </span>
                  <span className="col-span-8 font-bold text-slate-800">
                    {bookFormat}
                  </span>
                </div>
              </div>
            </div>

            {/* BOX 3: Description Block with Read-More collapse feature */}
            <div className="space-y-4 rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-sm sm:p-8">
              <h3 className="text-primary border-b border-slate-100 pb-3 text-sm font-black tracking-wider uppercase select-none md:text-base">
                Mô tả sản phẩm
              </h3>

              <div className="relative space-y-3">
                {/* Truncated container */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpandedDescription ? "max-h-[2000px]" : "max-h-36"
                  }`}
                >
                  <h4 className="mb-3 text-sm leading-snug font-extrabold text-slate-800 sm:text-base">
                    {product.name}
                  </h4>

                  <p className="text-xs leading-relaxed font-medium whitespace-pre-line text-slate-500 sm:text-sm">
                    {descriptionText}
                  </p>

                  {/* Faded overlay at bottom when collapsed */}
                  {!isExpandedDescription && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>

                {/* Read more toggle button */}
                <button
                  onClick={() => setIsExpandedDescription((prev) => !prev)}
                  className="text-primary flex cursor-pointer items-center gap-1 pt-1 text-xs font-black transition-colors select-none hover:text-blue-700"
                >
                  <span>
                    {isExpandedDescription
                      ? "Thu gọn mô tả"
                      : "Xem thêm mô tả"}
                  </span>
                  {isExpandedDescription ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* BOX 4: Customer Reviews Section */}
            <ProductReviewsSection productId={product.id} />
          </div>
        </div>

        {/* Recommended Books Section Slider */}
        {recommendedBooks.length > 0 && (
          <div className="mt-16 border-t border-slate-200/60 pt-10 text-left">
            <div className="mb-8 flex items-center justify-between select-none">
              <SectionBadge title="Sản phẩm tương tự" />

              {/* Navigation buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              ref={sliderRef}
              className="flex snap-x snap-mandatory scrollbar-none gap-5 overflow-x-auto scroll-smooth pb-4"
            >
              {recommendedBooks.map((item: any) => {
                const firstAlbum = item.albums?.[0];
                const itemCover = firstAlbum?.imageUrl
                  ? resolveMediaUrl(firstAlbum.imageUrl)
                  : firstAlbum?.media?.fileUrl
                  ? resolveMediaUrl(firstAlbum.media.fileUrl)
                  : item.imgUrl || PLACEHOLDER_COVER;

                const itemAuthor =
                  item.authors?.[0]?.name || "Nhiều tác giả";
                const itemCategory =
                  item.categories?.[0]?.name || "Sách";

                return (
                  <div
                    key={item.id}
                    className="max-w-[280px] min-w-[240px] flex-shrink-0 snap-start sm:min-w-[280px]"
                  >
                    <BookCard
                      id={item.id}
                      title={item.name}
                      author={item.authorName || itemAuthor}
                      category={itemCategory}
                      price={formatPrice(item.finalPrice || item.price)}
                      rating={5}
                      image={itemCover}
                      isNew={item.isVerified}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
