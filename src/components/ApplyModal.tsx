import React, { useState } from 'react';
import {
  X,
  Send,
  Building,
  User,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  Link2,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import { Job, CandidateProfile, Application, UserAccount } from '../types';
import { Crown, Lock } from 'lucide-react';

interface ApplyModalProps {
  job: Job | null;
  profile: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (applicationData: Omit<Application, 'id' | 'appliedDate' | 'status'>) => void;
  userAccount?: UserAccount;
  appliedCountToday?: number;
  onRequestVipModal?: (featureName: string) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  profile,
  isOpen,
  onClose,
  onSubmitApplication,
  userAccount,
  appliedCountToday = 0,
  onRequestVipModal
}) => {
  if (!isOpen || !job) return null;

  const isFree = userAccount?.role === 'candidate' && userAccount?.plan === 'free';
  const isVip = userAccount?.plan === 'vip';
  const hasReachedLimit = isFree && appliedCountToday >= 3;

  const defaultTemplates = [
    {
      id: 'intern',
      label: 'Ứng tuyển Thực tập sinh',
      text: `Kính gửi Bộ phận Tuyển dụng ${job.company},

Em tên là ${profile.fullName}, hiện là ${profile.currentTitle || 'sinh viên'}. Qua tìm hiểu, em rất ấn tượng với môi trường chuyên nghiệp của Quý công ty và muốn ứng tuyển vào vị trí ${job.title}.

Em có nền tảng học tập vững vàng, tinh thần cầu tiến và đã tích lũy các kỹ năng cơ bản phù hợp với mô tả công việc. Em mong muốn được học hỏi thực chiến, cống hiến năng lực cho các dự án của công ty và cam kết tuân thủ nghiêm túc thời gian làm việc.

Em xin chân thành cảm ơn!`
    },
    {
      id: 'parttime',
      label: 'Ứng tuyển Part-time linh hoạt',
      text: `Kính gửi Nhà tuyển dụng ${job.company},

Em là ${profile.fullName}. Em muốn nộp hồ sơ ứng tuyển vị trí ${job.title} (Part-time). Em có thể sắp xếp thời gian làm việc linh hoạt theo ca của công ty, đảm bảo hoàn thành tốt các chỉ tiêu công việc được giao.

Rất mong có cơ hội được phỏng vấn và đồng hành cùng Quý công ty.`
    },
    {
      id: 'fresher',
      label: 'Sinh viên mới tốt nghiệp',
      text: `Kính gửi Quý công ty ${job.company},

Em là ${profile.fullName}, vừa hoàn thành chương trình cử nhân tại ${profile.education[0]?.school || 'trường đại học'}. Với nhiệt huyết của một người trẻ sẵn sàng dấn thân và các kỹ năng chuyên môn đã rèn luyện, em tin mình sẽ nhanh chóng hòa nhập và đóng góp giá trị cho vị trí ${job.title}.`
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState<string>('intern');
  const [coverLetter, setCoverLetter] = useState<string>(defaultTemplates[0].text);
  const [portfolioUrl, setPortfolioUrl] = useState<string>(profile.portfolioLinks[0]?.url || '');
  const [candidateName, setCandidateName] = useState<string>(profile.fullName);
  const [candidateEmail, setCandidateEmail] = useState<string>(profile.email);
  const [candidatePhone, setCandidatePhone] = useState<string>(profile.phone);
  const [includeFullCv, setIncludeFullCv] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = defaultTemplates.find((t) => t.id === templateId);
    if (tmpl) {
      setCoverLetter(tmpl.text);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        companyLogoColor: job.companyLogoColor,
        workType: job.workType,
        location: job.location,
        salaryRange: job.salaryRange,
        candidateName,
        candidateEmail,
        candidatePhone,
        coverLetter,
        portfolioUrl: portfolioUrl || undefined,
        industry: profile.industry || job.category || '',
        highestDegree: profile.highestDegree || (profile.education[0]?.degree) || '',
        experienceYears: profile.experienceYears || '',
        cvSnapshot: profile,
        feedbackNote: 'Hồ sơ đã được gửi thành công đến nhà tuyển dụng. Bộ phận nhân sự sẽ kiểm tra trong 1-3 ngày.'
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      id="apply-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="apply-modal-card"
        className="bg-[#FAF7F2] rounded-3xl border border-[#E0D8CC] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-white p-5 border-b border-[#E0D8CC] flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0"
              style={{ backgroundColor: job.companyLogoColor || '#284B35' }}
            >
              {job.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#576B5F]">
                <Building className="w-3.5 h-3.5" />
                <span>{job.company}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D2C22] mt-0.5">
                Ứng tuyển: {job.title}
              </h2>
            </div>
          </div>

          <button
            id="close-apply-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#65786D] hover:bg-[#F2ECE1] transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Candidate Profile Verification Card */}
          <div className="bg-white p-4 rounded-2xl border border-[#E3DDD1]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#687C70] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2E5339]" />
                Thông tin ứng viên gửi đi
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#EAF1EC] text-[#23412E] font-medium">
                Tự động lấy từ Hồ sơ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#4F6255] block mb-1">
                  Họ và tên *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4F6255] block mb-1">
                  Số điện thoại *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-[#4F6255] block mb-1">
                  Email liên hệ *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C9E93] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cover Letter Section */}
          <div className="bg-white p-4 rounded-2xl border border-[#E3DDD1]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#687C70] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2E5339]" />
                Thư giới thiệu / Lời nhắn tới HR
              </label>

              {/* Quick Template Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {defaultTemplates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTemplate(t.id)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border whitespace-nowrap transition-colors font-medium ${
                      selectedTemplate === t.id
                        ? 'bg-[#2E5339] text-white border-[#2E5339]'
                        : 'bg-[#FAF7F2] text-[#55695D] border-[#DDD5C8] hover:bg-[#ECE5D8]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={5}
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Giới thiệu bản thân, lý do ứng tuyển và điểm mạnh của bạn..."
              className="w-full p-3 text-xs leading-relaxed rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339] text-[#2C3C32]"
            />
          </div>

          {/* Link Portfolio / GitHub */}
          <div className="bg-white p-4 rounded-2xl border border-[#E3DDD1]">
            <label className="text-xs font-bold uppercase tracking-wider text-[#687C70] flex items-center gap-1.5 mb-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#2E5339]" />
              Link Portfolio / GitHub / Website (nếu có)
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/your-username hoặc link sản phẩm mẫu"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
            />
          </div>

          {/* Quota / Limit Warning if free candidate reached 3 applications */}
          {hasReachedLimit ? (
            <div className="p-4 rounded-2xl bg-[#FFF9ED] border border-[#FFE1A8] space-y-2 text-xs text-[#8A5A00]">
              <div className="flex items-center gap-2 font-bold text-[#6D4700]">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>🔒 Giới hạn lượt ứng tuyển hôm nay (3/3 việc)</span>
              </div>
              <p className="leading-relaxed">
                Tài khoản miễn phí được ứng tuyển tối đa 3 việc làm mỗi ngày. Hãy nâng cấp lên VIP để nộp hồ sơ không giới hạn và được ưu tiên xét duyệt!
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestVipModal?.('Ứng tuyển không giới hạn mỗi ngày');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <Crown className="w-4 h-4 fill-amber-900 text-amber-900" />
                <span>[Nâng cấp VIP] ứng tuyển không giới hạn</span>
              </button>
            </div>
          ) : (
            /* Attach CV Checkbox */
            <div className="p-3.5 rounded-2xl bg-[#EAF1EC] border border-[#CADBCF] flex items-start gap-3">
              <input
                type="checkbox"
                id="include-cv-checkbox"
                checked={includeFullCv}
                onChange={(e) => setIncludeFullCv(e.target.checked)}
                className="mt-0.5 rounded text-[#2E5339] focus:ring-[#2E5339] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="include-cv-checkbox" className="text-xs text-[#243F2E] cursor-pointer">
                <span className="font-bold block">Đính kèm Hồ sơ năng lực trực tuyến (CV)</span>
                Bao gồm quá trình học tập tại <strong>{profile.education[0]?.school || 'Đại học'}</strong>, {profile.skills.length} kỹ năng và kinh nghiệm đã nhập.
              </label>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#65786D] hover:bg-[#F2ECE1] transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              id="confirm-submit-application-btn"
              type="submit"
              disabled={isSubmitting || hasReachedLimit}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-[#2E5339] text-white hover:bg-[#23412E] shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>Đang chuyển hồ sơ...</>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Xác nhận nộp hồ sơ trực tuyến
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
