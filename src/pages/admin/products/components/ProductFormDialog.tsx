import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  createProductAPI,
  updateProductAPI,
  getProductByIdAPI,
  type Product,
  type CreateProductPayload,
} from "../../../../services/product.service";
import { getCategoryTreeAPI } from "../../../../services/category.service";
import { getAuthorsAPI, type Author } from "../../../../services/author.service";
import { productSchema, type ProductFormInput } from "../../../../validation/product.validation";
import { generateSlug } from "../../../../utils/generateSlug";
import { toast } from "../../../../stores/useToastStore";
import { useDebounce } from "../../../../hooks/useDebounce";

// Import Refactored Sub-components
import ProductBasicInfo from "./ProductBasicInfo";
import ProductPricingStock from "./ProductPricingStock";
import ProductCategorySelector from "./ProductCategorySelector";
import ProductAuthorSelector from "./ProductAuthorSelector";
import ProductBookDetail from "./ProductBookDetail";
import ProductAlbumManager from "./ProductAlbumManager";
import ProductFormFooter from "./ProductFormFooter";

interface ProductFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productToEdit?: Product | null;
}

export default function ProductFormDialog({
  isOpen,
  onClose,
  onSuccess,
  productToEdit = null,
}: ProductFormDialogProps) {
  // Album state (combining mediaId, displayOrder and the Media details object)
  const [selectedAlbums, setSelectedAlbums] = useState<any[]>([]);

  const methods = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      cost: 0,
      price: 0,
      finalPrice: 0,
      status: 1,
      isVerified: "false",
      describe: "",
      shortDescribe: "",
      stockQuantity: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // States for category/author selectors
  const [categoryTree, setCategoryTree] = useState<any[]>([]);
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [authorSearch, setAuthorSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const debouncedAuthorSearch = useDebounce(authorSearch, 500);

  // Book detail metadata state
  const [bookDetail, setBookDetail] = useState({
    id: "",
    publisher: "",
    publishYear: "",
    pageCount: "",
    format: "",
    language: "",
  });

  const { reset, handleSubmit } = methods;

  // Load categories tree on open
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const treeRes = await getCategoryTreeAPI();
        const treeList = treeRes?.data?.tree || treeRes?.data || (Array.isArray(treeRes) ? treeRes : []);
        setCategoryTree(treeList);
        
        // Expand all parents by default
        const initialExpanded: Record<string, boolean> = {};
        const traverse = (nodes: any[]) => {
          if (!Array.isArray(nodes)) return;
          nodes.forEach(n => {
            if (n && n.children && n.children.length > 0) {
              initialExpanded[n.id] = true;
              traverse(n.children);
            }
          });
        };
        traverse(treeList);
        setExpandedParents(initialExpanded);
      } catch (e) {
        console.error("Lỗi khi tải danh mục:", e);
      }
    };
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Debounced search for authors (always loads first 15 authors by default when dropdown opens)
  useEffect(() => {
    if (!isDropdownOpen) return;
    const searchAuthors = async () => {
      setIsSearching(true);
      try {
        const res = await getAuthorsAPI(1, 15, debouncedAuthorSearch.trim());
        setSearchResults(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm tác giả:", err);
      } finally {
        setIsSearching(false);
      }
    };
    searchAuthors();
  }, [debouncedAuthorSearch, isDropdownOpen]);

  // Sync state when dialog opens
  useEffect(() => {
    const initForm = async () => {
      if (!isOpen) return;
      setApiError(null);

      if (productToEdit) {
        setIsLoadingDetail(true);
        try {
          const detailRes = await getProductByIdAPI(productToEdit.id);
          const fullProduct = detailRes.data || detailRes;

          reset({
            name: fullProduct.name,
            slug: fullProduct.slug,
            cost: fullProduct.cost || 0,
            price: fullProduct.price,
            finalPrice: fullProduct.finalPrice || 0,
            status: Number(fullProduct.status) === 1 ? 1 : 0,
            isVerified: fullProduct.isVerified ? "true" : "false",
            describe: fullProduct.bookDetail?.describe || "",
            shortDescribe: fullProduct.shortDescribe || "",
            stockQuantity: fullProduct.stockQuantity !== undefined ? fullProduct.stockQuantity : 0,
          });
          
          // Map categoryIds & authorIds from objects if available
          const catIds = fullProduct.categories 
            ? fullProduct.categories.map((c: any) => c.id || c) 
            : fullProduct.categoryIds || [];
          
          const initialAuthors: Author[] = fullProduct.authors && fullProduct.authors.length > 0
            ? fullProduct.authors.map((a: any) => typeof a === "object" ? a : { id: a, name: `Tác giả ${a}` })
            : (fullProduct.authorIds || []).map((id: string) => ({ id, name: `Tác giả ${id}` }));

          setSelectedCategories(catIds);
          setSelectedAuthors(initialAuthors);

          // Map albums with media objects
          const initialAlbums = fullProduct.albums && fullProduct.albums.length > 0
            ? fullProduct.albums.map((item: any) => ({
                mediaId: item.media?.id || item.mediaId || "",
                displayOrder: item.displayOrder,
                media: item.media || {
                  id: item.mediaId,
                  fileUrl: item.mediaUrl || "",
                  fileName: `Tệp tin ${item.mediaId}`,
                  mimeType: "image/jpeg",
                  size: 0,
                  provider: "local",
                  altText: "",
                },
              }))
            : [];
          setSelectedAlbums(initialAlbums);

          // Map bookDetail
          const bd = fullProduct.bookDetail || {};
          setBookDetail({
            id: bd.id || "",
            publisher: bd.publisher || "",
            publishYear: bd.publishYear !== undefined ? String(bd.publishYear) : "",
            pageCount: bd.pageCount !== undefined ? String(bd.pageCount) : "",
            format: bd.format || "",
            language: bd.language || "",
          });
        } catch (error) {
          console.error("Lỗi khi tải chi tiết sản phẩm:", error);
          setApiError("Không thể tải chi tiết sản phẩm. Vui lòng thử lại.");
        } finally {
          setIsLoadingDetail(false);
        }
      } else {
        reset({
          name: "",
          slug: "",
          cost: 0,
          price: 0,
          finalPrice: 0,
          status: 1,
          isVerified: "false",
          describe: "",
          shortDescribe: "",
          stockQuantity: 0,
        });
        setSelectedCategories([]);
        setSelectedAuthors([]);
        setSelectedAlbums([]);
        setBookDetail({
          id: "",
          publisher: "",
          publishYear: "",
          pageCount: "",
          format: "",
          language: "",
        });
      }
    };

    initForm();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ProductFormInput) => {
    setApiError(null);
    setIsSubmitting(true);

    const payload: CreateProductPayload = {
      name: data.name.trim(),
      slug: data.slug?.trim() || generateSlug(data.name),
      cost: Number(data.cost || 0),
      price: Number(data.price),
      finalPrice: Number(data.finalPrice || 0),
      status: Number(data.status),
      isVerified: data.isVerified === "true" || data.isVerified === true,
      shortDescribe: data.shortDescribe?.trim() || "",
      stockQuantity: Number(data.stockQuantity || 0),
      categoryIds: selectedCategories,
      authorIds: selectedAuthors.map((auth) => auth.id),
      albums: selectedAlbums.map((item) => ({
        mediaId: item.mediaId,
        displayOrder: item.displayOrder,
      })),
      bookDetail: {
        id: bookDetail.id || undefined,
        describe: data.describe?.trim() || "",
        publisher: bookDetail.publisher?.trim() || undefined,
        publishYear: bookDetail.publishYear ? Number(bookDetail.publishYear) : undefined,
        pageCount: bookDetail.pageCount ? Number(bookDetail.pageCount) : undefined,
        format: bookDetail.format?.trim() || undefined,
        language: bookDetail.language?.trim() || undefined,
      }
    };

    try {
      if (productToEdit) {
        await updateProductAPI(productToEdit.id, payload);
        toast.success(`Cập nhật sản phẩm "${payload.name}" thành công!`);
      } else {
        await createProductAPI(payload);
        toast.success(`Thêm sản phẩm "${payload.name}" thành công!`);
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi xử lý sản phẩm:", error);
      const errMsg = error.response?.data?.message || "Không thể lưu thông tin sản phẩm. Vui lòng thử lại.";
      setApiError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-7xl rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 flex flex-col text-left relative min-h-[85vh] max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
          <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight">
            {productToEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* API Error Box */}
        {apiError && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold px-4 py-2.5 rounded-xl mb-4 shrink-0">
            {apiError}
          </div>
        )}

        {/* Scrollable Form Content */}
        <FormProvider {...methods}>
          <form id="product-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
            
            <ProductBasicInfo isEditMode={!!productToEdit} />
            
            <ProductPricingStock />
            
            <ProductCategorySelector
              categoryTree={categoryTree}
              expandedParents={expandedParents}
              setExpandedParents={setExpandedParents}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />

            <ProductAuthorSelector
              selectedAuthors={selectedAuthors}
              setSelectedAuthors={setSelectedAuthors}
              authorSearch={authorSearch}
              setAuthorSearch={setAuthorSearch}
              searchResults={searchResults}
              isSearching={isSearching}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />

            <ProductAlbumManager
              albums={selectedAlbums}
              onChangeAlbums={setSelectedAlbums}
            />
            
            <ProductBookDetail
              bookDetail={bookDetail}
              setBookDetail={setBookDetail}
            />

            {/* Short Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1 select-none">
                Mô tả ngắn (Hiển thị ở card sản phẩm)
              </label>
              <textarea
                placeholder="Nhập mô tả ngắn sản phẩm..."
                {...methods.register("shortDescribe")}
                rows={3}
                className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider pl-1 select-none">
                Mô tả sản phẩm (Chi tiết)
              </label>
              <textarea
                placeholder="Nhập mô tả sản phẩm..."
                {...methods.register("describe")}
                rows={10}
                className="focus:border-primary focus:ring-primary/5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 outline-none transition-all focus:bg-white focus:ring-4"
              />
            </div>

          </form>
        </FormProvider>

        {/* Footer actions */}
        <ProductFormFooter
          onClose={onClose}
          isSubmitting={isSubmitting}
        />

      </div>
    </div>
  );
}
