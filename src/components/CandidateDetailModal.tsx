import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Sparkles,
  Award,
  Link2,
  ExternalLink,
  CheckCircle2,
  Trophy,
  Crown,
  Lock,
  Eye
} from 'lucide-react';
import { CandidateProfile } from '../types';
import { evaluateCandidate } from '../utils/candidateRanking';

interface CandidateDetailModalProps {
  candidate: CandidateProfile | null;
  isOpen: boolean;
  onClose: () => void;
  rank?: number;
  featuredHighlight?: string;
  applicationNote?: string;
  onInvite?: () => void;
  isVipRecruiter?: boolean;
  recruiterEmail?: string;
  isRecruiter?: boolean;
  isVerified?: boolean;
  onRequestVipModal?: (featureName?: string) => void;
  onOpenOtpModal?: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose,
  rank,
  featuredHighlight,
  applicationNote,
  onInvite,
  isVipRecruiter = false,
  recruiterEmail = 'tuyendung@fpt-software.com',
  isRecruiter = true,
  isVerified = true,
  onRequestVipModal,
  onOpenOtpModal
}) => {
  if (!isOpen || !candidate) return null;

  // Strict candidate privacy & authorization protection:
  // "Chỉ Nhà tuyển dụng đã xác minh mới được xem thông tin và CV của ứng viên."
  // "Tài khoản chưa xác minh không được xem hồ sơ ứng viên."
  if (!isRecruiter) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl border border-red-200 w-full max-w-md p-6 sm:p-8 text-center shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#1C2B22]">
              ⛔ Quyền riêng tư hồ sơ ứng viên
            </h3>
            <p className="text-xs text-[#5C6E62] leading-relaxed mt-2">
              Chỉ Nhà tuyển dụng đã xác minh mới được xem thông tin và CV của ứng viên. Vai trò Ứng viên không được phép xem hồ sơ của các ứng viên khác để đảm bảo bảo mật thông tin cá nhân.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#23412E] text-white hover:bg-[#1A3324] shadow-xs cursor-pointer"
          >
            Đóng thông báo
          </button>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl border border-amber-200 w-full max-w-md p-6 sm:p-8 text-center shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
              Yêu cầu xác minh OTP
            </span>
            <h3 className="text-lg font-black text-[#1C2B22] mt-2">
              🔒 Tài khoản chưa xác minh không được xem hồ sơ ứng viên
            </h3>
            <p className="text-xs text-[#5C6E62] leading-relaxed mt-2">
              Khi đăng ký Nhà tuyển dụng, bắt buộc cung cấp email công ty và xác minh bằng mã OTP gửi qua email. Vui lòng hoàn tất xác thực OTP email công ty để mở khóa quyền xem CV ứng viên.
            </p>
          </div>
          <div className="space-y-2">
            {onOpenOtpModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOtpModal();
                }}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-[#23412E] text-white hover:bg-[#1A3324] shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Xác minh ngay bằng mã OTP</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 rounded-xl font-semibold text-xs text-[#627568] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>
    );
  }

  const evaluation = evaluateCandidate(candidate);

  // Mask contact for free recruiter (only VIP recruiter sees full unmasked contact)
  const displayEmail = isVipRecruiter
    ? candidate.email
    : candidate.email
    ? candidate.email.replace(/(.{2})(.*)(@.*)/, '$1••••$3')
    : 'Chưa cập nhật';

  const displayPhone = isVipRecruiter
    ? candidate.phone
    : candidate.phone
    ? candidate.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 ••• •••')
    : 'Chưa cập nhật';

  return (
    <div
      id="candidate-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="candidate-detail-modal-container"
        className="bg-white rounded-3xl border border-[#E0D8CC] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#23412E] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-24 rounded-2xl bg-white/15 border-2 border-white/30 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
              {candidate.avatarUrl ? (
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white/70">
                  <User className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">Ảnh đại diện</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {rank && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow-xs">
                    <Trophy className="w-3 h-3 text-amber-900" />
                    Top #{rank} Bằng cấp & Kinh nghiệm
                  </span>
                )}
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${evaluation.tierColor}`}>
                  {evaluation.rankingTier} ({evaluation.totalScore}/100đ)
                </span>
                {isVipRecruiter ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    <Crown className="w-3 h-3" /> VIP Mở khóa đầy đủ
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                    <Lock className="w-3 h-3 text-amber-300" /> Tài khoản thường (Ẩn liên hệ)
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {candidate.fullName || 'Ứng viên chưa cập nhật tên'}
              </h2>
              <p className="text-xs sm:text-sm text-[#D1DFD5] font-medium">
                {candidate.currentTitle || 'Ứng viên tìm kiếm việc làm'}
              </p>

              {/* Badges for Degree and Experience */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {evaluation.degreeLabel !== 'Chưa cập nhật' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15 text-white">
                    🎓 Bằng: {evaluation.degreeLabel} ({evaluation.degreeScore}đ)
                  </span>
                )}
                {evaluation.experienceLabel !== 'Chưa có kinh nghiệm' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15 text-white">
                    💼 Kinh nghiệm: {evaluation.experienceLabel} ({evaluation.experienceScore}đ)
                  </span>
                )}
                {candidate.industry && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15 text-white">
                    🏷️ {candidate.industry}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Contact Bar */}
          <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-[#D8E6DE]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#9DC4AC]" />
                <span className={!isVipRecruiter ? 'font-mono text-amber-200' : ''}>{displayEmail}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#9DC4AC]" />
                <span className={!isVipRecruiter ? 'font-mono text-amber-200' : ''}>{displayPhone}</span>
              </span>
              {candidate.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#9DC4AC]" />
                  {candidate.location}
                </span>
              )}
            </div>

            {!isVipRecruiter && onRequestVipModal && (
              <button
                type="button"
                onClick={() => onRequestVipModal('Mở khóa số điện thoại & email ứng viên đầy đủ')}
                className="px-3 py-1 rounded-xl bg-amber-400 text-amber-950 font-black text-[11px] shadow-sm hover:bg-amber-300 transition-colors flex items-center gap-1"
              >
                <Crown className="w-3 h-3" />
                [Nâng cấp VIP] Mở khóa liên hệ
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-[#2A3A2F]">
          {/* Highlight Summary if available */}
          {featuredHighlight && (
            <div className="p-3.5 rounded-2xl bg-[#EAF1EC] border border-[#2E5339]/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#23412E] block mb-0.5">Điểm nổi bật thu hút nhà tuyển dụng:</strong>
                <p className="text-[#3E5244] leading-relaxed">{featuredHighlight}</p>
              </div>
            </div>
          )}

          {/* Application Cover letter note */}
          {applicationNote && (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] space-y-1.5">
              <span className="font-bold text-[#23412E] block">Thư ứng tuyển gửi kèm:</span>
              <p className="text-[#4C5E51] italic leading-relaxed whitespace-pre-line">
                "{applicationNote}"
              </p>
            </div>
          )}

          {/* Bio */}
          {candidate.bio && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#2E5339] mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Giới thiệu bản thân & Mục tiêu nghề nghiệp
              </h3>
              <p className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] leading-relaxed text-[#3D4F42]">
                {candidate.bio}
              </p>
            </div>
          )}

          {/* Career Expectations (Nguyện vọng việc làm) */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#2E5339] mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Nguyện vọng nghề nghiệp & Đãi ngộ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC]">
                <span className="text-[11px] text-[#718476] block">Vị trí mong muốn</span>
                <span className="font-bold text-[#1C2B22] text-xs mt-0.5 block">
                  {candidate.desiredJob || 'Linh hoạt'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC]">
                <span className="text-[11px] text-[#718476] block">Mức lương kỳ vọng</span>
                <span className="font-bold text-[#2E5339] text-xs mt-0.5 block">
                  {candidate.desiredSalary || 'Thỏa thuận'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC]">
                <span className="text-[11px] text-[#718476] block">Hình thức làm việc</span>
                <span className="font-bold text-[#1C2B22] text-xs mt-0.5 block">
                  {candidate.desiredWorkType || 'Part-time / Full-time'}
                </span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#2E5339] mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Học vấn & Bằng cấp ({candidate.education?.length || 0})
            </h3>
            <div className="space-y-2.5">
              {candidate.education && candidate.education.length > 0 ? (
                candidate.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-[#1C2B22] text-xs">{edu.school}</div>
                      <div className="text-[#3E5244] font-medium text-[11px] mt-0.5">
                        Chuyên ngành: <strong>{edu.major}</strong> • Bằng cấp: <strong>{edu.degree}</strong>
                      </div>
                      {edu.gpa && (
                        <div className="text-[11px] text-[#2E5339] font-bold mt-1">
                          Điểm số / GPA: {edu.gpa}
                        </div>
                      )}
                      {edu.description && (
                        <div className="text-[11px] text-[#63766A] mt-1 italic">
                          {edu.description}
                        </div>
                      )}
                    </div>
                    <div className="text-[11px] text-[#718477] font-semibold shrink-0">
                      {edu.startYear} - {edu.endYear}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] text-[#718477] text-center">
                  Chưa cập nhật thông tin học vấn
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#2E5339] mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Kinh nghiệm làm việc & Dự án ({candidate.experience?.length || 0})
            </h3>
            <div className="space-y-2.5">
              {candidate.experience && candidate.experience.length > 0 ? (
                candidate.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1C2B22] text-xs">{exp.position}</span>
                      <span className="text-[11px] text-[#718477] font-semibold">
                        {exp.startDate} - {exp.current ? 'Hiện tại' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[#2E5339] font-bold text-[11px]">{exp.company}</div>
                    <p className="text-[#4C5E51] text-[11px] leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] text-[#718477] text-center">
                  Ứng viên chưa có kinh nghiệm trước đó (Sinh viên mới tốt nghiệp / Fresher)
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#2E5339] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Kỹ năng chuyên môn & Kỹ năng mềm
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <div
                    key={s.id}
                    className="px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#E0D8CC] text-xs font-semibold text-[#2D3E32] flex items-center gap-1.5"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EAF2ED] text-[#2E5339] font-bold">
                      {s.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {candidate.certificates && candidate.certificates.length > 0 && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#2E5339] mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Chứng chỉ & Giải thưởng
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {candidate.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0D8CC]"
                  >
                    <div className="font-bold text-[#1C2B22] text-xs">{cert.name}</div>
                    <div className="text-[#64776B] text-[11px] mt-0.5">
                      {cert.issuer} • Năm {cert.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-[#E0D8CC] bg-[#FAF8F5] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D5CDC0] text-xs font-semibold text-[#506355] hover:bg-white transition-colors"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            {!isVipRecruiter && onRequestVipModal && (
              <button
                type="button"
                onClick={() => onRequestVipModal('Mở khóa số điện thoại & email ứng viên đầy đủ')}
                className="px-4 py-2.5 rounded-xl text-xs font-black bg-amber-400 text-amber-950 hover:bg-amber-300 shadow-xs flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                [Nâng cấp VIP] Mở khóa SĐT & Email
              </button>
            )}

            {onInvite && (
              <button
                onClick={onInvite}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] shadow-xs flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Xếp lịch phỏng vấn ứng viên
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
