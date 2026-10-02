import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Search, CornerDownLeft, Database, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { searchProductsAPI } from "@/services/product.service";
import { resolveMediaUrl } from "@/utils/format";

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
  "Lập trình",
  "Marketing 5.0",
  "Kinh doanh"
];

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

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setSearching(true);
    setResults(null);
    setSearchStep(1);

    try {
      setSearchStep(2);
      const res: any = await searchProductsAPI(searchQuery.trim(), 10);
      setSearchStep(3);

      const rawData: any[] = res?.data?.results || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);

      // Lấy max score để làm mốc lọc nhiễu tương quan (Relative Threshold)
      const rawScores = rawData.map((item: any) => parseFloat(item.searchScore || "0"));
      const maxScore = Math.max(0, ...rawScores);

      const mappedResults: BookResult[] = [];

      rawData.forEach((item: any, idx: number) => {
        const numericScore = rawScores[idx];

        // Lọc bỏ kết quả bị nhiễu (điểm quá thấp hoặc < 58% so với kết quả hàng đầu)
        if (maxScore > 0) {
          const ratio = numericScore / maxScore;
          if (numericScore < 0.30 || ratio < 0.58) {
            return;
          }
        }

        const firstAlbum = item.albums?.[0];
        const rawUrl =
          firstAlbum?.url ||
          (firstAlbum as any)?.imageUrl ||
          firstAlbum?.media?.fileUrl ||
          firstAlbum?.media?.url ||
          item.imgUrl;

        const coverImg = resolveMediaUrl(rawUrl) || "/mock_data.png";

        const categoryName = item.categories?.[0]?.name || item.category || "Sách";
        const authorName = item.bookDetail?.author || item.authors?.[0]?.name || item.author || "Nhiều tác giả";

        const ratio = maxScore > 0 ? numericScore / maxScore : 1;
        const matchScore = Math.min(99, Math.max(70, Math.round(96 * ratio)));

        mappedResults.push({
          id: item.slug || item.id,
          title: item.name || item.title || "Sách",
          author: authorName,
          category: categoryName,
          matchScore,
          description: item.shortDescribe || item.describe || item.description || "Tác phẩm được gợi ý phù hợp nhất từ AI Engine.",
          image: coverImg,
        });
      });

      setSearchStep(4);
      setTimeout(() => {
        setResults(mappedResults);
        setSearching(false);
      }, 250);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm AI search-b:", error);
      setResults([]);
      setSearching(false);
    }
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
                  <Link 
                    key={book.id} 
                    to={`/books/${book.id}`}
                    onClick={onClose}
                    className="p-4 bg-white border border-slate-150 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex gap-4 relative group cursor-pointer block text-left"
                  >
                    {/* Cover image */}
                    <div className="w-16 h-20 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden shrink-0">
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
                      
                      <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-0.5 mt-6">
                        <span>Xem sách</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>

                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </motion.div>
    </div>
  );
}
