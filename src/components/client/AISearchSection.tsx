import React, { useState } from "react";
import { Sparkles, Database, Loader2, Send, BookOpen, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface BookMatch {
  id: string;
  title: string;
  matchScore: number;
  description: string;
  category: string;
  image: string;
}

const suggestionsList = [
  { text: "Sách kinh tế vĩ mô", query: "Sách kinh tế vĩ mô, tài chính và khởi nghiệp đầu tư" },
  { text: "Tư duy thiết kế", query: "Tôi muốn học về tư duy thiết kế (design thinking) và phát triển sản phẩm sáng tạo" },
  { text: "Phát triển bản thân", query: "Tôi muốn tìm một cuốn sách giúp cải thiện kỹ năng giao tiếp và tâm lý học hành vi..." },
  { text: "Lịch sử Việt Nam", query: "Sách lịch sử Việt Nam qua các triều đại phong kiến" }
];

const mockMatches: Record<string, BookMatch[]> = {
  communication: [
    {
      id: "1",
      title: "Nghệ thuật giao tiếp",
      category: "Kỹ Năng & Phát Triển",
      matchScore: 98,
      description: "Cuốn sách này khớp hoàn hảo với yêu cầu về tâm lý hành vi của bạn...",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "2",
      title: "Tâm lý học đám đông",
      category: "Lịch Sử & Triết Học",
      matchScore: 85,
      description: "Phân tích sâu về hành vi xã hội và các mô hình tương tác trong tập thể...",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "3",
      title: "Khéo Ăn Nói Sẽ Có Thiên Hạ",
      category: "Kỹ Năng & Phát Triển",
      matchScore: 82,
      description: "Bí quyết ứng xử và giao tiếp xã hội đỉnh cao để mở ra các cơ hội thành công...",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "4",
      title: "Đắc Nhân Tâm",
      category: "Kỹ Năng & Phát Triển",
      matchScore: 78,
      description: "Tác phẩm kinh điển thế giới về nghệ thuật đối nhân xử thế và chinh phục lòng người...",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "5",
      title: "Sức Mạnh Của Ngôn Từ",
      category: "Kỹ Năng & Phát Triển",
      matchScore: 75,
      description: "Khám phá cách sử dụng ngôn từ khôn ngoan để tạo dựng thiện cảm và thuyết phục đối tác...",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "6",
      title: "Ngôn Ngữ Cơ Thể",
      category: "Kỹ Năng & Phát Triển",
      matchScore: 71,
      description: "Đọc vị đối phương qua các phản ứng cử chỉ, ánh mắt và tư thế phi ngôn ngữ tự nhiên...",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=120"
    }
  ],
  finance: [
    {
      id: "7",
      title: "Kinh tế vĩ mô đại cương",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 97,
      description: "Cung cấp nền tảng kiến thức vững chắc về cung cầu, lạm phát và chu kỳ kinh tế...",
      image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "8",
      title: "Khởi nghiệp tinh gọn",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 88,
      description: "Phù hợp lý tưởng cho nhu cầu tư duy kinh doanh và phát triển dự án tinh gọn...",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "9",
      title: "Cha Giàu Cha Nghèo",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 84,
      description: "Các bài học thực tế về quản lý tài chính cá nhân, đầu tư tài sản và tư duy làm giàu...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "10",
      title: "Nhà Đầu Tư Thông Minh",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 81,
      description: "Cuốn sách gối đầu giường về triết lý đầu tư giá trị an toàn bền vững của Benjamin Graham...",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "11",
      title: "Bí Quyết Tư Duy Triệu Phú",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 78,
      description: "Tái định hình kế hoạch tài chính trong tâm thức giúp thay đổi hoàn toàn thói quen tiền bạc...",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "12",
      title: "Chiến Tranh Tiền Tệ",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 74,
      description: "Khám phá lịch sử tiền tệ và các thế lực ngân hàng đứng sau chi phối nền kinh tế toàn cầu...",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=120"
    }
  ],
  design: [
    {
      id: "13",
      title: "Tư duy thiết kế đột phá",
      category: "Khoa Học & Công Nghệ",
      matchScore: 96,
      description: "Cuốn sách tuyệt vời giúp rèn luyện khả năng giải quyết vấn đề sáng tạo và thiết kế...",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "14",
      title: "Thiết kế trải nghiệm người dùng",
      category: "Khoa Học & Công Nghệ",
      matchScore: 84,
      description: "Nguyên lý xây dựng sản phẩm công nghệ thân thiện, tối ưu hóa giao diện và trải nghiệm...",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "15",
      title: "Don't Make Me Think",
      category: "Khoa Học & Công Nghệ",
      matchScore: 81,
      description: "Tác phẩm kinh điển về tối ưu hóa tính khả dụng (usability) trên giao diện website...",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "16",
      title: "The Design of Everyday Things",
      category: "Khoa Học & Công Nghệ",
      matchScore: 79,
      description: "Lý giải nguyên lý thiết kế các vật dụng thường ngày sao cho tiện dụng và thân thiện nhất...",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "17",
      title: "Bố Cục Trong Thiết Kế",
      category: "Khoa Học & Công Nghệ",
      matchScore: 76,
      description: "Các nguyên lý sắp xếp bố cục layout, khoảng trắng và phân cấp thông tin thị giác...",
      image: "https://images.unsplash.com/photo-1541462608141-2f528b320011?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "18",
      title: "Phối Màu Trong Thiết Kế",
      category: "Khoa Học & Công Nghệ",
      matchScore: 72,
      description: "Lý thuyết màu sắc và các phương pháp phối màu tạo cảm xúc cuốn hút người dùng...",
      image: "https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&q=80&w=120"
    }
  ],
  history: [
    {
      id: "19",
      title: "Lịch sử Việt Nam toàn thư",
      category: "Lịch Sử & Triết Học",
      matchScore: 99,
      description: "Ghi chép chi tiết về các vương triều phong kiến và lịch sử hào hùng của dân tộc...",
      image: "https://images.unsplash.com/photo-1460518451285-cd3ab43ec357?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "20",
      title: "Lược sử loài người",
      category: "Lịch Sử & Triết Học",
      matchScore: 82,
      description: "Khám phá hành trình tiến hóa và phát triển xã hội của loài người qua các thời kỳ...",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "21",
      title: "Lược sử Triết học Tây phương",
      category: "Lịch Sử & Triết Học",
      matchScore: 80,
      description: "Tổng hợp dòng chảy tư tưởng của các triết gia vĩ đại từ thời Hy Lạp cổ đại...",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "22",
      title: "Súng, Vi Trùng Và Thép",
      category: "Lịch Sử & Triết Học",
      matchScore: 78,
      description: "Giải thích nguồn gốc của sự thịnh vượng và số phận khác nhau của các xã hội loài người...",
      image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "23",
      title: "Lịch Sử Thế Giới 100 Cuốn Sách",
      category: "Lịch Sử & Triết Học",
      matchScore: 75,
      description: "Tái hiện các cột mốc lịch sử loài người thông qua những tác phẩm văn bản vĩ đại nhất...",
      image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "24",
      title: "Đại Việt Sử Ký Toàn Thư",
      category: "Lịch Sử & Triết Học",
      matchScore: 71,
      description: "Bộ chính sử biên niên cổ nhất và hoàn hảo nhất của chế độ phong kiến Việt Nam...",
      image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=120"
    }
  ]
};

export default function AISearchSection() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookMatch[] | null>(null);

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setResults(null);

    // Simulate AI semantic calculations
    setTimeout(() => {
      const lowerText = inputText.toLowerCase();
      let matchGroup = mockMatches.communication; // Default to communication to match user's screenshot

      if (lowerText.includes("vĩ mô") || lowerText.includes("kinh tế") || lowerText.includes("tài chính")) {
        matchGroup = mockMatches.finance;
      } else if (lowerText.includes("thiết kế") || lowerText.includes("tư duy")) {
        matchGroup = mockMatches.design;
      } else if (lowerText.includes("lịch sử") || lowerText.includes("việt nam")) {
        matchGroup = mockMatches.history;
      } else if (lowerText.includes("giao tiếp") || lowerText.includes("tâm lý")) {
        matchGroup = mockMatches.communication;
      }

      setResults(matchGroup);
      setLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (queryText: string) => {
    setInputText(queryText);
    // Automatically trigger search for better UX
    setTimeout(() => {
      setLoading(true);
      setResults(null);
      setTimeout(() => {
        const lowerText = queryText.toLowerCase();
        let matchGroup = mockMatches.communication;
        if (lowerText.includes("vĩ mô") || lowerText.includes("kinh tế") || lowerText.includes("tài chính")) {
          matchGroup = mockMatches.finance;
        } else if (lowerText.includes("thiết kế") || lowerText.includes("tư duy")) {
          matchGroup = mockMatches.design;
        } else if (lowerText.includes("lịch sử") || lowerText.includes("việt nam")) {
          matchGroup = mockMatches.history;
        }
        setResults(matchGroup);
        setLoading(false);
      }, 1200);
    }, 100);
  };

  return (
    <section className="py-16 md:py-24 bg-[#0B0F19] border-y border-slate-900 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center space-y-8 relative z-10">
        
        {/* Headings */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Hỏi AI bất cứ điều gì
          </h2>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Quên đi các từ khóa khô khan. Hãy mô tả cảm xúc hoặc nhu cầu của bạn.
          </p>
        </div>

        {/* Textarea AI Input box */}
        <div className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-2xl shadow-black/40 flex flex-col relative focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tôi muốn tìm một cuốn sách giúp cải thiện kỹ năng giao tiếp và tâm lý học hành vi..."
            disabled={loading}
            className="w-full bg-transparent text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none resize-none min-h-[110px] leading-relaxed"
          />

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800/60">
            {/* Left AI tag */}
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>pgvector Embedding Model</span>
            </div>

            {/* Right analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all cursor-pointer select-none active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang phân tích...</span>
                </>
              ) : (
                <>
                  <span>Phân tích</span>
                  <Send className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto pt-2">
          <span className="text-xs font-bold text-slate-500 select-none">Gợi ý:</span>
          {suggestionsList.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(item.query)}
              disabled={loading}
              className="px-4 py-2 rounded-full border border-slate-800/80 hover:border-primary/40 bg-slate-900/30 hover:bg-blue-950/20 text-xs font-semibold text-slate-400 hover:text-primary transition-all cursor-pointer disabled:opacity-50"
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* Dynamic Display Area (Loading & Results) */}
        {(loading || results) && (
          <div className="max-w-[1360px] mx-auto pt-4">
            <AnimatePresence mode="wait">
              
              {/* Loading scan state */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center py-8 space-y-3"
                >
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs font-bold text-slate-400 animate-pulse uppercase tracking-wider">
                    Đang phân tích ngữ nghĩa & xếp hạng độ tương đồng...
                  </p>
                </motion.div>
              )}

              {/* Results cards */}
              {!loading && results && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 text-left"
                >
                  {results.map((book) => {
                    const isHighMatch = book.matchScore >= 95;
                    return (
                      <Link
                        to={`/books/${book.id}`}
                        key={book.id}
                        className={`group p-5 rounded-2xl flex flex-col justify-between border bg-slate-900/20 hover:shadow-lg transition-all relative cursor-pointer ${
                          isHighMatch
                            ? "border-primary/30 bg-blue-950/10 shadow-lg shadow-primary/5"
                            : "border-slate-800/80"
                        }`}
                      >
                        <div>
                          {/* Upper row: Cover + Category + Match score */}
                          <div className="flex gap-3.5">
                            {/* Book Cover */}
                            <div className="w-12 h-16 bg-slate-950 border border-slate-800/50 rounded-lg overflow-hidden shrink-0">
                              <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>

                            {/* Category and Title */}
                            <div className="flex-grow min-w-0">
                              <span className="px-2 py-0.5 bg-slate-800 border border-slate-700/40 text-slate-200 text-[9px] font-bold rounded-md uppercase tracking-wider">
                                {book.category}
                              </span>
                              <h4 className="font-bold text-sm text-slate-100 mt-1.5 leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-200">
                                {book.title}
                              </h4>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-400 leading-relaxed mt-3.5 line-clamp-3">
                            {book.description}
                          </p>
                        </div>

                        {/* Bottom row: Match badge + View link */}
                        <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/50">
                          {/* Green match badge with Sparkle icon */}
                          <span className="px-2 py-1 bg-emerald-950/40 border border-emerald-800/30 text-emerald-400 text-[10px] font-bold rounded-lg flex items-center gap-1 select-none">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>{book.matchScore}% Match</span>
                          </span>

                          {/* View link (div styled as link) */}
                          <div className="text-xs font-bold text-primary group-hover:text-blue-400 group-hover:underline flex items-center gap-0.5 transition-colors">
                            <span>Xem sách</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}
