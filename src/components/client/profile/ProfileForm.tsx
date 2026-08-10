import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { FormInput } from "../../ui/FormFields";
import { useAuthStore } from "@/stores/useAuthStore";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/formatDate";
import { updateProfileAPI } from "@/services/user.service";
import { toast } from "../../../stores/useToastStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "../../../validation/user.validation";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";

export default function ProfileForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      avatarUrl: "",
    },
  });

  const { reset } = methods;
  const watchAvatarUrl = methods.watch("avatarUrl");

  useEffect(() => {
    if (!user) return;

    reset({
      fullName: user.detail?.fullName ?? "",
      email: user.email ?? "",
      phone: user.detail?.phone ?? "",
      address: user.detail?.address ?? "",
      avatarUrl: user.detail?.avatarUrl ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await updateProfileAPI({
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        avatarUrl: data.avatarUrl.trim() || DEFAULT_AVATAR,
      });
      setUser(response.data);
      console.log("Update profile thành công:", response);
      toast.success("Cập nhật thông tin cá nhân thành công!");
    } catch (error: any) {
      console.error("Lỗi khi cập nhật profile:", error);
      const responseData = error?.response?.data;
      const apiMessage = responseData?.message;

      if (Array.isArray(apiMessage)) {
        toast.error(apiMessage.join(". "));
      } else if (typeof apiMessage === "string") {
        toast.error(apiMessage);
      } else {
        toast.error("Cập nhật thông tin cá nhân thất bại!");
      }
    }
  };

  return (
    <div className="space-y-6 rounded-3xl border border-slate-200/50 bg-white p-6 shadow-sm sm:p-8">
      {/* Title */}
      <div className="border-b border-slate-100 pb-4 text-left">
        <h3 className="text-base font-black tracking-tight text-slate-800 uppercase sm:text-lg">
          Thông tin cá nhân
        </h3>
        <p className="mt-1 text-xs font-semibold text-slate-400">
          Cập nhật thông tin tài khoản của bạn
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Display block */}
          <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-100/50 pb-5 sm:flex-row">
            <div className="flex flex-col items-center gap-4 text-left sm:flex-row">
              <div className="border-primary/20 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-slate-50 shadow-sm">
                <img
                  src={watchAvatarUrl || DEFAULT_AVATAR}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-slate-750 text-sm font-black">
                  Ảnh đại diện hiện tại
                </h4>
                <p className="text-[11px] font-semibold text-slate-400">
                  Thay đổi đường dẫn Avatar URL bên dưới để cập nhật ảnh
                </p>
              </div>
            </div>

            {/* Ngày tạo tài khoản - Beautiful & Compact Badge */}
            <div className="flex shrink-0 items-center gap-2.5 self-center rounded-2xl border border-slate-200/40 bg-slate-50 px-4 py-2 shadow-2xs select-none sm:self-auto">
              <Calendar className="text-primary h-4 w-4 shrink-0" />
              <div className="text-left leading-none">
                <p className="text-[9px] font-extrabold tracking-wider text-slate-400 uppercase">
                  Ngày tham gia
                </p>
                <p className="mt-1 text-[11px] font-black text-slate-700">
                  {formatDate(user?.detail?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Form grid layout: Responsive single column on mobile, two columns on desktop */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Họ và tên */}
            <FormInput
              name="fullName"
              type="text"
              label="Họ và tên"
              placeholder="Nhập họ và tên..."
              required
            />

            {/* Email (READ ONLY) */}
            <FormInput
              name="email"
              type="email"
              label="Địa chỉ Email"
              placeholder="name@example.com"
              readOnly
              className="cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 focus:border-slate-200 focus:shadow-sm focus:ring-0"
              helperText="Địa chỉ email không thể thay đổi"
            />

            {/* Số điện thoại */}
            <FormInput
              name="phone"
              type="text"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại..."
              required
            />

            {/* Địa chỉ */}
            <FormInput
              name="address"
              type="text"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ của bạn..."
              required
            />

            {/* Avatar URL */}
            <div className="sm:col-span-2">
              <FormInput
                name="avatarUrl"
                type="text"
                label="Đường dẫn ảnh đại diện (Avatar URL)"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Submit Button (Primary Blue) */}
          <div className="flex items-center justify-end border-t border-slate-100 pt-4 select-none">
            <button
              type="submit"
              className="bg-primary hover:bg-blue-650 cursor-pointer rounded-2xl px-6 py-3 text-xs font-bold tracking-wider text-white uppercase shadow-md transition-all hover:shadow-lg active:scale-[0.98]"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
