import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Clock,
  ChevronRight,
  GraduationCap,
  FileText,
  Users,
  Compass
} from 'lucide-react';
import { CAREER_ARTICLES, CareerArticle } from '../data/careerArticles';
import { CareerArticleModal } from './CareerArticleModal';

interface CareerCornerProps {
  className?: string;
  onNavigateToTab?: (tab: string) => void;
}

export const CareerCorner: React.FC<CareerCornerProps> = ({ className = '', onNavigateToTab }) => {
  const [selectedArticle, setSelectedArticle] = useState<CareerArticle | null>(null);
  const [showAllArticles, setShowAllArticles] = useState(false);

  // The 3 primary articles requested by the user
  const primaryArticles = CAREER_ARTICLES.slice(0, 3);
  const remainingArticles = CAREER_ARTICLES.slice(3);

  const displayedArticles = showAllArticles ? CAREER_ARTICLES : primaryArticles;

  const getArticleIcon = (id: string) => {
    switch (id) {
      case 'cv-5-dieu-can-co':
        return <FileText className="w-5 h-5 text-[#2E5339]" />;
      case 'chuan-bi-phong-van-dau-tien':
        return <Users className="w-5 h-5 text-[#2E5339]" />;
      case 'tim-viec-part-time-lich-hoc':
        return <Clock className="w-5 h-5 text-[#2E5339]" />;
      default:
        return <Compass className="w-5 h-5 text-[#2E5339]" />;
    }
  };

  return (
    <section className={`bg-white rounded-3xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs relative overflow-hidden ${className}`}>
      {/* Decorative background aura */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#EBF3ED] rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Header section as requested */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EBE3D7]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2ED] text-[#23412E] text-xs font-black tracking-wide">
            <span className="text-sm">💡</span>
            <span>GÓC NGHỀ NGHIỆP</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#19271E] tracking-tight">
            Kiến thức giúp bạn tìm việc tốt hơn
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6F63] leading-relaxed">
            Cập nhật những thông tin và kinh nghiệm hữu ích giúp sinh viên tự tin hơn trên hành trình tìm việc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showAllArticles && (
            <button
              onClick={() => setShowAllArticles(false)}
              className="text-xs font-semibold text-[#5D6F63] hover:text-[#19271E] px-3 py-1.5 rounded-xl border border-[#E0D8CC] transition-colors"
            >
              Thu gọn
            </button>
          )}
          <button
            onClick={() => setShowAllArticles(!showAllArticles)}
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#2E5339] hover:text-[#1C3624] transition-colors py-1"
          >
            <span>{showAllArticles ? 'Đang xem tất cả bài viết' : '→ Xem tất cả bài viết...'}</span>
            {!showAllArticles && (
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>
      </div>

      {/* Articles Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
        {displayedArticles.map((article, idx) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group cursor-pointer bg-[#FAF7F2] hover:bg-[#F3EDE2] rounded-2xl p-5 border border-[#E3DBD0] hover:border-[#2E5339]/50 transition-all duration-200 flex flex-col justify-between hover:shadow-md relative overflow-hidden"
          >
            {/* Top row with icon & category */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E0D8CC] flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:bg-[#EBF3ED] transition-transform">
                  {getArticleIcon(article.id)}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#63766A]">
                  <span className="font-semibold text-[#2E5339] bg-white px-2 py-0.5 rounded-md border border-[#E0D8CC]">
                    {article.category}
                  </span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-sm sm:text-base font-bold text-[#1B2A20] group-hover:text-[#23412E] transition-colors leading-snug line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-[#526457] mt-2 leading-relaxed line-clamp-3">
                {article.subtitle}
              </p>
            </div>

            {/* Read more footer link */}
            <div className="pt-4 mt-4 border-t border-[#E8E0D5] flex items-center justify-between text-xs font-bold text-[#2E5339] group-hover:text-[#183120]">
              <span className="flex items-center gap-1">
                Đọc cẩm nang
              </span>
              <span className="w-6 h-6 rounded-full bg-white border border-[#E0D8CC] flex items-center justify-center group-hover:translate-x-1 group-hover:bg-[#2E5339] group-hover:text-white transition-all">
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick helper tip banner */}
      <div className="relative z-10 mt-6 pt-5 border-t border-[#EBE3D7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#54675A]">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Bạn cần hỗ trợ định dạng CV hoặc hướng nghiệp? Khám phá ngay công cụ tạo hồ sơ chuẩn tuyển dụng.
          </span>
        </div>
        {onNavigateToTab && (
          <button
            onClick={() => onNavigateToTab('profile')}
            className="font-bold text-[#2E5339] hover:text-[#1C3624] underline underline-offset-4 shrink-0 transition-colors"
          >
            Đi tới Hồ sơ năng lực (CV) →
          </button>
        )}
      </div>

      {/* Article Detail Modal */}
      <CareerArticleModal
        article={selectedArticle}
        isOpen={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />
    </section>
  );
};
