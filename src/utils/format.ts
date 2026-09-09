/**
 * Centralized formatting and media URL resolution helper utilities.
 */

/**
 * Formats a number to a price string with VND format (e.g., 75,000đ).
 * If the value is undefined or null, returns "Liên hệ".
 */
export const formatPrice = (val?: number | string | null): string => {
  if (val === undefined || val === null || val === "") return "Liên hệ";
  const numVal = typeof val === "string" ? Number(val) : val;
  if (isNaN(numVal)) return "Liên hệ";
  return numVal.toLocaleString("vi-VN") + "đ";
};

/**
 * Resolves a raw media/product image URL to a full path.
 * If raw URL is empty, returns a default fallback path (empty string).
 * If the URL is already absolute (HTTP/HTTPS), returns it as-is.
 * Otherwise, prepends the backend base domain configured in VITE_API_BASE_URL.
 */
export const resolveMediaUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  const backendDomain = import.meta.env.VITE_API_BASE_URL || "http://localhost:1234";
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  return `${backendDomain}${cleanUrl}`;
};

export const resolveProductImageUrl = resolveMediaUrl;

/**
 * Formats a size in bytes to a human-readable format (e.g., KB, MB).
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Formats a date string into Vietnamese locale format.
 */
export const formatDate = (date?: string | null, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("vi-VN", options || {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formats a raw number or string representing a number with English commas as thousands separators (e.g. 1000000 -> "1,000,000").
 * Strips decimal parts (used for Vietnamese prices/counts).
 */
export const formatNumberWithCommas = (value: any): string => {
  if (value === undefined || value === null || value === "") return "";
  const numStr = String(value).split(".")[0];
  const cleanValue = numStr.replace(/[^0-9]/g, "");
  if (!cleanValue) return "";
  return Number(cleanValue).toLocaleString("en-US");
};

/**
 * Parses a comma-separated string back to a raw number (e.g. "1,000,000" -> 1000000).
 */
export const parseNumberFromCommas = (value: string): number => {
  const cleanValue = value.replace(/[^0-9]/g, "");
  return cleanValue ? Number(cleanValue) : 0;
};
