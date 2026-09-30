import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  Search,
  Trash2,
  Send,
  Building,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Job, UserAccount } from '../types';
import { Crown, Sparkles, Lock } from 'lucide-react';

interface SavedJobsProps {
  jobs: Job[];
  savedJobIds: Set<string>;
  appliedJobIds: Set<string>;
  onToggleSave: (jobId: string) => void;
  onViewDetails: (job: Job) => void;
  onApply: (job: Job) => void;
  onNavigateToJobs: () => void;
  userAccount?: UserAccount;
  onRequestVipModal?: (featureName: string) => void;
}

export const SavedJobs: React.FC<SavedJobsProps> = ({
  jobs,
  savedJobIds,
  appliedJobIds,
  onToggleSave,
  onViewDetails,
  onApply,
  onNavigateToJobs,
  userAccount,
  onRequestVipModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isFree = userAccount?.role === 'candidate' && userAccount?.plan === 'free';
  const isVip = userAccount?.plan === 'vip';

  const savedJobsList = useMemo(() => {
    return jobs
      .filter((job) => savedJobIds.has(job.id))
      .filter((job) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          job.title.toLowerCase().includes(q) ||
          job.company.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
        );
      });
  }, [jobs, savedJobIds, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E5339] text-white flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B2A20]">
              Việc làm đã lưu ({savedJobIds.size})
            </h1>
          </div>
          <p className="text-xs text-[#5E7164] mt-1">
            Danh sách các cơ hội nghề nghiệp bạn quan tâm và đánh dấu để chuẩn bị nộp hồ sơ.
          </p>
        </div>

        {/* Search Inside Saved */}
        {savedJobIds.size > 0 && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-[#7A8E81] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm trong việc đã lưu..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
            />
          </div>
        )}
      </div>

      {/* Quota Banner for Free vs VIP */}
      {isFree ? (
        <div className="p-3.5 rounded-2xl bg-[#FFF9ED] border border-[#FFE1A8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8A5A00]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Gói tài khoản thường:</strong> Đã lưu <strong>{savedJobIds.size}/5</strong> việc làm tối đa.
              {savedJobIds.size >= 5 && ' Bạn đã đạt giới hạn lưu việc của gói thường.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRequestVipModal?.('Lưu trữ việc làm không giới hạn')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[11px] shadow-xs transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <Crown className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
            <span>[Nâng cấp VIP] lưu không giới hạn</span>
          </button>
        </div>
      ) : isVip ? (
        <div className="p-3 rounded-2xl bg-[#EAF2ED] border border-[#CADBCF] flex items-center justify-between text-xs text-[#1C3624]">
          <div className="flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>👑 Thành viên VIP: Lưu trữ việc làm không giới hạn số lượng!</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#BED7C6] text-[#2E5339]">
            {savedJobIds.size} việc đã lưu
          </span>
        </div>
      ) : null}

      {/* Saved Jobs List */}
      {savedJobsList.length > 0 ? (
        <div className="space-y-3">
          {savedJobsList.map((job) => {
            const hasApplied = appliedJobIds.has(job.id);
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-[#E0D8CC] hover:border-[#2E5339] p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                {/* Left: Job Meta */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: job.companyLogoColor || '#284B35' }}
                  >
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#526458]">
                      <Building className="w-3.5 h-3.5" />
                      <span className="font-semibold">{job.company}</span>
                      <span className="w-1 h-1 rounded-full bg-[#9EB0A3]" />
                      <span>{job.category}</span>
                    </div>
                    <h3
                      onClick={() => onViewDetails(job)}
                      className="text-base font-bold text-[#1C2B22] group-hover:text-[#2E5339] transition-colors cursor-pointer mt-0.5"
                    >
                      {job.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-[#EAF1EC] text-[#23412E]">
                        <DollarSign className="w-3 h-3 text-[#2E5339]" />
                        {job.salaryRange}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#4A5D50] border border-[#E0D8CC]">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#4A5D50] border border-[#E0D8CC]">
                        <Clock className="w-3 h-3" />
                        {job.workType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#F0EAE0]">
                  <button
                    onClick={() => onToggleSave(job.id)}
                    className="p-2 rounded-xl border border-[#E0D8CC] text-[#788B7F] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
                    title="Bỏ lưu công việc này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onViewDetails(job)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#2E5339] hover:bg-[#EAE3D6] transition-colors"
                  >
                    Chi tiết
                  </button>

                  {hasApplied ? (
                    <span className="px-4 py-2 rounded-xl text-xs font-bold bg-[#EAF1EC] text-[#23412E] border border-[#CADBCF]">
                      Đã nộp hồ sơ
                    </span>
                  ) : (
                    <button
                      onClick={() => onApply(job)}
                      className="px-4 py-2 rounded-xl font-bold text-xs bg-[#2E5339] text-white hover:bg-[#23412E] shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Ứng tuyển ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E0D8CC] p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E5DEC0] flex items-center justify-center mx-auto text-[#798C80]">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1D2C22]">
              Chưa có việc làm nào được lưu
            </h3>
            <p className="text-xs text-[#5D6F63] mt-1 leading-relaxed">
              Khi tìm kiếm việc làm, bạn có thể nhấn vào biểu tượng dấu trang để lưu lại các cơ hội phù hợp và xem lại sau.
            </p>
          </div>
          <button
            onClick={onNavigateToJobs}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#2E5339] text-white hover:bg-[#23412E] transition-all"
          >
            <span>Khám phá việc làm ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
