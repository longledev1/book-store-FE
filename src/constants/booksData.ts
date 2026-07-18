export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  isNew: boolean;
  aiScore: number;
}

export const mockBooks: Book[] = [
  {
    id: "1",
    title: "Chiến Lược Số Hóa",
    author: "Alex Rivers",
    category: "KINH DOANH & QUẢN TRỊ",
    price: "249.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 98
  },
  {
    id: "2",
    title: "Tâm Thế Trí Tuệ Nhân Tạo",
    author: "Sarah Chen",
    category: "CÔNG NGHỆ THÔNG TIN",
    price: "189.000đ",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 95
  },
  {
    id: "3",
    title: "Kết Nối Con Người",
    author: "Dr. James Miller",
    category: "TÂM LÝ ỨNG DỤNG",
    price: "320.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 92
  },
  {
    id: "4",
    title: "Tia Sáng Sáng Tạo",
    author: "Maya Lee",
    category: "PHÁT TRIỂN BẢN THÂN",
    price: "155.000đ",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 89
  },
  {
    id: "5",
    title: "Lập Trình Tương Lai",
    author: "John Doe",
    category: "CÔNG NGHỆ THÔNG TIN",
    price: "215.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 94
  },
  {
    id: "6",
    title: "Tư Duy Thiết Kế 101",
    author: "Alice W.",
    category: "NGHỆ THUẬT & THIẾT KẾ",
    price: "175.000đ",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 87
  },
  {
    id: "7",
    title: "Kinh Tế Học Hành Vi",
    author: "Richard T.",
    category: "KINH DOANH & QUẢN TRỊ",
    price: "280.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 91
  },
  {
    id: "8",
    title: "Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    category: "LỊCH SỬ DÂN TỘC & THẾ GIỚI",
    price: "350.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1460518451285-cd3ab43ec357?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 96
  },
  {
    id: "9",
    title: "Tâm Lý Học Đám Đông",
    author: "Gustave Le Bon",
    category: "TÂM LÝ ỨNG DỤNG",
    price: "125.000đ",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 83
  },
  {
    id: "10",
    title: "Vật Lý Lý Thuyết Hiện Đại",
    author: "Stephen Hawking",
    category: "KHOA HỌC TỰ NHIÊN",
    price: "390.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 97
  },
  {
    id: "11",
    title: "Lược Sử Thời Gian",
    author: "Stephen Hawking",
    category: "KHOA HỌC TỰ NHIÊN",
    price: "195.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200",
    isNew: true,
    aiScore: 90
  },
  {
    id: "12",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    category: "TÂM LÝ ỨNG DỤNG",
    price: "110.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 93
  },
  {
    id: "13",
    title: "Khởi Nghiệp Tinh Gọn",
    author: "Eric Ries",
    category: "KHỞI NGHIỆP & ĐẦU TƯ",
    price: "189.000đ",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 86
  },
  {
    id: "14",
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    category: "VĂN HỌC & TIỂU THUYẾT",
    price: "99.000đ",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 88
  },
  {
    id: "15",
    title: "Trí Tuệ Do Thái",
    author: "Eran Katz",
    category: "PHÁT TRIỂN BẢN THÂN",
    price: "135.000đ",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 85
  },
  {
    id: "16",
    title: "Cha Giàu Cha Nghèo",
    author: "Robert Kiyosaki",
    category: "KHỞI NGHIỆP & ĐẦU TƯ",
    price: "150.000đ",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=200",
    isNew: false,
    aiScore: 91
  }
];
