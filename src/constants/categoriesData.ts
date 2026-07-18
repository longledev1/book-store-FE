export interface SubcatGroup {
  title: string;
  items: string[];
  isHighlighted?: boolean;
}

export const parentCategories = [
  { id: "science_tech", name: "Khoa Học & Công Nghệ" },
  { id: "history_philosophy", name: "Lịch Sử & Triết Học" },
  { id: "literature_art", name: "Văn Học & Nghệ Thuật" },
  { id: "economics_startup", name: "Kinh Tế & Khởi Nghiệp" },
  { id: "skills_development", name: "Kỹ Năng & Phát Triển" },
];

export const subcategoriesData: Record<
  string,
  {
    title: string;
    groups: SubcatGroup[];
  }
> = {
  science_tech: {
    title: "Khoa Học & Công Nghệ",
    groups: [
      {
        title: "KHOA HỌC TỰ NHIÊN",
        items: [
          "Vật Lý Học",
          "Hóa Học & Sinh Học",
          "Khoa Học Vũ Trụ",
          "Toán Học Ứng Dụng",
        ],
      },
      {
        title: "CÔNG NGHỆ THÔNG TIN",
        items: [
          "Trí Tuệ Nhân Tạo (AI)",
          "Lập Trình Web & Mobile",
          "An Ninh Mạng",
          "Khoa Học Dữ Liệu",
        ],
      },
    ],
  },
  history_philosophy: {
    title: "Lịch Sử & Triết Học",
    groups: [
      {
        title: "LỊCH SỬ DÂN TỘC & THẾ GIỚI",
        items: [
          "Lịch Sử Việt Nam",
          "Lịch Sử Cổ Đại",
          "Chiến Tranh Thế Giới",
          "Khảo Cổ Học",
        ],
      },
      {
        title: "TRIẾT HỌC & TƯ TƯỞNG",
        items: [
          "Triết Học Phương Đông",
          "Triết Học Phương Tây",
          "Đạo Đức Học",
          "Tư Tưởng Hồ Chí Minh",
        ],
      },
    ],
  },
  literature_art: {
    title: "Văn Học & Nghệ Thuật",
    groups: [
      {
        title: "VĂN HỌC & TIỂU THUYẾT",
        items: [
          "Văn Học Việt Nam",
          "Tiểu Thuyết Kinh Điển",
          "Truyện Ngắn & Tản Văn",
          "Thơ Ca",
        ],
      },
      {
        title: "NGHỆ THUẬT & THIẾT KẾ",
        items: [
          "Lịch Sử Nghệ Thuật",
          "Thiết Kế Đồ Họa",
          "Nhiếp Ảnh",
          "Kiến Trúc Đương Đại",
        ],
      },
    ],
  },
  economics_startup: {
    title: "Kinh Tế & Khởi Nghiệp",
    groups: [
      {
        title: "KINH DOANH & QUẢN TRỊ",
        items: [
          "Quản Trị Kinh Doanh",
          "Tài Chính Doanh Nghiệp",
          "Marketing & Thương Hiệu",
          "Quản Lý Nhân Sự",
        ],
      },
      {
        title: "KHỞI NGHIỆP & ĐẦU TƯ",
        items: [
          "Khởi Nghiệp Tinh Gọn",
          "Đầu Tư Chứng Khoán",
          "Tài Chính Cá Nhân",
          "Ý Tưởng Kinh Doanh",
        ],
      },
    ],
  },
  skills_development: {
    title: "Kỹ Năng & Phát Triển",
    groups: [
      {
        title: "PHÁT TRIỂN BẢN THÂN",
        items: [
          "Tư Duy Sáng Tạo",
          "Kỹ Năng Giao Tiếp",
          "Quản Lý Thời Gian",
          "Rèn Luyện Sự Tập Trung",
        ],
      },
      {
        title: "TÂM LÝ ỨNG DỤNG",
        items: [
          "Tâm Lý Học Hành Vi",
          "Kiểm Soát Cảm Xúc",
          "Giải Quyết Xung Đột",
          "Tâm Lý Học Tình Yêu",
        ],
      },
    ],
  },
};
