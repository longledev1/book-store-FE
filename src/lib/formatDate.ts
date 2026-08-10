export const formatDate = (date?: string | null) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
