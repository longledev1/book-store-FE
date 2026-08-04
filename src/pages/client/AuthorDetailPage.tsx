import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Calendar, Award, BookOpen } from "lucide-react";

import { mockBooks } from "../../constants/booksData";
import SectionBadge from "../../components/client/SectionBadge";
import BookCard from "../../components/client/BookCard";

// Detailed mock data for authors
interface AuthorProfile {
  name: string;
  gender: "Nam" | "Nữ" | "N/A";
  dob: string;
  avatar: string;
  bio: string;
}

const authorsProfiles: Record<string, AuthorProfile> = {
  "Raymond Murphy": {
    name: "Raymond Murphy",
    gender: "Nam",
    dob: "17/10/1943",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Raymond Murphy là một tác giả và nhà giáo educator nổi tiếng thế giới người Anh, chuyên về giảng dạy tiếng Anh như một ngôn ngữ thứ hai (ESL). Ông nổi tiếng nhất với loạt sách 'English Grammar in Use' do Nhà xuất bản Đại học Cambridge phát hành, được hàng triệu học sinh, sinh viên và giảng viên trên toàn cầu tin tưởng lựa chọn làm tài liệu tự học chuẩn mực.",
  },
  "Alex Rivers": {
    name: "Alex Rivers",
    gender: "Nam",
    dob: "12/05/1982",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Alex Rivers là một chuyên gia tư vấn chuyển đổi số doanh nghiệp hàng đầu thế giới với hơn 15 năm kinh nghiệm làm việc tại các tập đoàn công nghệ lớn ở Thung lũng Silicon. Các tác phẩm của ông tập trung chia sẻ chiến lược kinh doanh thực chiến, quản trị khủng hoảng và định hướng chuyển dịch mô hình doanh nghiệp trong thời đại số.",
  },
  "Sarah Chen": {
    name: "Sarah Chen",
    gender: "Nữ",
    dob: "28/09/1990",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Sarah Chen là kỹ sư nghiên cứu học máy hàng đầu tại Google DeepMind. Cô sở hữu nhiều công bố khoa học quan trọng trong lĩnh vực xử lý ngôn ngữ tự nhiên (NLP) và phát triển các mô hình AI ngôn ngữ lớn. Cuốn sách của cô hướng tới việc phổ cập và xây dựng tâm thế chuẩn mực đón đầu kỷ nguyên Trí tuệ Nhân tạo.",
  },
  "Jon Duckett": {
    name: "Jon Duckett",
    gender: "Nam",
    dob: "03/04/1976",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Jon Duckett là nhà thiết kế và nhà phát triển web chuyên nghiệp với hơn 20 năm kinh nghiệm thiết kế giao diện số cho các tập đoàn toàn cầu. Sách của ông nổi tiếng nhờ phong cách minh họa trực quan trực tiếp bằng hình ảnh màu sắc sắc nét, giúp kiến thức lập trình khô khan trở nên sinh động và cực kỳ dễ hiểu đối với người mới bắt đầu.",
  },
};

export default function AuthorDetailPage() {
  const { name } = useParams<{ name: string }>();
  const decodedName = decodeURIComponent(name || "");

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  // Load profile data or generate fallbacks
  const profile: AuthorProfile = authorsProfiles[decodedName] || {
    name: decodedName,
    gender: "N/A",
    dob: "N/A",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    bio: "Tác giả uy tín, cộng tác và biên soạn nhiều đầu sách chuyên môn chất lượng cao, chia sẻ kiến thức hữu ích thuộc nhiều lĩnh vực khoa học, nghệ thuật và đời sống được phân phối chính hãng tại hệ thống nhà sách LuminaBook.",
  };

  // Find all books published by this author in mockBooks
  const publishedBooks = mockBooks.filter(
    (b) => b.author.toLowerCase() === decodedName.toLowerCase()
  );

  return (
    <div className="bg-slate-50/30 min-h-screen font-sans pb-16 pt-8 text-left">
      <div className="container-custom">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-1.5 text-xs font-semibold text-slate-400 select-none">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-primary transition-colors">Cửa hàng sách</Link>
          <span>/</span>
          <span className="text-slate-600 font-bold">Tác giả {profile.name}</span>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Author Profile Card (Sticky) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 z-10 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-sm space-y-6">
              
              {/* Avatar & Name block */}
              <div className="text-center space-y-3.5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm mx-auto">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight uppercase">
                    {profile.name}
                  </h1>
                </div>
              </div>

              {/* Personal specs list */}
              <div className="border-t border-b border-slate-50 py-4 divide-y divide-slate-50 text-xs sm:text-sm font-bold">
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-455 font-medium flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Giới tính:</span>
                  </span>
                  <span className="text-slate-800">{profile.gender}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-455 font-medium flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Ngày sinh:</span>
                  </span>
                  <span className="text-slate-800">{profile.dob}</span>
                </div>
              </div>

              {/* Biography block */}
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-black text-primary border-b border-slate-100 pb-2 uppercase tracking-wider select-none">
                  Giới thiệu tác giả
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>

            </div>
          </aside>

          {/* RIGHT COLUMN: Published Books */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Header info */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/5 border border-primary/10 flex h-9 w-9 items-center justify-center rounded-2xl text-primary shadow-sm">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <div className="text-sm font-extrabold text-slate-800 select-none flex items-center gap-1.5">
                  <SectionBadge title="Tác phẩm đã phát hành" />
                </div>
              </div>
              <span className="text-xs text-slate-400 font-bold select-none pl-3">
                Tìm thấy {publishedBooks.length} cuốn sách
              </span>
            </div>

            {/* Books Grid */}
            {publishedBooks.length === 0 ? (
              <div className="py-24 text-center text-slate-450 text-xs font-bold border border-dashed border-slate-200 rounded-3xl bg-white select-none">
                Hiện tại chưa có thông tin tác phẩm của tác giả này trên kệ sách.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {publishedBooks.map((item) => (
                  <BookCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    author={item.author}
                    category={item.category}
                    price={item.price}
                    rating={item.rating}
                    image={item.image}
                    isNew={item.isNew}
                    aiScore={item.aiScore}
                    showAiScore={!!item.aiScore}
                  />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
