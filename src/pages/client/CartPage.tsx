import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { toast } from "@/stores/useToastStore";
import { formatPrice } from "@/utils/format";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function CartPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const openAuthModal = useAuthModalStore((state) => state.openModal);
  const { requireAuth } = useRequireAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập để xem giỏ hàng!");
      openAuthModal("login");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, openAuthModal]);

  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalCount,
    getTotalAmount,
  } = useCartStore();

  if (!isAuthenticated) {
    return null;
  }

  const totalCount = getTotalCount();
  const totalAmount = getTotalAmount();
  const shippingFee = 30000;
  const finalTotal = totalAmount + shippingFee;

  const handleProceedToCheckout = () => {
    requireAuth(() => {
      navigate("/checkout");
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50/40 py-16 font-sans">
        <div className="container-custom max-w-4xl text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-100/80 border border-slate-200/60 shadow-inner">
            <ShoppingBag className="h-12 w-12 text-slate-400" />
          </div>
          <h2 className="mt-6 text-xl md:text-2xl font-black text-slate-800 tracking-tight">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="mt-2 text-xs md:text-sm text-slate-450 max-w-md mx-auto">
            Hãy khám phá hàng ngàn cuốn sách hấp dẫn tại LuminaBook và chọn cho mình tác phẩm yêu thích nhé!
          </p>
          <div className="mt-8">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 text-xs md:text-sm font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98"
            >
              <BookOpen className="w-4 h-4" />
              <span>Khám phá sách ngay</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/40 py-8 font-sans text-left">
      <div className="container-custom max-w-[1280px]">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="font-bold text-slate-600">Giỏ hàng ({totalCount})</span>
        </div>

        <h1 className="mb-8 text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-3">
          <span>Giỏ hàng của bạn</span>
          <span className="text-xs md:text-sm font-bold text-slate-400 normal-case bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
            {totalCount} sản phẩm
          </span>
        </h1>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Cart Items List */}
          <div className="space-y-4 lg:col-span-8">
            {/* Table Header Action */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
              <span className="text-xs font-bold text-slate-600">
                Sản phẩm trong giỏ hàng
              </span>
              <button
                onClick={() => clearCart()}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer select-none"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tất cả</span>
              </button>
            </div>

            {/* Cart Items */}
            <div className="space-y-3">
              {items.map((item) => {
                const itemPrice = item.finalPrice || item.price;
                const itemSubtotal = itemPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/60 bg-white p-4 shadow-sm transition-all hover:border-primary/20"
                  >
                    {/* Item Image + Details */}
                    <div className="flex items-center gap-4 flex-1">
                      <Link
                        to={`/books/${item.slug || item.id}`}
                        className="relative shrink-0 h-20 w-16 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm group"
                      >
                        <img
                          src={item.image || "/mock_data.png"}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/mock_data.png";
                          }}
                        />
                      </Link>
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">
                          {item.category || "Sách"}
                        </span>
                        <Link
                          to={`/books/${item.slug || item.id}`}
                          className="block font-bold text-sm text-slate-800 hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-extrabold text-slate-800">
                            {formatPrice(itemPrice)}
                          </span>
                          {item.price > itemPrice && (
                            <span className="text-slate-400 line-through text-[11px]">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls + Subtotal + Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-1 rounded-xl border border-slate-200/60 bg-slate-50 px-2 py-1 select-none">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-200/60 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-black text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-slate-500 hover:bg-slate-200/60 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-sm font-black text-primary w-24 text-right">
                        {formatPrice(itemSubtotal)}
                      </span>

                      {/* Trash icon */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 transition-colors cursor-pointer"
                        title="Xóa món này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to store link */}
            <div className="pt-2">
              <Link
                to="/books"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
              >
                <span>&larr; Tiếp tục chọn thêm sách</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Summary Card & Checkout CTA */}
          <div className="space-y-6 lg:col-span-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 uppercase tracking-wide">
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính ({totalCount} sản phẩm)</span>
                  <span className="text-slate-800 font-bold">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-slate-800 font-bold">{formatPrice(shippingFee)}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-baseline justify-between">
                <span className="text-xs font-black text-slate-800 uppercase">Tổng thành tiền</span>
                <span className="text-2xl font-black text-primary">{formatPrice(finalTotal)}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-xs font-extrabold text-white shadow-md shadow-blue-500/10 transition-all hover:bg-blue-700 active:scale-98 cursor-pointer"
              >
                <span>Tiến hành thanh toán</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="rounded-3xl border border-slate-200/60 bg-white p-5 shadow-sm space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>Giao hàng nhanh từ 2 - 4 ngày làm việc</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <span>Đổi trả miễn phí trong vòng 7 ngày</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>100% Sách chính hãng bản quyền</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
