import React from 'react';
import {
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Send,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Sparkles,
  Crown
} from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  hasApplied: boolean;
  onToggleSave: (jobId: string) => void;
  onViewDetails: (job: Job) => void;
  onApply: (job: Job) => void;
  isPreferredMatch?: boolean;
  matchReasons?: string[];
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  hasApplied,
  onToggleSave,
  onViewDetails,
  onApply,
  isPreferredMatch,
  matchReasons
}) => {
  return (
    <div
      id={`job-card-${job.id}`}
      className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative ${
        isPreferredMatch
          ? 'border-[#2E5339] ring-2 ring-[#2E5339]/20 bg-gradient-to-b from-[#F9FCFA] to-white'
          : 'border-[#E0D8CC] hover:border-[#2E5339]'
      }`}
    >
      <div>
        {/* Two-way Match Banner if preferred match */}
        {isPreferredMatch && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#23412E] to-[#3B6347] text-white text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Khớp 100% nhu cầu tìm việc của bạn</span>
            </span>
            <span className="text-[10px] text-[#C5DFCE] font-semibold bg-white/15 px-2 py-0.5 rounded-md">
              {job.province || job.location}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            {/* Company Badge / Logo */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-white shrink-0 shadow-xs"
              style={{ backgroundColor: job.companyLogoColor || '#284B35' }}
            >
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[#526458] font-medium">
                <span className="flex items-center gap-1 font-semibold text-[#23412E]">
                  <Building className="w-3.5 h-3.5 text-[#73877A]" />
                  {job.company}
                </span>
                {job.isVipPriority && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-300 shadow-2xs">
                    <Crown className="w-3 h-3 fill-amber-900 text-amber-900" />
                    ⭐ VIP Hot
                  </span>
                )}
                {job.recruiterName && (
                  <span className="text-[11px] text-[#55695D]">
                    • Đại diện: <strong className="text-[#1C2B22]">{job.recruiterName}</strong>
                  </span>
                )}
              </div>
              <h3
                onClick={() => onViewDetails(job)}
                className="text-base font-bold text-[#1C2B22] group-hover:text-[#2E5339] transition-colors cursor-pointer line-clamp-2 mt-0.5 leading-snug"
              >
                {job.title}
              </h3>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            id={`bookmark-btn-${job.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job.id);
            }}
            aria-label={isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
            title={isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
            className={`p-2 rounded-xl border transition-colors shrink-0 ${
              isSaved
                ? 'bg-[#2E5339] border-[#2E5339] text-white'
                : 'bg-[#FAF7F2] border-[#E0D8CC] text-[#697B70] hover:text-[#2E5339] hover:bg-[#EAE2D5]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Highlight Metadata: Salary, Location, Work Type */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {/* Salary Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${
              isPreferredMatch
                ? 'bg-[#E2F0E7] text-[#1B3A24] border-[#93C4A5]'
                : 'bg-[#EAF1EC] text-[#23412E] border-[#D1DFD5]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#2E5339]" />
            {job.salaryRange}
          </span>

          {/* Location Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
              isPreferredMatch
                ? 'bg-[#EBF3ED] text-[#1C3A25] border-[#93C4A5]'
                : 'bg-[#F7F4EE] text-[#4A5D50] border-[#E3DDD1]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-[#2E5339]" />
            {job.province || job.location}
          </span>

          {/* Work Type Badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F7F4EE] text-[#4A5D50] border border-[#E3DDD1]">
            <Clock className="w-3.5 h-3.5 text-[#708477]" />
            {job.workType}
          </span>
        </div>

        {/* Student Special Feature Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#4D5F53] border border-[#E6E0D4] font-medium"
            >
              {tag}
            </span>
          ))}
          {job.isStudentFriendly && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-[#E4EEE7] text-[#24432F] font-semibold">
              <GraduationCap className="w-3 h-3 text-[#2E5339]" />
              Hợp sinh viên
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-xs text-[#506256] line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="pt-3 border-t border-[#EFE9DF] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-[11px] text-[#788B7F]">
          <Calendar className="w-3.5 h-3.5" />
          <span>Hạn nộp: {job.deadline}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id={`view-detail-btn-${job.id}`}
            onClick={() => onViewDetails(job)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#2E5339] hover:bg-[#EAE3D6] transition-colors"
          >
            Chi tiết
          </button>

          {hasApplied ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EAF1EC] text-[#23412E] border border-[#D1DFD5]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5339]" />
              Đã nộp
            </span>
          ) : (
            <button
              id={`quick-apply-btn-${job.id}`}
              onClick={() => onApply(job)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] shadow-xs hover:shadow transition-all"
            >
              <Send className="w-3 h-3" />
              Ứng tuyển
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
