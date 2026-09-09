import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import {
  updateCategoryAPI,
  type Category,
} from "../../../../services/category.service";
import {
  categorySchema,
  type CategoryFormInput,
} from "../../../../validation/category.validation";
import { FormInput, FormSelect } from "../../../../components/ui/FormFields";
import { generateSlug } from "../../../../utils/generateSlug";
import { toast } from "../../../../stores/useToastStore";
import {
  createCategoryAPI,
  type CreateCategoryPayload,
} from "../../../../services/category.service";

interface CategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  categoryToEdit?: Category | null;
  categoriesList: Category[];
}
export default function CategoryFormDialog({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit = null,
  categoriesList,
}: CategoryFormDialogProps) {
  const methods = useForm<CategoryFormInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      parentId: "none",
      status: 1,
      isVerified: "false",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { reset, handleSubmit, watch, setValue } = methods;

  const watchedName = watch("name");

  // Auto-generate slug from name if not editing
  useEffect(() => {
    if (watchedName) {
      setValue("slug", generateSlug(watchedName));
    }
  }, [watchedName, setValue]);
  // Sync state when dialog opens or categoryToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (categoryToEdit) {
        reset({
          name: categoryToEdit.name,
          slug: categoryToEdit.slug,
          parentId: categoryToEdit.parentId || "none",
          status: Number(categoryToEdit.status) === 1 ? 1 : 0,
          isVerified: categoryToEdit.isVerified ? "true" : "false",
        });
      } else {
        reset({
          name: "",
          slug: "",
          parentId: "none",
          status: 1,
          isVerified: "false",
        });
      }
    }
  }, [categoryToEdit, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CategoryFormInput) => {
    setApiError(null);
    setIsSubmitting(true);

    const payload: CreateCategoryPayload = {
      name: data.name.trim(),
      status: Number(data.status),
      isVerified: data.isVerified === "true",
    };

    if (data.slug?.trim()) {
      payload.slug = data.slug.trim();
    }
    payload.parentId =
      data.parentId === "none" || !data.parentId ? null : data.parentId;

    try {
      if (categoryToEdit) {
        await updateCategoryAPI(categoryToEdit.id, payload);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createCategoryAPI(payload);
        toast.success("Tạo danh mục thành công!");
      }

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi tạo danh mục:", error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        setApiError(message.join(". "));
      } else if (typeof message === "string") {
        setApiError(message);
      } else {
        setApiError("Không thể tạo danh mục. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter only root categories as potential parents
  const parentOptions = categoriesList.filter(
    (cat) =>
      cat.parentId === null &&
      (!categoryToEdit || cat.id !== categoryToEdit.id),
  );

  const selectParentOptions = [
    { value: "none", label: "Không có danh mục cha (Làm danh mục gốc)" },
    ...parentOptions.map((parent) => ({
      value: parent.id,
      label: parent.name,
    })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-[2px] select-none">
      <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-md space-y-5 overflow-y-auto rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-2xl duration-200 sm:p-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black tracking-tight text-slate-800 uppercase sm:text-lg">
            {categoryToEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        {apiError && (
          <div className="rounded-2xl border border-rose-100/50 bg-rose-50 p-3.5 text-left text-xs font-semibold text-rose-600">
            {apiError}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Tên danh mục */}
            <FormInput
              name="name"
              label="Tên danh mục"
              required
              placeholder="Ví dụ: Sách Khoa Học"
            />

            {/* Slug */}
            <FormInput
              name="slug"
              label="Định dạng Slug (URL)"
              placeholder="sach-khoa-hoc (Tự động sinh nếu để trống)"
            />

            {/* Danh mục cha */}
            <FormSelect
              name="parentId"
              label="Danh mục cấp cha"
              options={selectParentOptions}
            />

            {/* Trạng thái */}
            <FormSelect
              name="status"
              label="Trạng thái"
              options={[
                { value: "1", label: "Hoạt động" },
                { value: "0", label: "Không hoạt động" },
              ]}
            />

            {/* Xác minh */}
            <FormSelect
              name="isVerified"
              label="Xác minh"
              options={[
                { value: "true", label: "Đã xác minh" },
                { value: "false", label: "Chưa xác minh" },
              ]}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 font-sans select-none">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-98"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary cursor-pointer rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : categoryToEdit
                    ? "Lưu thay đổi"
                    : "Tạo danh mục"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
