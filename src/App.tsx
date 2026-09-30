import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  Bookmark,
  Send,
  UserCheck,
  Building2,
  Briefcase,
  X,
  User,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Crown,
  LogOut
} from 'lucide-react';
import { Job, CandidateProfile, Application, ActiveTab, ApplicationStatus, UserAccount, UserRole } from './types';
import { INITIAL_JOBS } from './data/initialJobs';
import { INITIAL_PROFILE } from './data/initialProfile';
import { INITIAL_APPLICATIONS } from './data/initialApplications';
import { Sidebar } from './components/Sidebar';
import { JobList } from './components/JobList';
import { SavedJobs } from './components/SavedJobs';
import { ProfileView } from './components/ProfileView';
import { ApplicationsView } from './components/ApplicationsView';
import { PostJobView } from './components/PostJobView';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplyModal } from './components/ApplyModal';
import { Footer } from './components/Footer';
import { AccountAuthModal } from './components/AccountAuthModal';
import { VipUpgradeModal } from './components/VipUpgradeModal';
import { OtpVerificationModal } from './components/OtpVerificationModal';

export default function App() {
  // Persistence via localStorage with fallbacks
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('job_app_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('job_app_saved_ids');
    return saved ? new Set(JSON.parse(saved)) : new Set(['job-dn-1', 'job-1']);
  });

  const [profile, setProfile] = useState<CandidateProfile>(() => {
    const saved = localStorage.getItem('job_app_profile');
    if (saved) return JSON.parse(saved);
    return {
      ...INITIAL_PROFILE,
      fullName: 'Nguyễn Văn An',
      email: 'nguyenvanan.career@gmail.com',
      phone: '0966 014 967',
      location: 'Đồng Nai',
      desiredJob: 'Kỹ sư Quản trị Hệ thống & Mạng IT',
      desiredSalary: '8 – 12 triệu VNĐ',
      desiredWorkType: 'Full-time'
    };
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('job_app_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // User Account & Role State (Yêu cầu phân loại tài khoản & phân quyền Thường / VIP)
  const [userAccount, setUserAccount] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('job_app_user_account');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          plan: parsed.plan || 'free'
        };
      } catch (e) {
        // fallback
      }
    }
    return {
      id: 'acc-default-candidate',
      role: 'candidate',
      plan: 'free',
      fullName: 'Nguyễn Văn An (Ứng viên)',
      email: 'nguyenvanan.career@gmail.com',
      phone: '0966 014 967',
      registeredAt: new Date().toISOString()
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [vipModalFeatureName, setVipModalFeatureName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('jobs');
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [externalWorkTypeFilter, setExternalWorkTypeFilter] = useState<string | null>(null);

  // Sync userAccount to localStorage
  useEffect(() => {
    localStorage.setItem('job_app_user_account', JSON.stringify(userAccount));
  }, [userAccount]);

  // Global Toast Notifications Stack
  interface ToastItem {
    id: string;
    message: string;
    timestamp: number;
  }
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const toastTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timer = toastTimersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((msg: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = {
      id,
      message: msg,
      timestamp: Date.now()
    };

    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    const timer = setTimeout(() => {
      removeToast(id);
    }, 4200);

    toastTimersRef.current.set(id, timer);
  }, [removeToast]);

  // Clean up any remaining timers on unmount
  useEffect(() => {
    return () => {
      toastTimersRef.current.forEach((t) => clearTimeout(t));
      toastTimersRef.current.clear();
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('job_app_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('job_app_saved_ids', JSON.stringify(Array.from(savedJobIds)));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('job_app_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('job_app_applications', JSON.stringify(applications));
  }, [applications]);

  // Actions
  const handleOpenVipModal = (featureName?: string) => {
    setVipModalFeatureName(featureName || '');
    setIsVipModalOpen(true);
  };

  const handleUpgradeSuccess = () => {
    setUserAccount((prev) => ({
      ...prev,
      plan: 'vip'
    }));
    setIsVipModalOpen(false);
    showToast('🎉 Chúc mừng bạn đã nâng cấp VIP thành công! Mọi tính năng cao cấp đã được mở khóa.');
  };

  const handleDowngradeToFree = () => {
    setUserAccount((prev) => ({
      ...prev,
      plan: 'free'
    }));
    setIsVipModalOpen(false);
    showToast('Đã chuyển về gói Thường (Chế độ thử nghiệm).');
  };

  const handleSwitchRole = (newRole: UserRole) => {
    const updated: UserAccount = {
      ...userAccount,
      role: newRole,
      companyName:
        newRole === 'recruiter' && !userAccount.companyName
          ? 'Công ty CP Công nghệ & Giải pháp FPT'
          : userAccount.companyName
    };
    setUserAccount(updated);

    if (newRole === 'recruiter') {
      setActiveTab('recruiter');
      showToast('Đã chuyển sang giao diện Nhà tuyển dụng 🏢');
    } else {
      setActiveTab('jobs');
      showToast('Đã chuyển sang giao diện Ứng viên tìm việc 👤');
    }
  };

  const handleSaveAccount = (newAccount: UserAccount) => {
    setUserAccount(newAccount);
    if (newAccount.role === 'recruiter') {
      setActiveTab('recruiter');
      showToast(`Đã lưu tài khoản: ${newAccount.fullName} (Nhà tuyển dụng 🏢)`);
    } else {
      setActiveTab('jobs');
      showToast(`Đã lưu tài khoản: ${newAccount.fullName} (Ứng viên 👤)`);
    }
  };

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        showToast('Đã bỏ lưu việc làm.');
      } else {
        next.add(jobId);
        showToast('Đã lưu việc làm vào danh sách quan tâm!');
      }
      return next;
    });
  };

  const handleApplyClick = (job: Job) => {
    setSelectedJobForApply(job);
  };

  const handleSubmitApplication = (
    appData: Omit<Application, 'id' | 'appliedDate' | 'status'>
  ) => {
    const newApp: Application = {
      ...appData,
      id: 'app-' + Date.now(),
      appliedDate: 'Hôm nay',
      status: 'submitted'
    };
    setApplications((prev) => [newApp, ...prev]);
    setSelectedJobForApply(null);
    showToast(`Ứng tuyển thành công vị trí "${appData.jobTitle}"!`);
  };

  const handleWithdrawApplication = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    showToast('Đã rút hồ sơ ứng tuyển.');
  };

  const handleAddNewJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Đã đăng tin tuyển dụng "${newJob.title}" thành công!`);
  };

  const handleUpdateApplicationStatus = (
    appId: string,
    newStatus: ApplicationStatus,
    interviewDetails?: any,
    feedbackNote?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: newStatus,
            interviewDetails: interviewDetails || app.interviewDetails,
            feedbackNote: feedbackNote !== undefined ? feedbackNote : app.feedbackNote
          };
        }
        return app;
      })
    );

    const statusTextMap: Record<ApplicationStatus, string> = {
      submitted: 'Đã nộp',
      reviewing: 'Đang xem xét',
      interview: 'Mời phỏng vấn',
      accepted: 'Đã trúng tuyển',
      rejected: 'Chưa phù hợp'
    };
    showToast(`Đã cập nhật trạng thái hồ sơ thành: ${statusTextMap[newStatus]}`);
  };

  const handleFooterNavigate = (tab: ActiveTab, filterWorkType?: string) => {
    if (filterWorkType) {
      setExternalWorkTypeFilter(filterWorkType);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const appliedJobIds = new Set(applications.map((a) => a.jobId));
  const interviewCount = applications.filter((a) => a.status === 'interview').length;
  const isCandidate = userAccount.role === 'candidate';

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification Container */}
      {toasts.length > 0 && (
        <div
          id="global-toast-container"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[99999] flex flex-col-reverse gap-2 max-w-sm pointer-events-none"
        >
          {toasts.map((toast, index) => {
            const isNewest = index === 0;
            const itemZIndex = 99999 + (toasts.length - index);

            return (
              <div
                key={toast.id}
                id={isNewest ? 'global-toast-notification' : undefined}
                style={{ zIndex: itemZIndex }}
                className="global-toast-item pointer-events-auto bg-[#23412E] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-[#43664E] backdrop-blur-md animate-toast-scale transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-emerald-950/40"
              >
                <CheckCircle2 className="w-4 h-4 text-[#A5C7B2] shrink-0" />
                <span className="flex-1 leading-relaxed text-left">{toast.message}</span>
                {toasts.length > 1 && (
                  <span className="text-[10px] text-[#A5C7B2]/80 font-mono px-1.5 py-0.5 rounded-full bg-[#1A3323] border border-[#34583E] shrink-0">
                    #{toasts.length - index}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="p-1 -mr-1 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
                  title="Đóng thông báo"
                  aria-label="Đóng thông báo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Left Sidebar Menu */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedJobsCount={savedJobIds.size}
        applicationsCount={applications.length}
        interviewCount={interviewCount}
        profile={profile}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        userAccount={userAccount}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        onRequestVipModal={handleOpenVipModal}
        onTogglePlanTest={() => (userAccount.plan === 'vip' ? handleDowngradeToFree() : handleUpgradeSuccess())}
      />

      {/* Main Right Workspace Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
        {/* Top Header Bar for Desktop & Mobile */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E0D8CC] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          {/* Mobile hamburger button */}
          <div className="flex items-center gap-3">
            <button
              id="open-mobile-sidebar-btn"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#23412E] hover:bg-[#F2ECE1] transition-colors"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#23412E] flex items-center justify-center text-white lg:hidden">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base sm:text-lg text-[#23412E]">
                {isCandidate ? 'Cổng Ứng Viên Tìm Việc' : 'Cổng Nhà Tuyển Dụng'}
              </span>
            </div>
          </div>

          {/* Role Status & Switcher Controls in Header */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* VIP Status Badge or Upgrade Button */}
            {userAccount.plan === 'vip' ? (
              <button
                type="button"
                id="header-vip-active-btn"
                onClick={() => handleOpenVipModal('Đặc quyền thành viên VIP')}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-xs shadow-xs flex items-center gap-1.5 border border-amber-300 hover:from-amber-300 hover:to-amber-400 transition-all cursor-pointer"
                title="Tài khoản VIP đang hoạt động. Nhấn để xem quyền lợi"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                <span>VIP Active</span>
              </button>
            ) : (
              <button
                type="button"
                id="header-upgrade-vip-btn"
                onClick={() => handleOpenVipModal('Nâng cấp tài khoản VIP')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 text-xs font-black shadow-xs flex items-center gap-1.5 transition-all group animate-pulse hover:animate-none cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                <span>[Nâng cấp VIP]</span>
              </button>
            )}

            {/* Active Role Pill */}
            <div
              onClick={() => setIsAuthModalOpen(true)}
              className="cursor-pointer px-3 py-1.5 rounded-xl border flex items-center gap-2 bg-[#FAF7F2] border-[#DCD3C5] hover:border-[#2E5339] transition-all"
              title="Nhấn để đổi vai trò hoặc đăng ký tài khoản"
            >
              <span className="text-sm">{isCandidate ? '👤' : '🏢'}</span>
              <div className="hidden sm:block text-left">
                <span className="block text-[11px] font-extrabold text-[#1C2B22] leading-none">
                  {isCandidate ? 'Ứng viên' : 'Nhà tuyển dụng'}
                </span>
                <span className="text-[10px] text-[#697B70] leading-none">
                  {userAccount.fullName.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Quick Switch Button */}
            <button
              onClick={() => handleSwitchRole(isCandidate ? 'recruiter' : 'candidate')}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#23412E] text-white hover:bg-[#1A3324] shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title={isCandidate ? 'Chuyển sang Nhà tuyển dụng' : 'Chuyển sang Ứng viên'}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isCandidate ? 'Sang Nhà tuyển dụng' : 'Sang Ứng viên'}
              </span>
            </button>

            {/* Profile Avatar trigger */}
            <button
              onClick={() => setActiveTab(isCandidate ? 'profile' : 'recruiter')}
              className="w-8 h-8 rounded-full bg-[#2E5339] text-white font-bold text-xs flex items-center justify-center shadow-xs hover:opacity-90 cursor-pointer"
              title="Hồ sơ tài khoản"
            >
              {userAccount.fullName.split(' ').slice(-1)[0][0] || (isCandidate ? 'A' : 'T')}
            </button>
          </div>
        </header>

        {/* Workspace Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'jobs' && (
            <JobList
              jobs={jobs}
              savedJobIds={savedJobIds}
              appliedJobIds={appliedJobIds}
              onToggleSave={handleToggleSave}
              onViewDetails={(job) => setSelectedJobForDetails(job)}
              onApply={handleApplyClick}
              onNavigateToPostJob={() => setActiveTab('recruiter')}
              onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
              externalWorkTypeFilter={externalWorkTypeFilter}
              onClearExternalFilter={() => setExternalWorkTypeFilter(null)}
              candidateProfile={profile}
              userAccount={userAccount}
              onRequestVipModal={handleOpenVipModal}
            />
          )}

          {activeTab === 'saved' && (
            <SavedJobs
              jobs={jobs}
              savedJobIds={savedJobIds}
              appliedJobIds={appliedJobIds}
              onToggleSave={handleToggleSave}
              onViewDetails={(job) => setSelectedJobForDetails(job)}
              onApply={handleApplyClick}
              onNavigateToJobs={() => setActiveTab('jobs')}
              userAccount={userAccount}
              onRequestVipModal={handleOpenVipModal}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onUpdateProfile={(updated) => {
                setProfile(updated);
                showToast('Đã lưu hồ sơ năng lực thành công!');
              }}
            />
          )}

          {activeTab === 'applications' && (
            <ApplicationsView
              applications={applications}
              onWithdrawApplication={handleWithdrawApplication}
              onNavigateToJobs={() => setActiveTab('jobs')}
            />
          )}

          {activeTab === 'recruiter' && (
            <PostJobView
              jobs={jobs}
              applications={applications}
              currentUserProfile={profile}
              userAccount={userAccount}
              onAddNewJob={handleAddNewJob}
              onUpdateApplicationStatus={handleUpdateApplicationStatus}
              onRequestVipModal={handleOpenVipModal}
              onSwitchRole={handleSwitchRole}
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer
          onNavigateTab={handleFooterNavigate}
          onShowToast={showToast}
        />
      </div>

      {/* Global Modals */}
      <JobDetailModal
        job={selectedJobForDetails}
        isOpen={Boolean(selectedJobForDetails)}
        onClose={() => setSelectedJobForDetails(null)}
        isSaved={selectedJobForDetails ? savedJobIds.has(selectedJobForDetails.id) : false}
        hasApplied={selectedJobForDetails ? appliedJobIds.has(selectedJobForDetails.id) : false}
        onToggleSave={handleToggleSave}
        onApply={handleApplyClick}
      />

      <ApplyModal
        job={selectedJobForApply}
        profile={profile}
        isOpen={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        onSubmitApplication={handleSubmitApplication}
        userAccount={userAccount}
        appliedCountToday={appliedJobIds.size}
        onRequestVipModal={handleOpenVipModal}
      />

      {/* Phân loại tài khoản khi đăng ký / chuyển đổi (Yêu cầu số 3) */}
      <AccountAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentAccount={userAccount}
        onSaveAccount={handleSaveAccount}
      />

      {/* Modal Nâng cấp VIP (Yêu cầu hiển thị nâng cấp VIP tự nguyện) */}
      <VipUpgradeModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        featureName={vipModalFeatureName}
        userAccount={userAccount}
        onUpgradeSuccess={handleUpgradeSuccess}
        onDowngradeToFree={handleDowngradeToFree}
      />
    </div>
  );
}
