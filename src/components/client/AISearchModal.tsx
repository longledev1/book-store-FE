import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Search, CornerDownLeft, Database, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface AISearchModalProps {
  onClose: () => void;
}

interface BookResult {
  title: string;
  author: string;
  category: string;
  matchScore: number;
  description: string;
  image: string;
  id: string;
}

const searchSuggestions = [
  "Sách khoa học viễn tưởng về tương lai trí tuệ nhân tạo",
  "Sách dạy kinh doanh khởi nghiệp tinh gọn và tài chính",
  "Lược sử loài người và các học thuyết triết học cổ đại"
];

const mockResults: Record<string, BookResult[]> = {
  scifi: [
    {
      id: "1",
      title: "Kỷ Nguyên Trí Tuệ Nhân Tạo",
      author: "Max Tegmark",
      category: "Khoa Học & Công Nghệ",
      matchScore: 98.4,
      description: "Cuốn sách khám phá tương lai của nhân loại trong kỷ nguyên AI, đưa ra các kịch bản từ siêu trí tuệ thống trị đến sự cộng sinh hoàn hảo giữa con người và máy móc.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "2",
      title: "Vũ Trụ Trong Vỏ Hạt Dẻ",
      author: "Stephen Hawking",
      category: "Khoa Học & Công Nghệ",
      matchScore: 89.7,
      description: "Khám phá các bí ẩn sâu thẳm của vật lý lý thuyết, từ cơ học lượng tử, thuyết tương đối rộng đến lý thuyết siêu dây và vũ trụ học hiện đại.",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=120"
    }
  ],
  finance: [
    {
      id: "3",
      title: "Khởi Nghiệp Tinh Gọn",
      author: "Eric Ries",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 97.2,
      description: "Phương pháp khởi nghiệp đột phá giúp các doanh nghiệp tối ưu hóa nguồn lực, thử nghiệm nhanh chóng để thích ứng với thị trường thay đổi liên tục.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "4",
      title: "Đầu Tư Chứng Khoán Như Triệu Phú",
      author: "William J. O'Neil",
      category: "Kinh Tế & Khởi Nghiệp",
      matchScore: 91.5,
      description: "Hướng dẫn thực tế về phương pháp CANSLIM nổi tiếng để tìm kiếm các cổ phiếu tăng trưởng đột phá trên thị trường tài chính toàn cầu.",
      image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=120"
    }
  ],
  history: [
    {
      id: "5",
      title: "Sapiens: Lược Sử Loài Người",
      author: "Yuval Noah Harari",
      category: "Lịch Sử & Triết Học",
      matchScore: 99.1,
      description: "Tác phẩm vĩ đại tóm tắt toàn bộ lịch sử tiến hóa của loài người từ thời tiền sử đến thế kỷ 21, đặt ra những câu hỏi triết học sâu sắc về tương lai nhân loại.",
      image: "https://images.unsplash.com/photo-1460518451285-cd3ab43ec357?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "6",
      title: "Lược Sử Thời Gian",
      author: "Stephen Hawking",
      category: "Lịch Sử & Triết Học",
      matchScore: 89.2,
      description: "Tác phẩm khoa học đại chúng kinh điển giải thích về nguồn gốc vũ trụ, không gian, thời gian và hố đen vũ trụ một cách vô cùng dễ hiểu.",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=120"
    }
  ],
  default: [
    {
      id: "1",
      title: "Kỷ Nguyên Trí Tuệ Nhân Tạo",
      author: "Max Tegmark",
      category: "Khoa Học & Công Nghệ",
      matchScore: 95.8,
      description: "Tương lai của nhân loại trong kỷ nguyên AI dưới góc nhìn của giáo sư vật lý MIT.",
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=120"
    },
    {
      id: "5",
      title: "Sapiens: Lược Sử Loài Người",
      author: "Yuval Noah Harari",
      category: "Lịch Sử & Triết Học",
      matchScore: 94.2,
      description: "Khám phá lịch sử tiến hóa nhân loại qua lăng kính khoa học và xã hội học.",
      image: "https://images.unsplash.com/photo-1460518451285-cd3ab43ec357?auto=format&fit=crop&q=80&w=120"
    }
  ]
};

