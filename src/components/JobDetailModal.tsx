import React from 'react';
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Send,
  Building,
  Calendar,
  CheckCircle2,
  Mail,
  GraduationCap,
  Sparkles,
  Award,
  Check
} from 'lucide-react';
import { Job } from '../types';

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  hasApplied: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  isOpen,
  onClose,
  isSaved,
  hasApplied,
  onToggleSave,
  onApply
}) => {
  if (!isOpen || !job) return null;

  return (
    <div
      id="job-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="job-detail-modal-card"
        className="bg-[#FAF7F2] rounded-3xl border border-[#E0D8CC] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Navigation Header */}
        <div className="bg-white p-5 sm:p-6 border-b border-[#E0D8CC] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white shadow-xs shrink-0"
              style={{ backgroundColor: job.companyLogoColor || '#284B35' }}
            >
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#54675B]">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#2E5339]" />
                  <strong className="text-[#1D2C22]">{job.company}</strong>
                </span>
                <span className="w-1 h-1 rounded-full bg-[#A3B3A9]" />
                <span>{job.category}</span>
                {job.recruiterName && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[#A3B3A9]" />
                    <span className="text-[#2E5339] font-medium">
                      Đại diện: <strong>{job.recruiterName}</strong>
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1B2A20] mt-1">
                {job.title}
              </h2>
            </div>
          </div>

          <button
            id="close-job-detail-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-[#65786D] hover:bg-[#F2ECE1] transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#E8E1D5] flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-[#EAF1EC] text-[#23412E] border border-[#D1DFD5]">
            <DollarSign className="w-4 h-4 text-[#2E5339]" />
            {job.salaryRange}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-[#4A5D50] border border-[#E0D8CC]">
            <MapPin className="w-3.5 h-3.5 text-[#6D8174]" />
            {job.location}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-[#4A5D50] border border-[#E0D8CC]">
            <Clock className="w-3.5 h-3.5 text-[#6D8174]" />
            {job.workType}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white text-[#4A5D50] border border-[#E0D8CC]">
            <Calendar className="w-3.5 h-3.5 text-[#6D8174]" />
            Hạn: {job.deadline}
          </div>
        </div>

        {/* Body Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#2B3B31]">
          {/* Student Friendly Highlight Box */}
          {job.isStudentFriendly && (
            <div className="p-4 rounded-2xl bg-[#EAF1EC] border border-[#CADBCF] text-[#23412E] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2E5339] text-white flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#23412E]">
                  Công việc phù hợp cho sinh viên & thực tập sinh
                </h4>
                <p className="text-xs text-[#44584B] mt-0.5 leading-relaxed">
                  Công ty tạo điều kiện linh hoạt lịch học, hỗ trợ ký báo cáo thực tập tốt nghiệp và có lộ trình đào tạo từ cơ bản.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {job.tags.map((t, idx) => (
                    <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white text-[#2E5339] border border-[#D1DFD5]">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section: Mô tả công việc */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3DDD1]">
            <h3 className="text-base font-bold text-[#1C2B22] flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#2E5339]" />
              Mô tả công việc
            </h3>
            <p className="text-sm text-[#46574D] leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Section: Yêu cầu ứng viên */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3DDD1]">
            <h3 className="text-base font-bold text-[#1C2B22] flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[#2E5339]" />
              Yêu cầu ứng viên
            </h3>
            <ul className="space-y-2.5 text-sm text-[#46574D]">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#EAF1EC] text-[#2E5339] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Quyền lợi được hưởng */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3DDD1]">
            <h3 className="text-base font-bold text-[#1C2B22] flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-[#2E5339]" />
              Quyền lợi được hưởng
            </h3>
            <ul className="space-y-2.5 text-sm text-[#46574D]">
              {job.benefits.map((ben, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#EAF1EC] text-[#2E5339] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{ben}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Thông tin Người đại diện Doanh nghiệp */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E0D8CC] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#63776B] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#2E5339]" />
              Thông tin Người đại diện & Doanh nghiệp tuyển dụng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#E8E1D5]">
                <p className="text-[11px] text-[#718478] font-medium">Người đại diện Doanh nghiệp:</p>
                <p className="font-bold text-sm text-[#1A291F] mt-0.5">
                  {job.recruiterName || 'Bộ phận Tuyển dụng Doanh nghiệp'}
                </p>
                {job.recruiterRole && (
                  <p className="text-[11px] text-[#2E5339] font-medium mt-0.5">{job.recruiterRole}</p>
                )}
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E8E1D5]">
                <p className="text-[11px] text-[#718478] font-medium">Tên Doanh nghiệp:</p>
                <p className="font-bold text-sm text-[#1A291F] mt-0.5">{job.company}</p>
                <p className="text-[11px] text-[#55695D] mt-0.5">Lĩnh vực: {job.category}</p>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E8E1D5] sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#1A291F]">Địa chỉ làm việc: </span>
                    <span className="text-[#4E6154]">{job.address || job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Mail className="w-4 h-4 text-[#2E5339] shrink-0" />
                  <span className="text-[#2E5339] font-semibold">{job.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E0D8CC] flex items-center justify-between gap-3">
          <button
            id="modal-toggle-save-btn"
            onClick={() => onToggleSave(job.id)}
            className={`px-4 py-2.5 rounded-xl border font-semibold text-sm flex items-center gap-2 transition-colors ${
              isSaved
                ? 'bg-[#2E5339] border-[#2E5339] text-white'
                : 'bg-[#FAF7F2] border-[#E0D8CC] text-[#526458] hover:bg-[#ECE5D8]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Đã lưu việc này' : 'Lưu việc làm'}
          </button>

          <div className="flex items-center gap-2">
            <button
              id="modal-cancel-btn"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#65786D] hover:bg-[#F2ECE1] transition-colors"
            >
              Đóng
            </button>

            {hasApplied ? (
              <button
                disabled
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#EAF1EC] text-[#23412E] border border-[#CADBCF] flex items-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2E5339]" />
                Bạn đã nộp hồ sơ
              </button>
            ) : (
              <button
                id="modal-apply-btn"
                onClick={() => {
                  onClose();
                  onApply(job);
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#2E5339] text-white hover:bg-[#23412E] shadow-sm hover:shadow transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Ứng tuyển trực tuyến ngay
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
