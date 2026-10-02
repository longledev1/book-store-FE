import React from "react";
import { User, Phone, MapPin, FileText } from "lucide-react";
import CustomSelect from "@/components/common/CustomSelect";
import { FormInput, FormTextArea, FormLabel } from "@/components/ui/FormFields";
import { PROVINCE_OPTIONS, LOCATION_DATA } from "@/config/ward";

interface CheckoutShippingSectionProps {
  customerName: string;
  setCustomerName: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  selectedProvince: string;
  setSelectedProvince: (val: string) => void;
  selectedWard: string;
  setSelectedWard: (val: string) => void;
  streetAddress: string;
  setStreetAddress: (val: string) => void;
  shippingAddress: string;
  setShippingAddress: (val: string) => void;
  note: string;
  setNote: (val: string) => void;
  handleAddressChange: (street: string, wardLabel: string, provinceKey: string) => void;
}

export default function CheckoutShippingSection({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  selectedProvince,
  setSelectedProvince,
  selectedWard,
  setSelectedWard,
  streetAddress,
  setStreetAddress,
  shippingAddress,
  setShippingAddress,
  note,
  setNote,
  handleAddressChange,
}: CheckoutShippingSectionProps) {
  return (
    <div className="rounded-3xl border border-slate-200/60 bg-white p-6 shadow-sm space-y-5 text-left font-sans">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
          1
        </div>
        <h3 className="text-sm md:text-base font-black text-slate-800 uppercase tracking-wide">
          Thông tin người nhận hàng
        </h3>
      </div>

      <div className="space-y-4 text-xs font-semibold">
        {/* Full Name */}
        <FormInput
          name="customerName"
          label="Họ và tên người nhận"
          required
          icon={User}
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Nhập họ và tên..."
        />

        {/* Phone */}
        <FormInput
          name="customerPhone"
          type="tel"
          label="Số điện thoại"
          required
          icon={Phone}
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="Nhập số điện thoại liên hệ..."
        />

        {/* Select Province & Ward (Custom Downward Dropdowns from ward.ts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Province Dropdown */}
          <div>
            <FormLabel label="Tỉnh / Thành phố" />
            <CustomSelect
              placeholder="-- Chọn Tỉnh / Thành phố --"
              options={PROVINCE_OPTIONS}
              value={selectedProvince}
              onChange={(opt) => {
                const newProv = opt.value;
                setSelectedProvince(newProv);
                setSelectedWard("");
                handleAddressChange(streetAddress, "", newProv);
              }}
            />
          </div>

          {/* Ward Dropdown */}
          <div>
            <FormLabel label="Phường / Xã (Sau sáp nhập)" />
            <CustomSelect
              placeholder="-- Chọn Phường / Xã --"
              disabled={!selectedProvince}
              options={
                selectedProvince
                  ? ((LOCATION_DATA as any)[selectedProvince] || []).filter(
                      (w: any) => w.value !== ""
                    )
                  : []
              }
              value={selectedWard}
              onChange={(opt) => {
                const newWard = opt.label;
                setSelectedWard(newWard);
                handleAddressChange(streetAddress, newWard, selectedProvince);
              }}
            />
          </div>
        </div>

        {/* Street / House Number */}
        <FormInput
          name="streetAddress"
          label="Số nhà, tên đường"
          value={streetAddress}
          onChange={(e) => {
            const newStreet = e.target.value;
            setStreetAddress(newStreet);
            handleAddressChange(newStreet, selectedWard, selectedProvince);
          }}
          placeholder="Ví dụ: 123 Nguyễn Văn Cừ..."
        />

        {/* Shipping Address (Full concatenated / editable result) */}
        <FormTextArea
          name="shippingAddress"
          label="Địa chỉ nhận hàng đầy đủ"
          required
          icon={MapPin}
          rows={2}
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Số nhà, tên đường, phường/xã, tỉnh/thành phố..."
        />

        {/* Note */}
        <FormTextArea
          name="note"
          label="Ghi chú đơn hàng (Tùy chọn)"
          icon={FileText}
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú cho shipper (ví dụ: giao giờ hành chính, gọi trước khi tới...)"
        />
      </div>
    </div>
  );
}
