import React, { useState, useEffect } from "react";
import { Sparkles, Database, Loader2, Send, BookOpen, ArrowRight, Bot, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { searchProductsAPI } from "@/services/product.service";
import { resolveMediaUrl } from "@/utils/format";

interface BookMatch {
  id: string;
  title: string;
  matchScore: number;
  description: string;
  category: string;
  image: string;
}

const suggestionsList = [
  { text: "Lập trình", query: "Lập trình" },
  { text: "Marketing", query: "Marketing" },
  { text: "Kinh doanh", query: "Kinh doanh" }
];

export default function AISearchSection() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookMatch[] | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // AI Typewriter effect states
  const [aiMessage, setAiMessage] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (!aiMessage) {
      setDisplayedText("");
      setIsTyping(false);
      setShowCards(false);
      return;
    }

    let index = 0;
    setDisplayedText("");
    setIsTyping(true);
    setShowCards(false);

    const timer = setInterval(() => {
      index++;
      setDisplayedText(aiMessage.slice(0, index));
      if (index >= aiMessage.length) {
        clearInterval(timer);
        setIsTyping(false);
        setShowCards(true);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [aiMessage]);

  const executeAISearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setResults(null);
    setIsExpanded(false);
    setAiMessage("");
    setDisplayedText("");
    setShowCards(false);

    try {
      // Lấy tối đa 12 kết quả từ API Hybrid Search
      const res: any = await searchProductsAPI(queryText.trim(), 12);
      const rawData: any[] = res?.data?.results || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);

      // Lấy max score để làm mốc lọc nhiễu tương quan (Relative Threshold)
      const rawScores = rawData.map((item: any) => parseFloat(item.searchScore || "0"));
      const maxScore = Math.max(0, ...rawScores);

      const mapped: BookMatch[] = [];

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

        const ratio = maxScore > 0 ? numericScore / maxScore : 1;
        const matchScore = Math.min(99, Math.max(70, Math.round(96 * ratio)));

        mapped.push({
          id: item.slug || item.id,
          title: item.name || item.title || "Sách",
          category: item.categories?.[0]?.name || item.category || "Sách",
          matchScore,
          description: item.shortDescribe || item.describe || item.description || "Gợi ý thông minh từ AI Search Engine.",
          image: coverImg,
        });
      });

      setResults(mapped);

      if (mapped.length > 0) {
        setAiMessage(`Dựa trên yêu cầu "${queryText.trim()}", Lumina Book AI đã phân tích ngữ nghĩa và đề xuất ${mapped.length} cuốn sách phù hợp nhất dành cho bạn:`);
      } else {
        setAiMessage(`Hệ thống AI không tìm thấy cuốn sách nào khớp hoàn toàn với yêu cầu "${queryText.trim()}". Bạn có thể thử mô tả chi tiết hơn hoặc chọn các gợi ý bên dưới.`);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm AI ở AISearchSection:", error);
      setResults([]);
      setAiMessage("Có lỗi xảy ra khi kết nối với AI Search Engine. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    executeAISearch(inputText);
  };

  const handleSuggestionClick = (queryText: string) => {
    setInputText(queryText);
    executeAISearch(queryText);
  };

  const visibleResults = results ? (isExpanded ? results : results.slice(0, 6)) : [];

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

        {/* Unified ChatGPT / Perplexity Style AI Search Card */}
        <div className="max-w-4xl mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl shadow-black/50 flex flex-col relative focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/50 transition-all text-left space-y-4">
          
          {/* Textarea */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (inputText.trim() && !loading) {
                  handleAnalyze();
                }
              }
            }}
            placeholder="Tôi muốn tìm một cuốn sách giúp cải thiện kỹ năng giao tiếp và tâm lý học hành vi..."
            disabled={loading}
            className="w-full bg-transparent text-sm font-semibold text-slate-100 placeholder-slate-500 focus:outline-none resize-none min-h-[95px] leading-relaxed"
          />

          {/* Action Bar + Suggestions Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
            {/* Left: Suggestion Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 select-none mr-1">Gợi ý:</span>
              {suggestionsList.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(item.query)}
                  disabled={loading}
                  className="px-3 py-1 rounded-full border border-slate-800 hover:border-primary/40 bg-slate-950/40 hover:bg-blue-950/20 text-xs font-semibold text-slate-400 hover:text-primary transition-all cursor-pointer disabled:opacity-50"
                >
                  {item.text}
                </button>
              ))}
            </div>

            {/* Right: Model Tag & Submit Button */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span>pgvector Model</span>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading || !inputText.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all cursor-pointer select-none active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang tìm sách...</span>
                  </>
                ) : (
                  <>
                    <span>Tìm sách ngay</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Inline Dynamic Response Area (ChatGPT Style inside the same card!) */}
          {(loading || displayedText) && (
            <div className="pt-4 border-t border-slate-800/80 space-y-5">
              
              {/* Loading state */}
              {loading && (
                <div className="flex items-center gap-3 py-3 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="animate-pulse">Đang phân tích ngữ nghĩa & xếp hạng độ tương đồng...</span>
                </div>
              )}

              {/* Response Content */}
              {!loading && displayedText && (
                <div className="space-y-4">
                  {/* AI Header & Typewriter Message */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shadow-md shadow-primary/10">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 tracking-wide">Lumina Book AI</span>
                      <span className="flex h-2 w-2 relative ml-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
                      {displayedText}
                      {isTyping && (
                        <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse align-middle rounded-xs" />
                      )}
                    </p>
                  </div>

                  {/* Book Recommendation Cards (Revealed ONLY after typing finishes) */}
                  <AnimatePresence>
                    {showCards && results && results.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="pt-4 border-t border-slate-800/70 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Gợi ý tác phẩm phù hợp ({results.length}):
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          {visibleResults.map((book) => {
                            const isHighMatch = book.matchScore >= 95;
                            return (
                              <Link
                                to={`/books/${book.id}`}
                                key={book.id}
                                className={`group p-4 rounded-2xl flex flex-col justify-between border bg-slate-950/70 hover:bg-slate-900 hover:border-primary/50 transition-all cursor-pointer w-full sm:w-[calc(50%-8px)] md:w-[260px] flex-shrink-0 ${
                                  isHighMatch
                                    ? "border-primary/40 shadow-lg shadow-primary/5"
                                    : "border-slate-800"
                                }`}
                              >
                                <div>
                                  {/* Upper row: Cover + Category + Title */}
                                  <div className="flex gap-3">
                                    <div className="w-12 h-16 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shrink-0">
                                      <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>

                                    <div className="flex-grow min-w-0">
                                      <span className="px-2 py-0.5 bg-slate-800 border border-slate-700/50 text-slate-300 text-[9px] font-bold rounded-md uppercase tracking-wider">
                                        {book.category}
                                      </span>
                                      <h4 className="font-bold text-sm text-slate-100 mt-1 leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-200">
                                        {book.title}
                                      </h4>
                                    </div>
                                  </div>

                                  {/* Description */}
                                  <p className="text-xs text-slate-400 leading-relaxed mt-3 line-clamp-2">
                                    {book.description}
                                  </p>
                                </div>

                                {/* Bottom row: Match badge + View link */}
                                <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-slate-800/60">
                                  <span className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-[10px] font-bold rounded-lg flex items-center gap-1 select-none">
                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                    <span>{book.matchScore}% Match</span>
                                  </span>

                                  <div className="text-xs font-bold text-primary group-hover:text-blue-400 flex items-center gap-0.5 transition-colors">
                                    <span>Xem sách</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>

                        {/* Expand / Collapse Button if results > 6 */}
                        {results.length > 6 && (
                          <div className="flex justify-center pt-2">
                            <button
                              type="button"
                              onClick={() => setIsExpanded(!isExpanded)}
                              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer select-none active:scale-[0.98] shadow-sm"
                            >
                              <span>
                                {isExpanded
                                  ? "Thu gọn gợi ý"
                                  : `Xem thêm ${results.length - 6} gợi ý AI khác`}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-primary shrink-0 animate-bounce" />
                              )}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
