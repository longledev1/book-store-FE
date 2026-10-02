import React, { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

interface Article {
  id: string;
  title: string;
  date: string;
  summary: string;
  image: string;
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Tương lai của việc đọc sách trong kỷ nguyên AI",
    date: "20 THÁNG 5, 2024",
    summary: "Làm thế nào AI đang giúp con người hấp thụ kiến thức nhanh hơn bao giờ hết, chuyển đổi thói quen đọc sách truyền thống sang tương tác dữ liệu hai chiều.",
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "2",
    title: "5 cuốn sách thay đổi tư duy về công nghệ",
    date: "15 THÁNG 5, 2024",
    summary: "Danh sách những tác phẩm buộc phải đọc để hiểu về thế giới mới, sự hội tụ của dữ liệu lớn, điện toán đám mây và trí tuệ nhân tạo.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "3",
    title: "Nghệ thuật đọc sách hiệu quả của các CEO hàng đầu",
    date: "10 THÁNG 5, 2024",
    summary: "Bí quyết chắt lọc tri thức, quản lý thời gian và áp dụng những bài học kinh doanh từ sách vào thực tiễn quản trị doanh nghiệp.",
    image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "4",
    title: "Trí tuệ nhân tạo và hành trình sáng tạo nội dung",
    date: "05 THÁNG 5, 2024",
    summary: "Khám phá cách các mô hình ngôn ngữ lớn (LLM) hỗ trợ nhà văn, nhà báo tối ưu hóa quy trình viết và nghiên cứu tư liệu.",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "5",
    title: "Làm thế nào để xây dựng thói quen đọc sách hàng ngày",
    date: "28 THÁNG 4, 2024",
    summary: "Phương pháp đơn giản ứng dụng tâm lý học hành vi giúp bạn duy trì 15 phút đọc sách mỗi ngày hiệu quả và không nhàm chán.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "6",
    title: "Khám phá các phương pháp ghi nhớ siêu đẳng",
    date: "22 THÁNG 4, 2024",
    summary: "Tìm hiểu kỹ thuật Mind Map và Memory Palace (Cung điện Ký ức) giúp nhân đôi khả năng nhớ nội dung sách đã đọc.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "7",
    title: "Kinh tế học hành vi: Giải mã quyết định mua sắm sách",
    date: "18 THÁNG 4, 2024",
    summary: "Tại sao chúng ta thường mua sách nhiều hơn số lượng có thể đọc? Phân tích tâm lý học đằng sau hội chứng Tsundoku nổi tiếng.",
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "8",
    title: "Tư duy thiết kế trong cuộc sống hiện đại",
    date: "12 THÁNG 4, 2024",
    summary: "Áp dụng các bước tư duy thiết kế (Design Thinking) để giải quyết các vấn đề phức tạp trong công việc và định hình phong cách sống.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=300"
  }
];

export default function BlogAndNewsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <section className="bg-white border-b border-border-light font-sans relative overflow-hidden">
      {/* Self-contained CSS injection for cards cursor-pointer */}
      <style>{`
        .blog-article-card {
          cursor: pointer !important;
        }
      `}</style>
      
      {/* ================= SECTION 1: BLOG ARTICLES (Inside Grid Container) ================= */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 space-y-12">
        {/* Headings - Centered */}
        <div className="text-center space-y-3">
          <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest block">
            Kiến thức & Chia sẻ
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-neutral-dark tracking-tight">
            Tạp Chí Tri Thức
          </h2>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Cập nhật những xu hướng công nghệ mới nhất, các bài viết phân tích sâu và bài viết chất lượng từ ban biên tập.
          </p>
        </div>

        {/* 8 Articles Grid (2 Column layout spanning full container width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
          {mockArticles.map((article) => (
            <div 
              key={article.id} 
              className="group blog-article-card flex flex-col sm:flex-row gap-5 items-start sm:items-center p-4 rounded-2xl hover:bg-slate-50/50 transition-all duration-300 cursor-pointer"
            >
              {/* Article Image */}
              <div className="w-full sm:w-40 aspect-[4/3] rounded-2xl overflow-hidden border border-slate-100 shrink-0 shadow-sm relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Article Content */}
              <div className="text-left space-y-2 min-w-0">
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase block">
                  {article.date}
                </span>
                <h3 className="font-bold text-sm md:text-base text-neutral-dark group-hover:text-primary transition-colors duration-250 leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION 2: NEWSLETTER BOX (FULL VIEWPORT WIDTH) ================= */}
      <div className="w-full bg-[#0B0F19] border-t border-slate-900 py-16 md:py-20 relative overflow-hidden text-center">
        
        {/* Background glowing ambient lights */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 relative z-10 space-y-6">
          {/* Inner Content */}
          <div className="space-y-3">
            <h3 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
              Sẵn sàng khám phá chương tiếp theo?
            </h3>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Đăng ký ngay để nhận thông báo về những đầu sách AI mới nhất và ưu đãi độc quyền hàng tuần.
            </p>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-950/20 border border-emerald-900/30 py-3.5 rounded-full animate-fade-in">
                <CheckCircle className="w-4 h-4" />
                <span>Cảm ơn bạn! LuminaBook sẽ gửi thông báo sớm nhất.</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn"
                  className="w-full px-5 py-3 rounded-full bg-slate-900/90 border border-slate-800/80 focus:border-primary/50 text-white text-xs placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-1 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-xs font-bold text-slate-950 hover:text-primary transition-all duration-300 shadow cursor-pointer shrink-0 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Nhận thông báo</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>
        </div>

      </div>

    </section>
  );
}
