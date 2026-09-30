import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Crown,
  CheckCircle2,
  X,
  Zap,
  ShieldCheck,
  Building2,
  User,
  ArrowRight,
  CreditCard,
  QrCode,
  Check,
  RotateCcw,
  Receipt,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { UserAccount, AccountPlan, VipPackage } from '../types';

interface VipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  userAccount: UserAccount;
  onUpgradeSuccess: (packageName: string, amount: number) => void;
  onOpenOtpModal?: () => void;
}

const VIP_PACKAGES: VipPackage[] = [
  {
    id: 'month',
    name: 'Gói VIP 1 Tháng',
    price: 199000,
    durationMonths: 1,
    badge: 'Cơ bản',
    savings: ''
  },
  {
    id: 'quarter',
    name: 'Gói VIP 3 Tháng',
    price: 499000,
    durationMonths: 3,
    badge: 'Phổ biến nhất',
    savings: 'Tiết kiệm 20%',
    isPopular: true
  },
  {
    id: 'year',
    name: 'Gói VIP 12 Tháng',
    price: 1490000,
    durationMonths: 12,
    badge: 'Tiết kiệm tối đa',
    savings: 'Tiết kiệm 40%'
  }
];

export const VipUpgradeModal: React.FC<VipUpgradeModalProps> = ({
  isOpen,
  onClose,
  featureName,
  userAccount,
  onUpgradeSuccess,
  onOpenOtpModal
}) => {
  const [step, setStep] = useState<'benefits' | 'checkout' | 'success'>('benefits');
  const [selectedPkgId, setSelectedPkgId] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'momo' | 'card'>('vietqr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidReceipt, setPaidReceipt] = useState<{ id: string; time: string; amount: number } | null>(null);

  if (!isOpen) return null;

  const isCandidate = userAccount.role === 'candidate';
  const isRecruiter = userAccount.role === 'recruiter';
  const isCurrentlyVip = userAccount.plan === 'vip';
  const isUnverifiedRecruiter = isRecruiter && !userAccount.isVerified;

  const activePackage = VIP_PACKAGES.find((p) => p.id === selectedPkgId) || VIP_PACKAGES[1];
  const transferCode = `JOB VIP ${userAccount.id.slice(-6).toUpperCase()}`;

  const handleStartCheckout = () => {
    setStep('checkout');
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    // Simulate real banking / payment gateway handshake
    setTimeout(() => {
      const receipt = {
        id: `TXN-${Date.now().toString().slice(-8)}`,
        time: new Date().toLocaleTimeString('vi-VN') + ' - ' + new Date().toLocaleDateString('vi-VN'),
        amount: activePackage.price
      };
      setPaidReceipt(receipt);
      setIsProcessing(false);
      setStep('success');

      // Update state in app
      onUpgradeSuccess(activePackage.name, activePackage.price);
    }, 1200);
  };

  const handleFinish = () => {
    setStep('benefits');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E0D8CC] overflow-hidden my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with VIP Gold / Emerald theme */}
        <div className="bg-gradient-to-r from-[#23412E] via-[#2F533C] to-[#1C3624] text-white p-6 sm:p-7 relative overflow-hidden shrink-0">
          <div className="absolute right-0 top-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-[#1C2B22] flex items-center justify-center shadow-lg font-black shrink-0">
              <Crown className="w-5 h-5 fill-amber-900 text-amber-900" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                💎 Gói nâng cấp VIP (Nạp tiền thanh toán)
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight flex items-center gap-2">
            <span>🔒 Tính năng dành cho thành viên VIP</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#D5E5DA] mt-1.5 leading-relaxed">
            {step === 'checkout'
              ? 'Nạp tiền thanh toán để kích hoạt gói VIP và mở khóa đầy đủ tiện ích.'
              : 'Nâng cấp VIP để mở khóa tính năng này và sử dụng JOB với đầy đủ tiện ích.'}
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#1C2B22]">
          {/* STEP 1: BENEFITS & PACKAGE SELECTION */}
          {step === 'benefits' && (
            <>
              {/* Feature limit alert if triggered by locked action */}
              {featureName && (
                <div className="p-3.5 rounded-2xl bg-[#FFF9ED] border border-[#FFE1A8] text-xs text-[#8A5A00] flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-[#6D4700]">
                      🔒 Giới hạn tài khoản thường: {featureName}
                    </strong>
                    <span>
                      Tài khoản mặc định là gói Thường. Vui lòng nạp tiền nâng cấp VIP để sử dụng không giới hạn.
                    </span>
                  </div>
                </div>
              )}

              {/* Unverified Recruiter Notice */}
              {isUnverifiedRecruiter && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold text-amber-900">
                        Lưu ý: Bạn chưa xác minh email công ty
                      </strong>
                      <span>
                        Chỉ Nhà tuyển dụng đã xác minh bằng mã OTP qua email công ty mới được phép xem thông tin và CV của ứng viên.
                      </span>
                    </div>
                  </div>
                  {onOpenOtpModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenOtpModal();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 self-center"
                    >
                      Xác minh ngay
                    </button>
                  )}
                </div>
              )}

              {/* VIP Packages Selection Cards */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-[#2E5339] mb-2.5 block flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  1. Chọn gói nạp VIP phù hợp với bạn:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {VIP_PACKAGES.map((pkg) => {
                    const isSelected = selectedPkgId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPkgId(pkg.id)}
                        className={`cursor-pointer rounded-2xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#2E5339] bg-[#EAF2ED] shadow-sm ring-2 ring-[#2E5339]/20'
                            : 'border-[#E0D8CC] bg-[#FAF8F5] hover:border-[#BED7C6] hover:bg-white'
                        }`}
                      >
                        {pkg.isPopular && (
                          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 text-[10px] font-black px-2 py-0.2 rounded-full uppercase shadow-xs">
                            Phổ biến
                          </div>
                        )}
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#55695C]">
                            <span>{pkg.badge}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#2E5339]" />}
                          </div>
                          <h4 className="text-xs font-extrabold text-[#1B2A20] mt-1">
                            {pkg.name}
                          </h4>
                          <div className="text-base sm:text-lg font-black text-[#2E5339] mt-1">
                            {pkg.price.toLocaleString('vi-VN')} <span className="text-xs font-bold">đ</span>
                          </div>
                        </div>

                        {pkg.savings && (
                          <div className="mt-2 text-[10px] font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-md border border-[#BED7C6] inline-block text-center">
                            {pkg.savings}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Benefits Comparison */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#2E5339] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Quyền lợi đặc quyền khi nâng cấp {isCandidate ? 'Ứng viên VIP' : 'Nhà tuyển dụng VIP'}
                </h3>

                {isCandidate ? (
                  // Candidate VIP benefits
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Không giới hạn tìm kiếm và ứng tuyển:</strong>
                        <span className="text-[#55695C] ml-1">Tự do nộp hồ sơ tới tất cả các công ty mỗi ngày (tài khoản thường tối đa 3 việc/ngày).</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Đầy đủ bộ lọc nâng cao:</strong>
                        <span className="text-[#55695C] ml-1">Tự do nhập mức lương mong muốn, chọn nhiều tỉnh/thành phố không giới hạn, lọc theo ngành nghề & kinh nghiệm.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Ưu tiên đề xuất việc làm phù hợp hồ sơ:</strong>
                        <span className="text-[#55695C] ml-1">Tự động ưu tiên đề xuất và ghim các việc làm khớp 100% lên vị trí hàng đầu.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Lưu số lượng việc làm lớn hơn (Không giới hạn):</strong>
                        <span className="text-[#55695C] ml-1">Thoải mái lưu trữ và theo dõi các việc làm bạn quan tâm (tài khoản thường tối đa 5 việc).</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Recruiter VIP benefits
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Đăng nhiều tin tuyển dụng hơn / Không giới hạn:</strong>
                        <span className="text-[#55695C] ml-1">Đăng tin không hạn chế cho nhiều vị trí (tài khoản thường tối đa 2 tin tuyển dụng).</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Xem hồ sơ ứng viên đầy đủ:</strong>
                        <span className="text-[#55695C] ml-1">Mở khóa toàn bộ thông tin liên hệ (số điện thoại, email trực tiếp) và chi tiết dự án CV.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Sử dụng đầy đủ bộ lọc ứng viên:</strong>
                        <span className="text-[#55695C] ml-1">Lọc chính xác theo kỹ năng, kinh nghiệm, mức lương mong muốn và tỉnh/thành phố.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]">
                      <CheckCircle2 className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#1C2B22]">Ưu tiên hiển thị tin tuyển dụng:</strong>
                        <span className="text-[#55695C] ml-1">Tin đăng gắn nhãn ⭐ VIP Hot, ưu tiên hiển thị ở vị trí hàng đầu trên bảng tin việc làm.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Button to proceed to payment */}
              <div className="pt-2 space-y-2">
                {!isCurrentlyVip ? (
                  <button
                    type="button"
                    id="btn-vip-proceed-checkout"
                    onClick={handleStartCheckout}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-amber-950 font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group ring-2 ring-amber-400/40"
                  >
                    <Crown className="w-5 h-5 text-amber-900 fill-amber-900" />
                    <span>[Nâng cấp VIP]</span>
                    <span className="text-xs font-bold text-amber-900/80">
                      — Tiến hành nạp tiền ({activePackage.price.toLocaleString('vi-VN')} đ)
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1" />
                  </button>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-[#EAF2ED] text-[#1D3B26] font-bold text-center text-xs flex items-center justify-center gap-2 border border-[#A5C7B2]">
                    <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Tài khoản của bạn đang có gói VIP đầy đủ quyền lợi!</span>
                  </div>
                )}

                <div className="text-center pt-1 text-xs">
                  <button
                    onClick={onClose}
                    className="text-[#697B70] hover:text-[#1C2B22] font-semibold py-1 transition-colors"
                  >
                    Để sau (Tiếp tục dùng gói thường)
                  </button>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: CHECKOUT & NẠP TIỀN */}
          {step === 'checkout' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#66776C] block">Gói đã chọn:</span>
                  <strong className="text-sm font-black text-[#1C2B22]">{activePackage.name}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-semibold text-[#66776C] block">Số tiền thanh toán:</span>
                  <span className="text-lg font-black text-[#2E5339]">
                    {activePackage.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-bold text-[#1C2B22] block mb-2">
                  Phương thức thanh toán & Nạp tiền:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-2xl border-2 font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'vietqr'
                        ? 'border-[#2E5339] bg-[#EAF2ED] text-[#23412E]'
                        : 'border-[#E0D8CC] bg-[#FAF8F5] text-[#55695C]'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#2E5339]" />
                    <span>VietQR Napas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-2xl border-2 font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-[#2E5339] bg-[#EAF2ED] text-[#23412E]'
                        : 'border-[#E0D8CC] bg-[#FAF8F5] text-[#55695C]'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-pink-600" />
                    <span>Ví MoMo / VNPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border-2 font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#2E5339] bg-[#EAF2ED] text-[#23412E]'
                        : 'border-[#E0D8CC] bg-[#FAF8F5] text-[#55695C]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>Thẻ ATM / Visa</span>
                  </button>
                </div>
              </div>

              {/* Banking & QR Transfer Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F4EFE6] border border-[#DDD3C4] space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* QR Code Simulation */}
                  <div className="w-32 h-32 bg-white rounded-2xl p-2 border border-[#D5CDC0] shadow-xs flex flex-col items-center justify-center shrink-0 text-center">
                    <QrCode className="w-20 h-20 text-[#23412E]" />
                    <span className="text-[9px] font-mono text-[#55695C] mt-1 font-bold">Quét VietQR 24/7</span>
                  </div>

                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex justify-between border-b border-[#E3DBD0] pb-1">
                      <span className="text-[#677A6E]">Ngân hàng:</span>
                      <strong className="text-[#1C2B22]">Vietcombank (VCB)</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E3DBD0] pb-1">
                      <span className="text-[#677A6E]">Số tài khoản:</span>
                      <strong className="text-[#2E5339] font-mono font-black text-sm">9966 014 967</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E3DBD0] pb-1">
                      <span className="text-[#677A6E]">Chủ tài khoản:</span>
                      <strong className="text-[#1C2B22]">CONG TY CP CONG NGHE JOB</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#E3DBD0] pb-1">
                      <span className="text-[#677A6E]">Số tiền:</span>
                      <strong className="text-[#2E5339] font-bold">
                        {activePackage.price.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                    <div className="flex justify-between pt-0.5">
                      <span className="text-[#677A6E]">Nội dung:</span>
                      <strong className="text-amber-900 bg-amber-200/80 px-1.5 py-0.2 rounded font-mono font-bold">
                        {transferCode}
                      </strong>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-[#697B70] leading-snug">
                  * Hệ thống kết nối cổng Napas 24/7 tự động xác nhận sau khi nhận được tiền và kích hoạt ngay tài khoản VIP.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  id="btn-confirm-paid-vip"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#23412E] hover:bg-[#1A3324] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Đang kiểm tra và xác nhận giao dịch...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Xác nhận đã nạp tiền / Thanh toán hoàn tất</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('benefits')}
                  disabled={isProcessing}
                  className="w-full py-2 text-xs font-semibold text-[#697B70] hover:text-[#1C2B22] transition-colors"
                >
                  Quay lại chọn gói khác
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT SUCCESS CONFIRMATION */}
          {step === 'success' && paidReceipt && (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs border-2 border-emerald-300">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#1C2B22]">
                  Nạp tiền & Kích hoạt VIP Thành công! 🎉
                </h3>
                <p className="text-xs text-[#55695C] mt-1 max-w-sm mx-auto">
                  Cảm ơn bạn đã nâng cấp gói <strong>{activePackage.name}</strong>. Toàn bộ tính năng cao cấp đã được mở khóa ngay lập tức.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-[#FAF8F5] border border-[#E0D8CC] rounded-2xl p-4 text-xs text-left space-y-2 max-w-sm mx-auto font-mono">
                <div className="flex justify-between border-b border-[#EAE3D6] pb-1">
                  <span className="text-[#6D8073]">Mã giao dịch:</span>
                  <strong>{paidReceipt.id}</strong>
                </div>
                <div className="flex justify-between border-b border-[#EAE3D6] pb-1">
                  <span className="text-[#6D8073]">Thời gian:</span>
                  <span>{paidReceipt.time}</span>
                </div>
                <div className="flex justify-between border-b border-[#EAE3D6] pb-1">
                  <span className="text-[#6D8073]">Số tiền đã nạp:</span>
                  <strong className="text-[#2E5339]">{paidReceipt.amount.toLocaleString('vi-VN')} đ</strong>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Trạng thái:</span>
                  <span>ĐÃ KÍCH HOẠT VIP</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full py-3 px-6 rounded-2xl bg-[#23412E] hover:bg-[#1A3324] text-white font-extrabold text-sm shadow-md transition-all"
                >
                  Bắt đầu sử dụng các tiện ích VIP ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
