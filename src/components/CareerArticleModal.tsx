import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Clock,
  Calendar,
  Share2,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { CareerArticle, CAREER_ARTICLES } from '../data/careerArticles';

interface CareerArticleModalProps {
  article: CareerArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle?: (article: CareerArticle) => void;
}

export const CareerArticleModal: React.FC<CareerArticleModalProps> = ({
  article,
  isOpen,
  onClose,
  onSelectArticle
}) => {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !article) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const otherArticles = CAREER_ARTICLES.filter((a) => a.id !== article.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E0D8CC] overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF7F2] border-b border-[#E0D8CC] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#23412E] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-[#A5C7B2]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E5339] bg-[#3D684A]/10 px-2 py-0.5 rounded-md">
                Góc Nghề Nghiệp 💡
              </span>
              <p className="text-xs text-[#5C6E62] mt-0.5">Cẩm nang hướng nghiệp cho sinh viên</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`p-2 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-[#23412E] text-white border-[#23412E]'
                  : 'bg-white text-[#4A5D50] border-[#E0D8CC] hover:bg-[#F2ECE1]'
              }`}
              title={isSaved ? 'Đã lưu bài viết' : 'Lưu bài viết'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Đã lưu' : 'Lưu bài'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border border-[#E0D8CC] bg-white text-[#4A5D50] hover:bg-[#F2ECE1] transition-colors text-xs font-semibold flex items-center gap-1.5"
              title="Sao chép liên kết"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#5C6E62] hover:text-[#1C2B22] hover:bg-[#E8E1D5] transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#63766A]">
            <span className="px-2.5 py-1 rounded-full bg-[#EBF3ED] text-[#23412E] font-bold">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#889C8E]" />
              {article.readTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#889C8E]" />
              {article.date}
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A20] leading-tight">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base text-[#4E6254] mt-2 font-medium leading-relaxed">
              {article.subtitle}
            </p>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border-l-4 border-[#23412E] text-xs sm:text-sm text-[#2D3F33] leading-relaxed italic">
            "{article.summary}"
          </div>

          {/* Detailed Points */}
          <div className="space-y-6 pt-2">
            {article.content.map((section, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#E3DBD0] p-5 space-y-3 shadow-xs">
                <h2 className="text-base sm:text-lg font-bold text-[#1C2C21] flex items-start gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#2E5339]/15 text-[#23412E] text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{section.heading.replace(/^\d+\.\s*/, '')}</span>
                </h2>

                <ul className="space-y-2 pl-2">
                  {section.points.map((pt, pIdx) => (
                    <li key={pIdx} className="text-xs sm:text-sm text-[#3E5244] flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {section.tip && (
                  <div className="mt-3 p-3 rounded-xl bg-[#EAF2ED] border border-[#C5DDD0] text-xs text-[#1F3D28] font-medium flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                    <span>{section.tip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="p-6 rounded-3xl bg-radial from-[#2B4E36] to-[#1C3624] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <h3 className="font-extrabold text-base text-white">Sẵn sàng áp dụng vào thực tế?</h3>
              <p className="text-xs text-white/80 mt-1">
                Tạo hồ sơ năng lực chuẩn chỉnh ngay để gửi tới các nhà tuyển dụng hàng đầu.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-[#1C3624] hover:bg-[#F2ECE1] transition-all shadow-xs shrink-0 flex items-center gap-1.5"
            >
              Khám phá việc làm ngay
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Other articles */}
          {otherArticles.length > 0 && (
            <div className="pt-4 border-t border-[#E0D8CC] space-y-3">
              <h3 className="text-sm font-bold text-[#1C2C21] uppercase tracking-wider">
                Bài viết cùng chủ đề
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherArticles.slice(0, 2).map((other) => (
                  <button
                    key={other.id}
                    onClick={() => {
                      if (onSelectArticle) {
                        onSelectArticle(other);
                      }
                    }}
                    className="text-left p-3.5 rounded-2xl border border-[#E3DBD0] hover:border-[#2E5339] hover:bg-[#F9F6F0] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#2E5339] uppercase">
                        {other.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#1C2B22] group-hover:text-[#23412E] line-clamp-2 mt-1">
                        {other.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-[#4A5D50] flex items-center gap-1 mt-2">
                      Đọc tiếp <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
