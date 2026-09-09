import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Calendar, BookOpen, Loader2 } from "lucide-react";

import {
  getAuthorBySlugForClientAPI,
  getAuthorByIdForClientAPI,
  getAuthorsForClientAPI,
  type Author,
} from "../../services/author.service";
import {
  getProductsForClientAPI,
  type Product,
} from "../../services/product.service";
import { resolveMediaUrl, formatPrice } from "../../utils/format";
import SectionBadge from "../../components/client/SectionBadge";
import BookCard from "../../components/client/BookCard";
import AuthorAvatar from "../../components/common/AuthorAvatar";

export default function AuthorDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [author, setAuthor] = useState<Author | null>(null);
  const [publishedBooks, setPublishedBooks] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAuthorAndBooks = async () => {
      if (!name) return;
      setIsLoading(true);
      setIsError(false);

      try {
        let authorData: Author | null = null;
        const decodedParam = decodeURIComponent(name);

        // 1. Fetch author detail by slug or ID or search in list
        const isUuid =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
            decodedParam,
          );

        if (isUuid) {
          try {
            const resById = await getAuthorByIdForClientAPI(decodedParam);
            authorData = resById?.data || resById;
          } catch (e1) {
            console.warn(
              "Lỗi khi tìm tác giả theo ID, chuyển sang tìm theo slug/list:",
              e1,
            );
          }
        } else {
          try {
            const resBySlug = await getAuthorBySlugForClientAPI(decodedParam);
            authorData = resBySlug?.data || resBySlug;
          } catch (e2) {
            console.warn(
              "Lỗi khi tìm tác giả theo Slug, chuyển sang tìm theo list:",
              e2,
            );
          }
        }

        if (!authorData) {
          try {
            const resList = await getAuthorsForClientAPI(1, 100);
            const list = resList.data || [];
            const lowerParam = decodedParam.toLowerCase();
            authorData =
              list.find(
                (a) =>
                  a.id === decodedParam ||
                  a.slug === decodedParam ||
                  a.name.toLowerCase() === lowerParam,
              ) || null;
          } catch (e3) {
            console.error("Lỗi khi tìm tác giả trong danh sách:", e3);
          }
        }

        if (authorData && authorData.id) {
          setAuthor(authorData);

          // 2. Fetch books by authorId
          const booksRes = await getProductsForClientAPI(
            1,
            50,
            undefined,
            undefined,
            authorData.id,
          );
          setPublishedBooks(booksRes.data || []);
        } else {
          setIsError(true);
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin tác giả:", err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorAndBooks();
  }, [name]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50/30 py-32">
        <Loader2 className="text-primary h-9 w-9 animate-spin" />
        <span className="mt-3 text-xs font-bold text-slate-400">
          Đang tải thông tin tác giả...
        </span>
      </div>
    );
  }

  if (isError || !author) {
    return (
      <div className="container-custom py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">
          Không tìm thấy tác giả
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Thông tin tác giả bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ.
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

  const avatarUrl = author.avatar?.fileUrl
    ? resolveMediaUrl(author.avatar.fileUrl)
    : undefined;

  console.log("Book data for author:", publishedBooks); // Debugging log

  return (
    <div className="min-h-screen bg-slate-50/30 pt-8 pb-16 text-left font-sans">
      <div className="container-custom">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/books" className="hover:text-primary transition-colors">
            Cửa hàng sách
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-600">
            Tác giả {author.name}
          </span>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Author Profile Card (Sticky) */}
          <aside className="z-10 space-y-6 lg:sticky lg:top-24 lg:col-span-4">
            <div className="space-y-6 rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm">
              {/* Avatar & Name block */}
              <div className="space-y-3.5 text-center">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-slate-100 bg-slate-900 shadow-sm sm:h-32 sm:w-32">
                  <AuthorAvatar
                    src={avatarUrl}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg font-black tracking-tight text-slate-800 uppercase sm:text-xl">
                    {author.name}
                  </h1>
                </div>
              </div>

              {/* Biography block */}
              <div className="space-y-2 border-t border-slate-100 pt-2">
                <h3 className="text-primary text-xs font-black tracking-wider uppercase select-none sm:text-sm">
                  Giới thiệu tác giả
                </h3>
                <p className="text-xs leading-relaxed font-medium whitespace-pre-line text-slate-500 sm:text-sm">
                  {author.describe ||
                    "Chưa có thông tin giới thiệu chi tiết cho tác giả này."}
                </p>
              </div>
            </div>
          </aside>

          {/* RIGHT COLUMN: Published Books */}
          <main className="space-y-6 lg:col-span-8">
            {/* Header info */}
            <div className="flex items-center justify-between rounded-3xl border border-slate-200/50 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/5 border-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-2xl border shadow-sm">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <div className="flex items-center gap-1.5 text-sm font-extrabold text-slate-800 select-none">
                  <SectionBadge title="Tác phẩm đã phát hành" />
                </div>
              </div>
              <span className="pl-3 text-xs font-bold text-slate-400 select-none">
                Tìm thấy {publishedBooks.length} cuốn sách
              </span>
            </div>

            {/* Books Grid */}
            {publishedBooks.length === 0 ? (
              <div className="text-slate-450 rounded-3xl border border-dashed border-slate-200 bg-white py-24 text-center text-xs font-bold select-none">
                Hiện tại chưa có tác phẩm nào của tác giả này trên hệ thống.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {publishedBooks.map((product) => {
                  const coverImage = product.albums?.[0]?.media?.fileUrl
                    ? resolveMediaUrl(product.albums[0].media.fileUrl)
                    : product.imgUrl || "";

                  const categoryName = product.categories?.[0]?.name || "Sách";

                  return (
                    <BookCard
                      key={product.id}
                      id={product.id}
                      title={product.name}
                      author={author.name}
                      category={categoryName}
                      price={formatPrice(product.price)}
                      rating={5}
                      image={coverImage}
                      isNew={product.isVerified}
                    />
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
