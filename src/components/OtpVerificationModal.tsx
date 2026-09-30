import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  X,
  Building2,
  AlertCircle
} from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyEmail: string;
  onVerifySuccess: (verifiedEmail: string) => void;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  companyEmail,
  onVerifySuccess
}) => {
  const [targetEmail, setTargetEmail] = useState(companyEmail || 'tuyendung@fpt-software.com');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('852914');
  const [countdown, setCountdown] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSimulatedEmailBanner, setShowSimulatedEmailBanner] = useState(true);

  // Sync email when prop changes
  useEffect(() => {
    if (companyEmail) {
      setTargetEmail(companyEmail);
    }
  }, [companyEmail]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, isOpen]);

  // Handle re-sending OTP
  const handleResendOtp = () => {
    if (countdown > 0) return;
    setIsSending(true);
    setErrorMsg('');

    setTimeout(() => {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(newCode);
      setOtpCode(['', '', '', '', '', '']);
      setCountdown(60);
      setIsSending(false);
      setShowSimulatedEmailBanner(true);
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste handling
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const nextInput = document.getElementById(`otp-input-${Math.min(digits.length, 5)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newOtp = [...otpCode];
    newOtp[index] = digit;
    setOtpCode(newOtp);
    setErrorMsg('');

    // Auto-advance
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleQuickFill = () => {
    setOtpCode(generatedCode.split(''));
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP xác nhận.');
      return;
    }

    if (entered !== generatedCode) {
      setErrorMsg('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại.');
      return;
    }

    // Success
    onVerifySuccess(targetEmail);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E0D8CC] overflow-hidden my-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#23412E] text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-400 text-[#1C2B22] flex items-center justify-center shadow-lg font-black shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#1A3323]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-400/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Xác minh doanh nghiệp
              </span>
            </div>
          </div>

          <h2 className="text-xl font-black text-white leading-tight">
            Xác thực Email Nhà Tuyển Dụng
          </h2>
          <p className="text-xs text-[#D5E5DA] mt-1.5 leading-relaxed">
            Theo chính sách bảo mật, chỉ Nhà tuyển dụng đã xác minh email công ty mới được quyền xem hồ sơ và CV của ứng viên.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5 text-[#1C2B22]">
          {/* Simulated Email Notification Banner */}
          {showSimulatedEmailBanner && (
            <div className="p-3.5 rounded-2xl bg-[#EAF2ED] border border-[#CADBCF] text-xs text-[#1C3624] space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <Mail className="w-4 h-4 text-[#2E5339]" />
                  Hộp thư đến công ty: {targetEmail}
                </span>
                <span className="text-[10px] font-mono text-[#55695C]">Vừa gửi</span>
              </div>
              <p className="text-[11px] text-[#405446]">
                Mã xác thực OTP của bạn là:{' '}
                <strong className="font-mono text-sm tracking-widest text-[#23412E] bg-white px-2 py-0.5 rounded border border-[#A5C7B2]">
                  {generatedCode}
                </strong>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="ml-2 text-[11px] font-bold text-[#2E5339] underline hover:text-[#183120]"
                >
                  (Bấm để tự điền)
                </button>
              </p>
            </div>
          )}

          {/* Email Display */}
          <div>
            <label className="block text-xs font-bold text-[#1C2B22] mb-1">
              Email công ty tiếp nhận mã OTP:
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] text-xs font-semibold text-[#2E5339]">
              <Building2 className="w-4 h-4 text-[#7A8E80] shrink-0" />
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="bg-transparent w-full focus:outline-none font-bold"
                placeholder="hr@ten-cong-ty.com"
              />
            </div>
            <span className="text-[10px] text-[#697B70] mt-1 block">
              Khuyến nghị sử dụng email tên miền công ty để được hệ thống tự động xác nhận uy tín.
            </span>
          </div>

          {/* 6-digit OTP Inputs */}
          <div>
            <label className="block text-xs font-bold text-[#1C2B22] mb-2 text-center">
              Nhập 6 chữ số mã OTP đã gửi:
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-black rounded-2xl border-2 focus:outline-none transition-all ${
                    digit
                      ? 'border-[#2E5339] bg-[#EAF2ED] text-[#23412E]'
                      : 'border-[#D5CDC0] bg-white text-[#1C2B22] focus:border-[#2E5339] focus:ring-2 focus:ring-[#2E5339]/20'
                  }`}
                />
              ))}
            </div>

            {errorMsg && (
              <div className="mt-2.5 text-xs text-red-600 font-semibold flex items-center justify-center gap-1.5 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Countdown & Resend link */}
          <div className="text-center text-xs text-[#55695C]">
            {countdown > 0 ? (
              <span>
                Gửi lại mã OTP sau <strong className="text-[#1C2B22] font-mono">{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSending}
                className="font-bold text-[#2E5339] hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Gửi lại mã OTP qua email</span>
              </button>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-2xl bg-[#23412E] hover:bg-[#1A3324] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Xác nhận & Hoàn tất xác minh</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-[#697B70] hover:text-[#1C2B22] transition-colors"
            >
              Hủy bỏ (Để sau)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
