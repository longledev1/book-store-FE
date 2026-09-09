import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FormInput } from "../../../../components/ui/FormFields";
import { formatNumberWithCommas, parseNumberFromCommas } from "../../../../utils/format";

const FormPriceInput = ({
  name,
  label,
  required,
  placeholder,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref }, fieldState: { error } }) => {
        const displayValue = formatNumberWithCommas(value);

        return (
          <div className="w-full text-left space-y-1.5 font-sans">
            {label && (
              <label htmlFor={name} className="text-xs font-bold text-slate-750 flex items-center gap-0.5 select-none">
                <span>{label}</span>
                {required && <span className="text-rose-500">*</span>}
              </label>
            )}
            <div className="relative flex items-center w-full">
              <input
                ref={ref}
                id={name}
                type="text"
                value={displayValue}
                onChange={(e) => {
                  const parsed = parseNumberFromCommas(e.target.value);
                  onChange(parsed);
                }}
                placeholder={placeholder}
                className={`w-full text-xs md:text-sm px-4 py-3 rounded-2xl bg-white border text-slate-800 transition-all duration-200 outline-none shadow-sm focus:shadow-md pr-4 pl-4 ${
                  error
                    ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-slate-200 hover:border-slate-350 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 font-semibold animate-fade-in pl-1">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default function ProductPricingStock() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50/40 border border-slate-200/50 p-6 rounded-3xl">
      <FormPriceInput
        name="cost"
        label="Giá vốn / Giá nhập (đ)"
        required
        placeholder="Nhập giá vốn..."
      />
      <FormPriceInput
        name="price"
        label="Giá niêm yết (đ)"
        required
        placeholder="Nhập giá niêm yết..."
      />
      <FormPriceInput
        name="finalPrice"
        label="Giá bán thực tế (đ)"
        required
        placeholder="Nhập giá bán..."
      />
      <FormInput
        name="stockQuantity"
        type="number"
        label="Số lượng tồn kho"
        placeholder="Nhập số lượng tồn..."
      />
    </div>
  );
}
