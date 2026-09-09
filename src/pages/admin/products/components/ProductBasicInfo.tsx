import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FormInput, FormSelect } from "../../../../components/ui/FormFields";
import { generateSlug } from "../../../../utils/generateSlug";

interface ProductBasicInfoProps {
  isEditMode: boolean;
}

export default function ProductBasicInfo({ isEditMode }: ProductBasicInfoProps) {
  const { watch, setValue } = useFormContext();
  const watchedName = watch("name");

  useEffect(() => {
    if (watchedName && !isEditMode) {
      setValue("slug", generateSlug(watchedName));
    }
  }, [watchedName, setValue, isEditMode]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          name="name"
          label="Tên sản phẩm"
          required
          placeholder="Nhập tên sản phẩm..."
        />
        <FormInput
          name="slug"
          label="Slug"
          placeholder="Auto-generated slug..."
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormSelect
          name="status"
          label="Trạng thái"
          options={[
            { value: 1, label: "Hoạt động" },
            { value: 0, label: "Không hoạt động" },
          ]}
        />
        <FormSelect
          name="isVerified"
          label="Xác minh"
          options={[
            { value: "true", label: "Đã xác minh" },
            { value: "false", label: "Chưa xác minh" },
          ]}
        />
      </div>
    </div>
  );
}
