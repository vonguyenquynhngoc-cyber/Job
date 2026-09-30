import React from 'react';
import {
  Briefcase,
  Bookmark,
  UserCheck,
  Clock,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  User,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  Crown,
  Lock
} from 'lucide-react';
import { ActiveTab, CandidateProfile, UserAccount } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  savedJobsCount: number;
  applicationsCount: number;
  interviewCount: number;
  profile: CandidateProfile;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  userAccount: UserAccount;
  onOpenAuthModal: () => void;
  onRequestVipModal?: (featureName?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedJobsCount,
  applicationsCount,
  interviewCount,
  profile,
  isMobileOpen,
  setIsMobileOpen,
  userAccount,
  onOpenAuthModal,
  onRequestVipModal
}) => {
  const isCandidate = userAccount.role === 'candidate';
  const isVip = userAccount.plan === 'vip';
  const isVerifiedRecruiter = userAccount.role === 'recruiter' && userAccount.isVerified;

  // Navigation items for candidate
  const candidateNavItems = [
    {
      id: 'jobs' as ActiveTab,
      label: 'Tìm kiếm việc làm',
      icon: Briefcase,
      badge: null,
      description: 'Lọc lương, đa tỉnh/thành & 2 chiều'
    },
    {
      id: 'saved' as ActiveTab,
      label: 'Việc làm đã lưu',
      icon: Bookmark,
      badge: savedJobsCount > 0 ? savedJobsCount : null,
      description: 'Danh sách việc bạn quan tâm'
    },
    {
      id: 'profile' as ActiveTab,
      label: 'Hồ sơ năng lực (CV)',
      icon: UserCheck,
      badge: profile.fullName ? 'Đã tạo' : null,
      badgeColor: 'bg-[#2E5339] text-white',
      description: 'Thông tin cá nhân & nguyện vọng'
    },
    {
      id: 'applications' as ActiveTab,
      label: 'Theo dõi ứng tuyển',
      icon: Clock,
      badge: interviewCount > 0 ? `${interviewCount} PV` : (applicationsCount > 0 ? applicationsCount : null),
      badgeColor: interviewCount > 0 ? 'bg-amber-600 text-white' : undefined,
      description: 'Tiến độ hồ sơ & lịch hẹn'
    }
  ];

  // Navigation items for recruiter
  const recruiterNavItems = [
    {
      id: 'recruiter' as ActiveTab,
      label: 'Bàn làm việc Tuyển dụng',
      icon: Building2,
      badge: 'Chính',
      badgeColor: 'bg-[#23412E] text-white',
      description: 'Đăng tin & Lọc ứng viên theo tiêu chí'
    },
    {
      id: 'jobs' as ActiveTab,
      label: 'Xem bảng tin việc làm',
      icon: Briefcase,
      badge: null,
      description: 'Xem các việc đang tuyển trên thị trường'
    }
  ];

  const currentNavItems = isCandidate ? candidateNavItems : recruiterNavItems;

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="main-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#FAF7F2] border-r border-[#E0D8CC] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Brand Header */}
        <div className="p-5 border-b border-[#E0D8CC] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#23412E] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5 text-[#EBF2EC]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-[#23412E]">JOB</span>
              </div>
              <p className="text-[11px] text-[#5C6E62] font-semibold leading-tight">Tuyển dụng & Việc làm</p>
            </div>
          </div>

          <button
            id="close-mobile-sidebar-btn"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[#5C6E62] hover:bg-[#F0EBE1] transition-colors"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* USER ACCOUNT & ROLE CARD */}
        <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-white border border-[#DCD3C5] shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-[#5D6F63]">
              Vai trò tài khoản
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#55695C] bg-[#F2EDE4] px-2 py-0.5 rounded-full border border-[#DCD3C5]">
              <Lock className="w-2.5 h-2.5 text-[#55695C]" />
              Cố định
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-xs shrink-0 ${
                isCandidate ? 'bg-[#EAF2ED] text-[#23412E]' : 'bg-[#E3EBE6] text-[#1E3B27]'
              }`}
            >
              {isCandidate ? '👤' : '🏢'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-black ${
                    isCandidate ? 'text-[#23412E]' : 'text-[#1B3623]'
                  }`}
                >
                  {isCandidate ? 'Tài khoản Ứng viên' : 'Nhà tuyển dụng'}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5339] shrink-0" />
              </div>
              <p className="text-[11px] text-[#55695C] font-medium truncate">
                {userAccount.fullName || (isCandidate ? 'Nguyễn Văn An' : 'Trần Minh Tuấn')}
              </p>
              {!isCandidate && (
                <span
                  className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    isVerifiedRecruiter
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isVerifiedRecruiter ? '✓ Đã xác minh OTP công ty' : '⚠️ Chưa xác minh OTP'}
                </span>
              )}
            </div>
          </div>

          {/* Account Plan Tier & VIP Upgrade */}
          <div className="pt-1 border-t border-[#EAE3D6] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#6D8073] font-semibold">Gói thành viên:</span>
              {isVip ? (
                <span className="font-black text-amber-800 bg-amber-300/60 px-2 py-0.5 rounded-full border border-amber-400/40 flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-amber-700 text-amber-700" />
                  VIP Pro
                </span>
              ) : (
                <span className="font-bold text-[#55695D] bg-[#F2EDE4] px-2 py-0.5 rounded-full">
                  Gói Thường (Mặc định)
                </span>
              )}
            </div>

            {!isVip ? (
              <button
                type="button"
                id="sidebar-upgrade-vip-btn"
                onClick={() => onRequestVipModal?.('Nâng cấp tài khoản VIP')}
                className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 text-[11px] font-black shadow-2xs flex items-center justify-center gap-1.5 transition-all group cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                <span>[Nâng cấp VIP]</span>
                <span className="text-[10px] text-amber-900/80 font-bold">— Mở khóa ngay</span>
              </button>
            ) : (
              <div className="flex items-center justify-between text-[10px] text-emerald-800 bg-[#EAF2ED] p-1.5 rounded-lg border border-[#CADBCF]">
                <span className="flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Đầy đủ tiện ích VIP đã kích hoạt
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#798C80]">
            {isCandidate ? 'Dành cho Ứng viên' : 'Dành cho Nhà tuyển dụng'}
          </div>

          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#23412E] text-white shadow-sm'
                    : 'text-[#3E5245] hover:bg-[#F2ECE1] hover:text-[#19271E]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[#33563E] text-white' : 'bg-white text-[#526659]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold leading-tight truncate">
                      {item.label}
                    </span>
                    <span
                      className={`block text-[10px] truncate ${
                        isActive ? 'text-[#C5DFCE]' : 'text-[#7A8D80]'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge !== null && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || (isActive ? 'bg-white text-[#23412E]' : 'bg-[#23412E] text-white')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Security Info & Registration Trigger */}
        <div className="p-4 border-t border-[#E0D8CC] bg-white space-y-2.5">
          <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E0D8CC] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C2B22]">
              <ShieldCheck className="w-4 h-4 text-[#2E5339]" />
              <span>Bảo mật phân quyền</span>
            </div>
            <p className="text-[10px] text-[#63766A] leading-relaxed">
              Vai trò được xác định khi đăng ký và không thể tự ý chuyển đổi để đảm bảo tính an toàn và quyền riêng tư hồ sơ.
            </p>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="w-full py-2 px-3 rounded-xl border border-[#D5CDC0] bg-white hover:bg-[#F5EFE6] hover:border-[#2E5339] text-[#23412E] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất / Đăng ký tài khoản khác</span>
            </button>
          </div>

          <div className="pt-0.5 flex items-center justify-between text-[11px] text-[#718477]">
            <span>Hệ thống JOB v2.4</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bảo mật 24/7
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