export default function AISearchModal({ onClose }: AISearchModalProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [results, setResults] = useState<BookResult[] | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setSearching(true);
    setResults(null);
    setSearchStep(1);

    // Step 1: Connecting pgvector
    setTimeout(() => {
      setSearchStep(2);
      // Step 2: Querying Text Embeddings
      setTimeout(() => {
        setSearchStep(3);
        // Step 3: Cosine Similarity Calculation
        setTimeout(() => {
          setSearchStep(4);
          // Step 4: Formatting results
          setTimeout(() => {
            // Determine result group based on keywords
            const lowerQuery = searchQuery.toLowerCase();
            let selectedResults = mockResults.default;
            if (lowerQuery.includes("viễn tưởng") || lowerQuery.includes("ai") || lowerQuery.includes("robot") || lowerQuery.includes("công nghệ")) {
              selectedResults = mockResults.scifi;
            } else if (lowerQuery.includes("tài chính") || lowerQuery.includes("kinh tế") || lowerQuery.includes("khởi nghiệp") || lowerQuery.includes("tiền")) {
              selectedResults = mockResults.finance;
            } else if (lowerQuery.includes("lịch sử") || lowerQuery.includes("triết học") || lowerQuery.includes("loài người")) {
              selectedResults = mockResults.history;
            }
            
            setResults(selectedResults);
            setSearching(false);
          }, 300);
        }, 500);
      }, 500);
    }, 400);
  };

  const getStepText = () => {
    switch (searchStep) {
      case 1:
        return "Đang kết nối pgvector database...";
      case 2:
        return "Đang tạo embeddings (text-embedding-3-small)...";
      case 3:
        return "Đang tính toán Cosine Similarity tương đồng vector...";
      case 4:
        return "Đang định dạng danh sách gợi ý tốt nhất...";
      default:
        return "Đang xử lý...";
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-150 shadow-2xl overflow-hidden flex flex-col font-sans max-h-[85vh]"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 leading-tight">Tìm kiếm Sách thông minh bằng AI</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tìm kiếm bằng suy nghĩ, cảm xúc hoặc tóm tắt ý tưởng cốt truyện</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input box */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
              placeholder="Ví dụ: Sách khoa học viễn tưởng về du hành không gian và lỗ đen..."
              disabled={searching}
              className="w-full pl-12 pr-28 py-3 text-sm bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200/60 focus:border-primary rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 font-medium text-neutral-dark placeholder-slate-400 transition-all"
            />
            
            {/* Keyboard shortcut label / Searching status */}
            <div className="absolute right-3 flex items-center gap-1.5">
              <button
                onClick={() => handleSearch(query)}
                disabled={searching || !query.trim()}
                className="px-3.5 py-1.5 bg-primary hover:bg-blue-600 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer select-none"
              >
                <span>Gửi</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Suggestions */}
          {!searching && !results && (
            <div className="mt-4 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 select-none">
                Tìm kiếm gợi ý
              </span>
              <div className="flex flex-col gap-2">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl border border-slate-100 hover:border-primary/20 bg-slate-50/50 hover:bg-blue-50/30 text-xs font-medium text-slate-650 hover:text-primary transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Display Area */}
        <div className="flex-grow overflow-y-auto p-6 bg-slate-50/30">
          
          {/* AI Search Loading status */}
          {searching && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <Database className="absolute w-4 h-4 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800 animate-pulse">{getStepText()}</p>
                <p className="text-xs text-slate-400 mt-1">AI engine đang kết hợp tính toán vector tương đồng trong database pgvector</p>
              </div>
            </div>
          )}

          {/* Search Results */}
          {!searching && results && (
            <div className="space-y-4 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block select-none">
                Đã tìm thấy {results.length} kết quả tương đồng nhất
              </span>
              
              <div className="space-y-3.5">
                {results.map((book) => (
                  <div 
                    key={book.id} 
                    className="p-4 bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex gap-4 relative group"
                  >
                    {/* Cover image */}
                    <div className="w-16 h-20 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Book Details */}
                    <div className="flex-grow pr-16">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-650 text-[10px] font-bold rounded-md">
                          {book.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-850 mt-1.5 leading-tight group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">Tác giả: {book.author}</p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    {/* Similarity score badge */}
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                      <span className="px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold rounded-lg flex items-center gap-1 select-none">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>{book.matchScore}% Match</span>
                      </span>
                      
                      <Link 
                        to={`/books/${book.id}`}
                        onClick={onClose}
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5 mt-6"
                      >
                        <span>Xem sách</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </motion.div>
    </div>
  );
}
