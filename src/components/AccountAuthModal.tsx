import React, { useState } from 'react';
import {
  User,
  Building2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  Briefcase,
  Search,
  FileText,
  Clock,
  X,
  Mail,
  Lock,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface AccountAuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  currentAccount: UserAccount | null;
  onSaveAccount: (account: UserAccount) => void;
  canClose?: boolean;
}

export const AccountAuthModal: React.FC<AccountAuthModalProps> = ({
  isOpen,
  onClose,
  currentAccount,
  onSaveAccount,
  canClose = true
}) => {
  // Step in modal: 'role_form' | 'recruiter_otp'
  const [currentStep, setCurrentStep] = useState<'role_form' | 'recruiter_otp'>('role_form');
  const [selectedRole, setSelectedRole] = useState<UserRole>('candidate');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [formError, setFormError] = useState('');

  // OTP Verification States for Recruiter
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('682914');
  const [countdown, setCountdown] = useState(60);
  const [otpError, setOtpError] = useState('');

  if (!isOpen) return null;

  const handleStartRecruiterOtp = () => {
    if (!companyEmail.trim() || !companyEmail.includes('@')) {
      setFormError('Bắt buộc cung cấp Email công ty hợp lệ để nhận mã xác thực OTP.');
      return;
    }
    setFormError('');
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setCountdown(60);
    setCurrentStep('recruiter_otp');
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError('');

    if (digit && index < 5) {
      const nextEl = document.getElementById(`reg-otp-${index + 1}`);
      if (nextEl) nextEl.focus();
    }
  };

  const handleQuickFillOtp = () => {
    setOtpDigits(generatedOtp.split(''));
    setOtpError('');
  };

  const handleSubmitCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = fullName.trim() || 'Nguyễn Văn An';
    const finalEmail = email.trim() || 'an.career@gmail.com';

    // Account role is fixed at registration, defaults strictly to free plan
    const newAccount: UserAccount = {
      id: `acc-cand-${Date.now()}`,
      role: 'candidate',
      plan: 'free', // Mặc định gói thường, nạp tiền mới được VIP
      fullName: finalName,
      email: finalEmail,
      phone: phone.trim() || '0966 014 967',
      isVerified: true, // Ứng viên xác thực email cá nhân
      registeredAt: new Date().toISOString()
    };

    onSaveAccount(newAccount);
    if (onClose) onClose();
  };

  const handleVerifyRecruiterOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }
    if (entered !== generatedOtp) {
      setOtpError('Mã OTP không chính xác. Vui lòng kiểm tra lại.');
      return;
    }

    // Successfully verified recruiter account
    const newAccount: UserAccount = {
      id: `acc-rec-${Date.now()}`,
      role: 'recruiter',
      plan: 'free', // Mặc định gói thường, nạp tiền mới được VIP
      fullName: fullName.trim() || 'Trần Minh Tuấn (HR Lead)',
      email: companyEmail.trim(),
      companyEmail: companyEmail.trim(),
      companyName: companyName.trim() || 'Công ty CP Công nghệ & Giải pháp FPT',
      phone: phone.trim() || '0988 888 999',
      isVerified: true, // ĐÃ XÁC MINH QUA OTP
      verifiedAt: new Date().toISOString(),
      registeredAt: new Date().toISOString()
    };

    onSaveAccount(newAccount);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E0D8CC] overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#FAF7F2] border-b border-[#E0D8CC] px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#23412E] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-[#A5C7B2]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#2E5339] bg-[#3D684A]/10 px-2 py-0.5 rounded-md">
                Phân quyền tài khoản
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-[#19271E] mt-0.5">
                {currentStep === 'recruiter_otp'
                  ? 'Xác thực OTP Email Công Ty'
                  : 'Đăng ký tài khoản (Vai trò cố định)'}
              </h2>
            </div>
          </div>

          {canClose && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#5C6E62] hover:text-[#1C2B22] hover:bg-[#E8E1D5] transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: ROLE SELECTION & REGISTRATION FORM */}
        {currentStep === 'role_form' && (
          <form
            onSubmit={(e) => {
              if (selectedRole === 'candidate') {
                handleSubmitCandidate(e);
              } else {
                e.preventDefault();
                handleStartRecruiterOtp();
              }
            }}
            className="p-6 sm:p-8 overflow-y-auto space-y-6"
          >
            <div className="text-center space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2A20]">
                “Bạn tham gia hệ thống với tư cách nào?”
              </h3>
              <p className="text-xs sm:text-sm text-[#576B5E] max-w-md mx-auto">
                Vai trò được xác định ngay khi đăng ký và không thể tự ý chuyển đổi để đảm bảo an toàn & quyền riêng tư.
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Candidate Option */}
              <div
                onClick={() => setSelectedRole('candidate')}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between relative ${
                  selectedRole === 'candidate'
                    ? 'border-[#23412E] bg-[#EBF3ED] shadow-md ring-2 ring-[#23412E]/20'
                    : 'border-[#E0D8CC] bg-[#FAF7F2] hover:border-[#8EAA97] hover:bg-white'
                }`}
              >
                {selectedRole === 'candidate' && (
                  <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#23412E] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#D5CDC0] flex items-center justify-center text-2xl shadow-xs mb-3">
                    👤
                  </div>
                  <h4 className="text-base font-extrabold text-[#1C2B22]">
                    Ứng viên tìm việc
                  </h4>
                  <p className="text-xs font-semibold text-[#2E5339] mt-0.5">
                    "Tôi đang tìm kiếm việc làm"
                  </p>
                  <p className="text-xs text-[#55695C] mt-2 leading-relaxed">
                    Dành cho sinh viên và người tìm việc. Tìm kiếm việc làm, lọc theo địa điểm đa tỉnh/thành, mức lương và nộp CV.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D9D0C3] flex items-center justify-between text-xs font-bold text-[#23412E]">
                  <span>Giao diện Ứng viên</span>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-[#D5CDC2]">
                    Miễn phí
                  </span>
                </div>
              </div>

              {/* Recruiter Option */}
              <div
                onClick={() => setSelectedRole('recruiter')}
                className={`cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200 flex flex-col justify-between relative ${
                  selectedRole === 'recruiter'
                    ? 'border-[#23412E] bg-[#EBF3ED] shadow-md ring-2 ring-[#23412E]/20'
                    : 'border-[#E0D8CC] bg-[#FAF7F2] hover:border-[#8EAA97] hover:bg-white'
                }`}
              >
                {selectedRole === 'recruiter' && (
                  <div className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#23412E] text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#D5CDC0] flex items-center justify-center text-2xl shadow-xs mb-3">
                    🏢
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-base font-extrabold text-[#1C2B22]">
                      Nhà tuyển dụng
                    </h4>
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded">
                      Cần OTP
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#2E5339] mt-0.5">
                    "Tôi đang tìm kiếm ứng viên"
                  </p>
                  <p className="text-xs text-[#55695C] mt-2 leading-relaxed">
                    Dành cho doanh nghiệp & HR. Đăng tin tuyển dụng và xem hồ sơ ứng viên sau khi <strong>xác minh mã OTP qua email công ty</strong>.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D9D0C3] flex items-center justify-between text-xs font-bold text-[#23412E]">
                  <span>Giao diện Doanh nghiệp</span>
                  <span className="text-[11px] bg-white px-2 py-0.5 rounded-full border border-[#D5CDC2]">
                    Xác minh OTP
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Registration Fields */}
            <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#E3DBD0] space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2E5339] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Thông tin tài khoản {selectedRole === 'candidate' ? 'Ứng viên' : 'Nhà tuyển dụng'}
              </h4>

              {selectedRole === 'candidate' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                        Họ và tên của bạn:
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn An"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                        Email cá nhân:
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="an.career@gmail.com"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                      Số điện thoại liên hệ:
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0966 014 967"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                        Họ tên người phụ trách tuyển dụng:
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Trần Minh Tuấn (HR Lead)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                        Tên công ty / Doanh nghiệp:
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Công ty CP Công nghệ & Giải pháp FPT"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C2B22] mb-1 flex items-center justify-between">
                      <span>Email công ty (Bắt buộc xác thực OTP):</span>
                      <span className="text-[10px] text-amber-700 font-bold">* Bắt buộc</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      placeholder="tuyendung@fpt-software.com hoặc hr@ten-cong-ty.com"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white font-bold text-[#23412E]"
                    />
                    <span className="text-[10px] text-[#697B70] mt-1 block">
                      Hệ thống sẽ gửi mã xác thực OTP 6 số đến email công ty này.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                      Số điện thoại hotline / HR:
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0988 888 999"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Note on default plan */}
            <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E0D8CC] text-[11px] text-[#66776C] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#2E5339] shrink-0" />
              <span>
                Tài khoản mới đăng ký mặc định là <strong>Gói Thường (Miễn phí)</strong>. Nếu có nhu cầu sử dụng các tính năng cao cấp, người dùng sẽ nạp tiền nâng cấp VIP sau.
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#23412E] hover:bg-[#1A3324] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>
                {selectedRole === 'candidate'
                  ? 'Đăng ký tài khoản Ứng viên (Tìm việc)'
                  : 'Tiếp tục xác thực OTP Email Công ty'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        )}

        {/* STEP 2: RECRUITER MANDATORY OTP VERIFICATION */}
        {currentStep === 'recruiter_otp' && (
          <form onSubmit={handleVerifyRecruiterOtp} className="p-6 sm:p-8 space-y-5">
            <div className="p-4 rounded-2xl bg-[#EAF2ED] border border-[#CADBCF] text-xs text-[#1C3624] space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-[#2E5339]" />
                  Đã gửi mã OTP đến: {companyEmail}
                </span>
                <span className="text-[10px] font-mono text-[#55695C]">Vừa gửi</span>
              </div>
              <p className="text-[11px] text-[#405446]">
                Mã xác thực OTP mô phỏng: <strong className="font-mono text-sm tracking-widest text-[#23412E] bg-white px-2 py-0.5 rounded border border-[#A5C7B2]">{generatedOtp}</strong>
                <button
                  type="button"
                  onClick={handleQuickFillOtp}
                  className="ml-2 font-bold text-[#2E5339] underline"
                >
                  (Điền nhanh)
                </button>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C2B22] mb-2 text-center">
                Nhập mã OTP 6 số để xác thực Nhà tuyển dụng:
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`reg-otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-black rounded-2xl border-2 focus:outline-none transition-all border-[#D5CDC0] bg-white text-[#1C2B22] focus:border-[#2E5339] focus:ring-2 focus:ring-[#2E5339]/20"
                  />
                ))}
              </div>

              {otpError && (
                <div className="mt-2 text-xs text-red-600 font-semibold text-center">
                  {otpError}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#23412E] hover:bg-[#1A3324] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Xác nhận OTP & Hoàn tất đăng ký</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep('role_form')}
                className="w-full py-2 text-xs font-semibold text-[#697B70] hover:text-[#1C2B22] transition-colors"
              >
                Quay lại thay đổi thông tin
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
