export interface MegaMenuBook {
  id: string | number;
  title: string;
  author: string;
}

export interface MegaMenuSubcategory {
  id: string;
  name: string;
  books: MegaMenuBook[];
}

export interface MegaMenuCategory {
  id: string;
  name: string;
  categories: MegaMenuSubcategory[];
}

export const categoriesData: MegaMenuCategory[] = [
  {
    id: "technology",
    name: "Sách Công Nghệ",
    categories: [
      {
        id: "web-mobile",
        name: "Dạy Web & Mobile",
        books: [
          {
            id: 1,
            title: "HTML & CSS: Thiết Kế và Xây Dựng Trang Web",
            author: "Jon Duckett",
          },
          {
            id: 2,
            title: "Lập Trình JavaScript Thú Vị (Eloquent JavaScript)",
            author: "Marijn Haverbeke",
          },
          {
            id: 3,
            title: "Giải Thích React Cơ Bản",
            author: "Zac Gordon",
          },
          {
            id: 4,
            title: "Học Lập Trình Flutter",
            author: "Kodeco",
          },
          {
            id: 27,
            title: "Lập Trình Node.js Thực Chiến",
            author: "Lập Trình Việt",
          },
        ],
      },
      {
        id: "ai",
        name: "Trí Tuệ Nhân Tạo (AI)",
        books: [
          {
            id: 5,
            title: "Thực Hành Học Máy Với Scikit-Learn & TensorFlow",
            author: "Aurélien Géron",
          },
          {
            id: 6,
            title: "Học Sâu (Deep Learning)",
            author: "Ian Goodfellow",
          },
          {
            id: 7,
            title: "Trí Tuệ Nhân Tạo: Tiếp Cận Hiện Đại",
            author: "Stuart Russell",
          },
          {
            id: 8,
            title: "Học Generative AI với Python",
            author: "Jason Brownlee",
          },
          {
            id: 28,
            title: "Kỹ Nghệ Prompt (Prompt Engineering)",
            author: "Nhiều tác giả",
          },
        ],
      },
    ],
  },
  {
    id: "business",
    name: "Sách Kinh Doanh",
    categories: [
      {
        id: "management",
        name: "Quản Trị & Lãnh Đạo",
        books: [
          {
            id: 9,
            title: "Nhà Lãnh Đạo Không Chức Danh",
            author: "Robin Sharma",
          },
          {
            id: 10,
            title: "Từ Tốt Đến Vĩ Đại",
            author: "Jim Collins",
          },
          {
            id: 29,
            title: "Bắt Đầu Với Câu Hỏi Tại Sao",
            author: "Simon Sinek",
          },
          {
            id: 30,
            title: "Tư Duy Lãnh Đạo 360 Độ",
            author: "John C. Maxwell",
          },
        ],
      },
      {
        id: "finance",
        name: "Tài Chính & Đầu Tư",
        books: [
          {
            id: 11,
            title: "Nhà Đầu Tư Thông Minh",
            author: "Benjamin Graham",
          },
          {
            id: 12,
            title: "Cha Giàu Cha Nghèo",
            author: "Robert Kiyosaki",
          },
          {
            id: 31,
            title: "Tâm Lý Học Về Tiền",
            author: "Morgan Housel",
          },
          {
            id: 32,
            title: "Phương Pháp Wyckoff Thực Chiến",
            author: "Rubén Villahermosa",
          },
        ],
      },
      {
        id: "marketing-startup",
        name: "Marketing & Khởi Nghiệp",
        books: [
          {
            id: 13,
            title: "Khởi Nghiệp Tinh Gọn",
            author: "Eric Ries",
          },
          {
            id: 33,
            title: "Chiến Lược Đại Dương Xanh",
            author: "W. Chan Kim",
          },
          {
            id: 34,
            title: "Hiệu Ứng Lan Truyền (Contagious)",
            author: "Jonah Berger",
          },
        ],
      },
    ],
  },
  {
    id: "novels",
    name: "Sách Tiểu Thuyết",
    categories: [
      {
        id: "classics",
        name: "Tiểu Thuyết Kinh Điển",
        books: [
          {
            id: 14,
            title: "Nhà Giả Kim",
            author: "Paulo Coelho",
          },
          {
            id: 35,
            title: "Bố Già (The Godfather)",
            author: "Mario Puzo",
          },
          {
            id: 36,
            title: "Không Gia Đình",
            author: "Hector Malot",
          },
          {
            id: 37,
            title: "Giết Con Chim Nhại",
            author: "Harper Lee",
          },
        ],
      },
      {
        id: "mystery",
        name: "Trinh Thám & Viễn Tưởng",
        books: [
          {
            id: 15,
            title: "Sherlock Holmes Toàn Tập",
            author: "Arthur Conan Doyle",
          },
          {
            id: 16,
            title: "Mật Mã Da Vinci",
            author: "Dan Brown",
          },
          {
            id: 38,
            title: "Phía Sau Nghi Can X",
            author: "Keigo Higashino",
          },
          {
            id: 39,
            title: "1984 - Xã Hội Giả Tưởng",
            author: "George Orwell",
          },
        ],
      },
    ],
  },
  {
    id: "psychology",
    name: "Sách Tâm Lý Học",
    categories: [
      {
        id: "applied",
        name: "Tâm Lý Ứng Dụng",
        books: [
          {
            id: 17,
            title: "Tư Duy Nhanh Và Chậm",
            author: "Daniel Kahneman",
          },
          {
            id: 18,
            title: "Tâm Lý Học Đám Đông",
            author: "Gustave Le Bon",
          },
          {
            id: 40,
            title: "Nghệ Thuật Tư Duy Rành Mạch",
            author: "Rolf Dobelli",
          },
          {
            id: 41,
            title: "Lối Tư Duy Khác Biệt (Mindset)",
            author: "Carol Dweck",
          },
        ],
      },
      {
        id: "development",
        name: "Phát Triển Bản Thân",
        books: [
          {
            id: 19,
            title: "Thói Quen Nguyên Tử (Atomic Habits)",
            author: "James Clear",
          },
          {
            id: 20,
            title: "Đắc Nhân Tâm",
            author: "Dale Carnegie",
          },
          {
            id: 42,
            title: "Đời Ngắn Đừng Ngủ Dài",
            author: "Robin Sharma",
          },
          {
            id: 43,
            title: "Sức Mạnh Của Sự Tập Trung",
            author: "Jack Canfield",
          },
        ],
      },
    ],
  },
  {
    id: "science",
    name: "Sách Khoa Học",
    categories: [
      {
        id: "nature",
        name: "Khoa Học Tự Nhiên",
        books: [
          {
            id: 21,
            title: "Lược Sử Thời Gian",
            author: "Stephen Hawking",
          },
          {
            id: 22,
            title: "Vũ Trụ (Cosmos)",
            author: "Carl Sagan",
          },
          {
            id: 44,
            title: "Nguồn Gốc Các Loài",
            author: "Charles Darwin",
          },
          {
            id: 45,
            title: "Bản Thiết Kế Vũ Trụ (The Grand Design)",
            author: "Stephen Hawking",
          },
        ],
      },
      {
        id: "math",
        name: "Toán Học & Logic",
        books: [
          {
            id: 46,
            title: "Định Lý Cuối Cùng Của Fermat",
            author: "Simon Singh",
          },
          {
            id: 47,
            title: "Cuộc Chơi Toán Học",
            author: "Martin Gardner",
          },
          {
            id: 48,
            title: "Lý Thuyết Trò Chơi",
            author: "Ken Binmore",
          },
        ],
      },
    ],
  },
  {
    id: "kids",
    name: "Sách Thiếu Nhi",
    categories: [
      {
        id: "literature",
        name: "Văn Học Thiếu Nhi",
        books: [
          {
            id: 23,
            title: "Dế Mèn Phiêu Lưu Ký",
            author: "Tô Hoài",
          },
          {
            id: 24,
            title: "Kính Vạn Hoa",
            author: "Nguyễn Nhật Ánh",
          },
          {
            id: 49,
            title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
            author: "Nguyễn Nhật Ánh",
          },
          {
            id: 50,
            title: "Hoàng Tử Bé",
            author: "Antoine de Saint-Exupéry",
          },
        ],
      },
      {
        id: "discovery",
        name: "Khám Phá Tri Thức",
        books: [
          {
            id: 51,
            title: "Bách Khoa Toàn Thư Cho Bé",
            author: "Nhiều tác giả",
          },
          {
            id: 52,
            title: "Khoa Học Vui Cho Trẻ",
            author: "Nhiều tác giả",
          },
        ],
      },
    ],
  },
  {
    id: "history",
    name: "Sách Lịch Sử",
    categories: [
      {
        id: "vietnam",
        name: "Lịch Sử Việt Nam",
        books: [
          {
            id: 25,
            title: "Việt Nam Sử Lược",
            author: "Trần Trọng Kim",
          },
          {
            id: 53,
            title: "Đại Việt Sử Ký Toàn Thư",
            author: "Ngô Sĩ Liên",
          },
          {
            id: 54,
            title: "Lịch Sử Nội Chiến Việt Nam",
            author: "Tạ Chí Đại Trường",
          },
        ],
      },
      {
        id: "world",
        name: "Lịch Sử Thế Giới",
        books: [
          {
            id: 26,
            title: "Lược Sử Loài Người (Sapiens)",
            author: "Yuval Noah Harari",
          },
          {
            id: 55,
            title: "Súng, Vi Trùng Và Thép",
            author: "Jared Diamond",
          },
          {
            id: 56,
            title: "Lược Sử Tương Lai (Homo Deus)",
            author: "Yuval Noah Harari",
          },
        ],
      },
    ],
  },
  {
    id: "languages",
    name: "Sách Ngoại Ngữ",
    categories: [
      {
        id: "english",
        name: "Học Tiếng Anh",
        books: [
          {
            id: 27,
            title: "Ngữ Pháp Tiếng Anh Giải Thích",
            author: "Mai Lan Hương",
          },
          {
            id: 57,
            title: "Luyện Thi IELTS Collins",
            author: "Collins",
          },
          {
            id: 58,
            title: "Tiếng Anh Giao Tiếp Hàng Ngày",
            author: "Nhiều tác giả",
          },
        ],
      },
      {
        id: "other-languages",
        name: "Các Ngôn Ngữ Khác",
        books: [
          {
            id: 59,
            title: "Tự Học Tiếng Nhật Cho Người Mới",
            author: "Nhiều tác giả",
          },
          {
            id: 60,
            title: "Tiếng Trung Giao Tiếp Cấp Tốc",
            author: "Nhiều tác giả",
          },
        ],
      },
    ],
  },
];

export const parentCategories = categoriesData.map((cat) => ({
  id: cat.id,
  name: cat.name,
}));
