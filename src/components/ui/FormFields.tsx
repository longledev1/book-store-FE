import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// ==========================================
// 0. FormLabel Component
// ==========================================
export interface FormLabelProps {
  htmlFor?: string;
  label: string;
  required?: boolean;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  label,
  required,
  className,
}) => (
  <label
    htmlFor={htmlFor}
    className={cn(
      "block text-xs font-bold text-slate-700 mb-1.5 select-none text-left",
      className
    )}
  >
    <span>{label}</span>
    {required && <span className="text-rose-500 ml-0.5">*</span>}
  </label>
);

// Helper to safely get register function if inside FormProvider
const useOptionalRegister = (name: string) => {
  try {
    const context = useFormContext();
    if (context && context.register) {
      return {
        registerProps: context.register(name),
        error: context.formState.errors[name],
      };
    }
  } catch (e) {
    // Not in FormProvider
  }
  return { registerProps: {}, error: undefined };
};

// ==========================================
// 1. FormInput Component
// ==========================================
export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      name,
      label,
      required,
      icon: Icon,
      helperText,
      className,
      type = "text",
      ...props
    },
    ref
  ) => {
    const { registerProps, error } = useOptionalRegister(name);
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full text-left space-y-1.5 font-sans">
        {label && <FormLabel htmlFor={name} label={label} required={required} />}

        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-4 text-slate-400 pointer-events-none select-none">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            id={name}
            type={inputType}
            ref={ref}
            className={cn(
              "w-full text-xs md:text-sm px-4 py-2.5 rounded-2xl bg-slate-50/50 border text-slate-800 transition-all duration-200 outline-none shadow-sm focus:bg-white focus:shadow-md",
              Icon ? "pl-10" : "pl-4",
              isPassword ? "pr-10" : "pr-4",
              error
                ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10",
              className
            )}
            {...registerProps}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer select-none flex items-center justify-center p-1 rounded-full hover:bg-slate-100/50"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {error ? (
          <p className="text-xs text-rose-500 font-semibold animate-fade-in pl-1">
            {error.message as string}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 font-medium pl-1 leading-none">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

// ==========================================
// 2. FormTextArea Component
// ==========================================
export interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextareaElement> {
  name: string;
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  helperText?: string;
}

export const FormTextArea = React.forwardRef<
  HTMLTextareaElement,
  FormTextAreaProps
>(
  (
    {
      name,
      label,
      required,
      icon: Icon,
      helperText,
      className,
      ...props
    },
    ref
  ) => {
    const { registerProps, error } = useOptionalRegister(name);

    return (
      <div className="w-full text-left space-y-1.5 font-sans">
        {label && <FormLabel htmlFor={name} label={label} required={required} />}

        <div className="relative flex w-full">
          {Icon && (
            <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none select-none">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <textarea
            id={name}
            ref={ref}
            className={cn(
              "w-full text-xs md:text-sm px-4 py-2.5 rounded-2xl bg-slate-50/50 border text-slate-800 transition-all duration-200 outline-none shadow-sm focus:bg-white focus:shadow-md min-h-[70px] resize-y",
              Icon ? "pl-10" : "pl-4",
              error
                ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10",
              className
            )}
            {...registerProps}
            {...props}
          />
        </div>

        {error ? (
          <p className="text-xs text-rose-500 font-semibold animate-fade-in pl-1">
            {error.message as string}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 font-medium pl-1 leading-none">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormTextArea.displayName = "FormTextArea";

// ==========================================
// 3. FormSelect Component
// ==========================================
export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  required?: boolean;
  options: FormSelectOption[];
  placeholder?: string;
  helperText?: string;
}

export const FormSelect = React.forwardRef<
  HTMLSelectElement,
  FormSelectProps
>(
  (
    {
      name,
      label,
      required,
      options,
      placeholder,
      helperText,
      className,
      ...props
    },
    ref
  ) => {
    const { registerProps, error } = useOptionalRegister(name);

    return (
      <div className="w-full text-left space-y-1.5 font-sans">
        {label && <FormLabel htmlFor={name} label={label} required={required} />}

        <div className="relative w-full">
          <select
            id={name}
            ref={ref}
            className={cn(
              "w-full text-xs md:text-sm px-4 py-2.5 rounded-2xl bg-slate-50/50 border text-slate-800 transition-all duration-200 outline-none shadow-sm focus:bg-white focus:shadow-md appearance-none cursor-pointer",
              error
                ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10",
              className
            )}
            {...registerProps}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error ? (
          <p className="text-xs text-rose-500 font-semibold animate-fade-in pl-1">
            {error.message as string}
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 font-medium pl-1 leading-none">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

// ==========================================
// 4. FormCheckbox Component
// ==========================================
export interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  required?: boolean;
}

export const FormCheckbox = React.forwardRef<
  HTMLInputElement,
  FormCheckboxProps
>(({ name, label, required, className, ...props }, ref) => {
  const { registerProps, error } = useOptionalRegister(name);

  return (
    <div className="w-full text-left space-y-1.5 font-sans">
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          id={name}
          ref={ref}
          type="checkbox"
          className={cn(
            "mt-0.5 w-4 h-4 rounded border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary",
            error
              ? "border-rose-500 focus:ring-rose-500"
              : "border-slate-300 focus:ring-primary",
            className
          )}
          {...registerProps}
          {...props}
        />
        <span className="text-xs font-semibold text-slate-655 leading-tight">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </span>
      </label>

      {error && (
        <p className="text-xs text-rose-500 font-semibold animate-fade-in pl-1">
          {error.message as string}
        </p>
      )}
    </div>
  );
});

FormCheckbox.displayName = "FormCheckbox";
