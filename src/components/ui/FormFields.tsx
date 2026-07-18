import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// ==========================================
// 1. FormInput Component
// ==========================================
export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  icon?: LucideIcon;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ name, label, required, icon: Icon, helperText, className, type = "text", ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    const [showPassword, setShowPassword] = useState(false);
    const error = errors[name];
    const isPassword = type === "password";
    
    // Toggle input password type based on eye button state
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full text-left space-y-1.5 font-sans">
        {label && (
          <label htmlFor={name} className="text-xs font-bold text-slate-750 flex items-center gap-0.5 select-none">
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        
        <div className="relative flex items-center w-full">
          {/* Left Icon */}
          {Icon && (
            <div className="absolute left-4 text-slate-400 pointer-events-none select-none">
              <Icon className="w-4.5 h-4.5" />
            </div>
          )}

          <input
            id={name}
            type={inputType}
            className={cn(
              "w-full text-xs md:text-sm px-4 py-3 rounded-2xl bg-white border text-slate-800 transition-all duration-200 outline-none shadow-sm focus:shadow-md",
              Icon ? "pl-12" : "pl-4",
              isPassword ? "pr-12" : "pr-4",
              error
                ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-slate-350 focus:border-primary focus:ring-4 focus:ring-primary/10",
              className
            )}
            {...register(name)}
            {...props}
          />

          {/* Right password show/hide eye toggle button */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-650 transition-colors cursor-pointer select-none flex items-center justify-center p-1 rounded-full hover:bg-slate-100/50"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Error message display / Helper Text */}
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
export interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextareaElement> {
  name: string;
  label?: string;
  required?: boolean;
  helperText?: string;
}

export const FormTextArea = React.forwardRef<HTMLTextareaElement, FormTextAreaProps>(
  ({ name, label, required, helperText, className, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    const error = errors[name];

    return (
      <div className="w-full text-left space-y-1.5 font-sans">
        {label && (
          <label htmlFor={name} className="text-xs font-bold text-slate-750 flex items-center gap-0.5 select-none">
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <textarea
          id={name}
          className={cn(
            "w-full text-xs md:text-sm px-4 py-3 rounded-2xl bg-white border text-slate-800 transition-all duration-200 outline-none shadow-sm focus:shadow-md min-h-[100px] resize-y",
            error
              ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-200 hover:border-slate-350 focus:border-primary focus:ring-4 focus:ring-primary/10",
            className
          )}
          {...register(name)}
          {...props}
        />

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

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  required?: boolean;
  options: FormSelectOption[];
  placeholder?: string;
  helperText?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ name, label, required, options, placeholder, helperText, className, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    const error = errors[name];

    return (
      <div className="w-full text-left space-y-1.5 font-sans">
        {label && (
          <label htmlFor={name} className="text-xs font-bold text-slate-750 flex items-center gap-0.5 select-none">
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="relative w-full">
          <select
            id={name}
            className={cn(
              "w-full text-xs md:text-sm px-4 py-3 rounded-2xl bg-white border text-slate-800 transition-all duration-200 outline-none shadow-sm focus:shadow-md appearance-none cursor-pointer",
              error
                ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-200 hover:border-slate-350 focus:border-primary focus:ring-4 focus:ring-primary/10",
              className
            )}
            {...register(name)}
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
          {/* Styled dropdown chevron arrow icon */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
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
export interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  required?: boolean;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ name, label, required, className, ...props }, ref) => {
    const {
      register,
      formState: { errors },
    } = useFormContext();

    const error = errors[name];

    return (
      <div className="w-full text-left space-y-1.5 font-sans">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            id={name}
            type="checkbox"
            className={cn(
              "mt-0.5 w-4 h-4 rounded border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer accent-primary",
              error ? "border-rose-500 focus:ring-rose-500" : "border-slate-300 focus:ring-primary",
              className
            )}
            {...register(name)}
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
  }
);

FormCheckbox.displayName = "FormCheckbox";
