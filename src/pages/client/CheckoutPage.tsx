import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "@/stores/useToastStore";
import { createOrderAPI, createVnpayPaymentUrlAPI } from "@/services/order.service";
import { PROVINCE_OPTIONS } from "@/config/ward";

import CheckoutShippingSection from "@/components/client/checkout/CheckoutShippingSection";
import CheckoutPaymentSection from "@/components/client/checkout/CheckoutPaymentSection";
import CheckoutOrderSummary from "@/components/client/checkout/CheckoutOrderSummary";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getTotalAmount, clearCart } = useCartStore();

  const totalAmount = getTotalAmount();
  const shippingFee = 30000;
  const finalTotal = totalAmount + shippingFee;

  // Form State
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [streetAddress, setStreetAddress] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-compose detailed address whenever street, ward or province dropdown changes
  const handleAddressChange = (street: string, wardLabel: string, provinceKey: string) => {
    const provinceObj = PROVINCE_OPTIONS.find((p) => p.value === provinceKey);
    const parts = [street.trim(), wardLabel, provinceObj?.label].filter(Boolean);
    if (parts.length > 0) {
      setShippingAddress(parts.join(", "));
    }
  };

  // Prefill user profile info if available
  useEffect(() => {
    if (user?.detail) {
      if (user.detail.fullName && !customerName) {
        setCustomerName(user.detail.fullName);
      }
      if (user.detail.phone && !customerPhone) {
        setCustomerPhone(user.detail.phone);
      }
      if (user.detail.address && !shippingAddress) {
        setShippingAddress(user.detail.address);
      }
    }
  }, [user]);

  // Empty cart guard
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50/40 py-16 font-sans text-center">
        <div className="container-custom max-w-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 border border-slate-200 shadow-sm text-slate-400">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="mt-6 text-xl md:text-2xl font-black text-slate-800">
            Không có sản phẩm nào để thanh toán
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-450">
            Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm vào giỏ hàng trước khi thực hiện đặt hàng.
          </p>
          <div className="mt-8">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700"
            >
              <span>Quay lại cửa hàng</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim()) {
      setErrorMsg("Vui lòng nhập họ và tên người nhận");
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg("Vui lòng nhập số điện thoại người nhận");
      return;
    }
    if (!shippingAddress.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        note: note.trim() || undefined,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const res: any = await createOrderAPI(payload);
      const createdOrder = res?.data || res;

      if (!createdOrder || (!createdOrder.id && !createdOrder.code)) {
        throw new Error("Không nhận được phản hồi hợp lệ từ máy chủ");
      }

      if (paymentMethod === "VNPAY") {
        try {
          const vnpayRes: any = await createVnpayPaymentUrlAPI(createdOrder.id);
          const paymentUrl =
            typeof vnpayRes === "string"
              ? vnpayRes
              : vnpayRes?.paymentUrl ||
                vnpayRes?.data?.paymentUrl ||
                vnpayRes?.url ||
                vnpayRes?.data?.url ||
                (typeof vnpayRes?.data === "string" ? vnpayRes?.data : null);

          if (paymentUrl) {
            clearCart();
            toast.success("Đang chuyển hướng tới cổng thanh toán VNPAY...");
            window.location.href = paymentUrl;
            return;
          } else {
            toast.error("Không tạo được liên kết VNPAY, chuyển hướng tới trang đơn hàng");
          }
        } catch (vnpErr: any) {
          console.error("VNPAY URL error:", vnpErr);
          toast.error(
            vnpErr?.response?.data?.message || "Lỗi khi khởi tạo thanh toán VNPAY"
          );
        }
      }

      clearCart();
      toast.success("Đặt hàng thành công!");
      navigate(`/checkout/success?code=${createdOrder.code || createdOrder.id}`);
    } catch (err: any) {
      console.error("Order error:", err);
      const errorText =
        err?.response?.data?.message || err?.message || "Có lỗi xảy ra khi tạo đơn hàng";
      setErrorMsg(Array.isArray(errorText) ? errorText.join(", ") : errorText);
      toast.error("Tạo đơn hàng không thành công");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 py-8 font-sans text-left">
      <div className="container-custom max-w-[1280px]">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-primary transition-colors">
            Giỏ hàng
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-600">Thanh toán</span>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">
            Thanh toán & Đặt hàng
          </h1>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Quay lại giỏ hàng</span>
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-2xl bg-rose-50 p-4 border border-rose-200/80 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* Left Column: Shipping & Payment Sub-sections */}
            <div className="space-y-6 lg:col-span-7">
              <CheckoutShippingSection
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedWard={selectedWard}
                setSelectedWard={setSelectedWard}
                streetAddress={streetAddress}
                setStreetAddress={setStreetAddress}
                shippingAddress={shippingAddress}
                setShippingAddress={setShippingAddress}
                note={note}
                setNote={setNote}
                handleAddressChange={handleAddressChange}
              />

              <CheckoutPaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div className="lg:col-span-5">
              <CheckoutOrderSummary
                items={items}
                totalAmount={totalAmount}
                shippingFee={shippingFee}
                finalTotal={finalTotal}
                paymentMethod={paymentMethod}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
