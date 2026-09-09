import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Camera, Trash2, User } from "lucide-react";
import {
  createAuthorAPI,
  updateAuthorAPI,
  type Author,
  type CreateAuthorPayload,
} from "../../../../services/author.service";
import { type Media } from "../../../../services/media.service";
import { resolveMediaUrl } from "../../../../utils/format";
import { authorSchema, type AuthorFormInput } from "../../../../validation/author.validation";
import { FormInput, FormTextArea } from "../../../../components/ui/FormFields";
import { toast } from "../../../../stores/useToastStore";
import MediaPickerModal from "../../products/components/MediaPickerModal";

interface AuthorFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  authorToEdit?: Author | null;
}

export default function AuthorFormDialog({
  isOpen,
  onClose,
  onSuccess,
  authorToEdit = null,
}: AuthorFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Avatar media state
  const [selectedAvatar, setSelectedAvatar] = useState<Media | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const methods = useForm<AuthorFormInput>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: "",
      describe: "",
    },
  });

  const { reset, handleSubmit } = methods;

  // Sync state when dialog opens or authorToEdit changes
  useEffect(() => {
    if (isOpen) {
      setApiError(null);
      if (authorToEdit) {
        reset({
          name: authorToEdit.name,
          describe: authorToEdit.describe || "",
        });
        setSelectedAvatar(authorToEdit.avatar || null);
      } else {
        reset({
          name: "",
          describe: "",
        });
        setSelectedAvatar(null);
      }
    }
  }, [authorToEdit, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: AuthorFormInput) => {
    setApiError(null);
    setIsSubmitting(true);

    const payload: CreateAuthorPayload = {
      name: data.name.trim(),
      describe: data.describe?.trim() || undefined,
      mediaId: selectedAvatar ? selectedAvatar.id : null,
    };

    try {
      if (authorToEdit) {
        await updateAuthorAPI(authorToEdit.id, payload);
        toast.success("Cập nhật tác giả thành công!");
      } else {
        await createAuthorAPI(payload);
        toast.success("Tạo tác giả thành công!");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error("Lỗi khi lưu tác giả:", error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        setApiError(message.join(". "));
      } else if (typeof message === "string") {
        setApiError(message);
      } else {
        setApiError("Không thể lưu thông tin tác giả. Vui lòng thử lại.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-[2px] select-none">
      <div className="animate-in fade-in zoom-in-95 relative max-h-[90vh] w-full max-w-md space-y-5 overflow-y-auto rounded-3xl border border-slate-200/50 bg-white p-6 text-left shadow-2xl duration-200 sm:p-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-black tracking-tight text-slate-800 uppercase sm:text-lg">
            {authorToEdit ? "Chỉnh sửa tác giả" : "Thêm tác giả mới"}
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
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-xs font-bold text-rose-500 animate-fade-in">
            {apiError}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Ảnh đại diện tác giả */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-750 flex items-center justify-between select-none">
                <span>Ảnh đại diện tác giả</span>
                <span className="text-[10px] font-normal text-slate-400">Tùy chọn</span>
              </label>

              <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
                {/* Avatar Preview */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-200 border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                  {selectedAvatar ? (
                    <img
                      src={resolveMediaUrl(selectedAvatar.fileUrl)}
                      alt={selectedAvatar.altText || "Avatar tác giả"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-slate-400" />
                  )}
                </div>

                {/* Info & Action Buttons */}
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-700 truncate">
                    {selectedAvatar ? selectedAvatar.fileName : "Chưa chọn ảnh đại diện"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {selectedAvatar
                      ? "Ảnh đã chọn từ thư viện Media"
                      : "Chọn ảnh từ thư viện Media để làm avatar"}
                  </span>

                  <div className="flex items-center gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-100/80 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <Camera className="w-3.5 h-3.5 text-primary" />
                      <span>{selectedAvatar ? "Thay đổi" : "Chọn ảnh"}</span>
                    </button>

                    {selectedAvatar && (
                      <button
                        type="button"
                        onClick={() => setSelectedAvatar(null)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-98"
                        title="Xóa ảnh đại diện"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Gỡ ảnh</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tên tác giả */}
            <FormInput
              name="name"
              label="Tên tác giả"
              required
              placeholder="Ví dụ: Dale Carnegie"
            />

            {/* Mô tả */}
            <FormTextArea
              name="describe"
              label="Mô tả tác giả"
              placeholder="Tóm tắt tiểu sử hoặc tác phẩm tiêu biểu..."
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 select-none font-sans">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-blue-700 active:scale-98 transition-all cursor-pointer shadow-sm shadow-blue-500/10 disabled:opacity-50"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : authorToEdit
                  ? "Lưu thay đổi"
                  : "Tạo tác giả"}
              </button>
            </div>
          </form>
        </FormProvider>

        {/* Media Picker Modal */}
        <MediaPickerModal
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(selectedMediaList) => {
            if (selectedMediaList.length > 0) {
              setSelectedAvatar(selectedMediaList[0]);
            }
            setIsMediaPickerOpen(false);
          }}
          alreadySelectedMediaIds={selectedAvatar ? [selectedAvatar.id] : []}
          defaultFolder="authors"
        />

      </div>
    </div>
  );
}
