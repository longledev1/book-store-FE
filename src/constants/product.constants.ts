export const BOOK_FORMATS = [
  "Bìa mềm",
  "Bìa cứng",
  "Bìa da",
  "Bìa gập",
  "Khác",
];

export const BOOK_LANGUAGES = [
  "Tiếng Việt",
  "Tiếng Anh",
  "Tiếng Nhật",
  "Tiếng Trung",
  "Tiếng Hàn",
  "Tiếng Pháp",
  "Tiếng Đức",
  "Khác",
];

export interface PopularTab {
  id: string;
  label: string;
  keyword?: string;
}

export const POPULAR_TABS: PopularTab[] = [
  { id: "all", label: "Tất cả", keyword: undefined },
  { id: "KINH_DOANH", label: "Kinh doanh", keyword: "Kinh Doanh" },
  { id: "CONG_NGHE", label: "Công nghệ & CNTT", keyword: "Lập Trình" },
  { id: "TAM_LY", label: "Tâm lý & Kỹ năng", keyword: "Tâm Lý" },
  { id: "VAN_HOC", label: "Văn học", keyword: "Văn Học" },
];

