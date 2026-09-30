import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  GraduationCap,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  Check,
  CheckCircle2,
  ChevronDown,
  X,
  Compass,
  ArrowUpDown,
  Clock
} from 'lucide-react';
import { Job, FilterState, CandidateProfile, SalaryTier, UserAccount } from '../types';
import { JobCard } from './JobCard';
import { CATEGORIES, PROVINCES, WORK_TYPES, SALARY_TIERS } from '../data/initialJobs';
import { CareerCorner } from './CareerCorner';

interface JobListProps {
  jobs: Job[];
  savedJobIds: Set<string>;
  appliedJobIds: Set<string>;
  onToggleSave: (jobId: string) => void;
  onViewDetails: (job: Job) => void;
  onApply: (job: Job) => void;
  onNavigateToPostJob: () => void;
  onNavigateToTab?: (tab: string) => void;
  externalWorkTypeFilter?: string | null;
  onClearExternalFilter?: () => void;
  candidateProfile?: CandidateProfile;
  userAccount?: UserAccount;
  onRequestVipModal?: (featureName: string) => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  savedJobIds,
  appliedJobIds,
  onToggleSave,
  onViewDetails,
  onApply,
  onNavigateToPostJob,
  onNavigateToTab,
  externalWorkTypeFilter,
  onClearExternalFilter,
  candidateProfile,
  userAccount,
  onRequestVipModal
}) => {
  const isFreeCandidate = userAccount?.role === 'candidate' && userAccount?.plan === 'free';
  const isVipCandidate = userAccount?.role === 'candidate' && userAccount?.plan === 'vip';

  // Wrapper for onApply with VIP limit check
  const handleApplyWrapped = (job: Job) => {
    if (isFreeCandidate && appliedJobIds.size >= 3) {
      if (onRequestVipModal) {
        onRequestVipModal('Ứng tuyển không giới hạn (Tài khoản miễn phí tối đa 3 lượt nộp/ngày)');
      }
      return;
    }
    onApply(job);
  };

  // Wrapper for onToggleSave with VIP limit check
  const handleToggleSaveWrapped = (jobId: string) => {
    if (!savedJobIds.has(jobId) && isFreeCandidate && savedJobIds.size >= 5) {
      if (onRequestVipModal) {
        onRequestVipModal('Lưu trữ việc làm không giới hạn (Tài khoản miễn phí tối đa lưu 5 việc làm)');
      }
      return;
    }
    onToggleSave(jobId);
  };
  // Filters State
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả ngành nghề');
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedWorkType, setSelectedWorkType] = useState<string>(externalWorkTypeFilter || 'Tất cả hình thức');
  const [selectedSalaryTier, setSelectedSalaryTier] = useState<SalaryTier>('all');
  const [customSalaryInput, setCustomSalaryInput] = useState<string>('');
  const [studentFriendlyOnly, setStudentFriendlyOnly] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Two-way Matching Preference State (Default matches the prompt example: Đồng Nai · 8 - 12 triệu · Full-time)
  const [enableTwoWayMatch, setEnableTwoWayMatch] = useState<boolean>(true);
  const [prefProvince, setPrefProvince] = useState<string>('Đồng Nai');
  const [prefSalaryTier, setPrefSalaryTier] = useState<string>('8m_12m');
  const [prefWorkType, setPrefWorkType] = useState<string>('Full-time');

  // Sync externalWorkTypeFilter when prop changes
  React.useEffect(() => {
    if (externalWorkTypeFilter) {
      setSelectedWorkType(externalWorkTypeFilter);
    }
  }, [externalWorkTypeFilter]);

  // Quick suggestions for student search
  const quickTags = [
    'Thực tập có lương',
    'Hỗ trợ dấu thực tập',
    'Đồng Nai',
    'ReactJS',
    'Marketing',
    'Part-time'
  ];

  // Toggle multi-select province
  const toggleProvince = (province: string) => {
    setSelectedProvinces((prev) => {
      const isSelecting = !prev.includes(province);
      if (isSelecting && isFreeCandidate && prev.length >= 2) {
        if (onRequestVipModal) {
          onRequestVipModal('Chọn nhiều tỉnh/thành phố không giới hạn (Tài khoản miễn phí chọn tối đa 2 tỉnh/thành)');
        }
        return prev;
      }
      return isSelecting ? [...prev, province] : prev.filter((p) => p !== province);
    });
  };

  const handleSelectAllProvinces = () => {
    if (isFreeCandidate) {
      if (onRequestVipModal) {
        onRequestVipModal('Lọc toàn bộ tỉnh/thành phố cùng lúc (Đặc quyền Ứng viên VIP)');
      }
      return;
    }
    setSelectedProvinces([...PROVINCES]);
  };

  const handleClearProvinces = () => {
    setSelectedProvinces([]);
  };

  const handleSelectSalaryTier = (tierVal: SalaryTier) => {
    if (tierVal === 'custom' && isFreeCandidate) {
      if (onRequestVipModal) {
        onRequestVipModal('Tự nhập mức lương mong muốn (Bộ lọc nâng cao cho thành viên VIP)');
      }
      return;
    }
    setSelectedSalaryTier(tierVal);
  };

  // Check if job matches salary criteria
  const matchSalary = (job: Job): boolean => {
    if (selectedSalaryTier === 'all') return true;

    if (selectedSalaryTier === 'custom') {
      const targetVal = parseFloat(customSalaryInput);
      if (isNaN(targetVal) || targetVal <= 0) return true;

      // If job has numeric salary bounds
      if (job.salaryMin !== undefined && job.salaryMax !== undefined) {
        return targetVal >= job.salaryMin - 1.5 && targetVal <= job.salaryMax + 1.5;
      }
      return true;
    }

    const tierObj = SALARY_TIERS.find((s) => s.value === selectedSalaryTier);
    if (!tierObj) return true;

    // Direct tier code match
    if (job.salaryTier === selectedSalaryTier) return true;

    // Or numeric range overlap match
    if (job.salaryMin !== undefined && job.salaryMax !== undefined) {
      const min = tierObj.min;
      const max = tierObj.max;
      return job.salaryMin < max && job.salaryMax > min;
    }

    return false;
  };

  // Check if job matches location criteria (multi-select)
  const matchLocation = (job: Job): boolean => {
    if (selectedProvinces.length === 0) return true;

    const jobProvince = job.province || job.location;
    return selectedProvinces.some((prov) => {
      if (prov === 'Các tỉnh/thành khác') {
        return !PROVINCES.slice(0, 7).some((mainP) => jobProvince.includes(mainP));
      }
      return jobProvince.includes(prov) || job.address?.includes(prov);
    });
  };

  // Two-way match evaluation for a job
  const evaluateTwoWayMatch = (job: Job) => {
    const jobProv = job.province || job.location;
    const matchLoc = jobProv.includes(prefProvince);
    const matchSal = job.salaryTier === prefSalaryTier || (job.salaryMin && job.salaryMin >= 8 && job.salaryMax && job.salaryMax <= 12);
    const matchWork = job.workType === prefWorkType;

    const score = (matchLoc ? 40 : 0) + (matchSal ? 35 : 0) + (matchWork ? 25 : 0);
    const isFullMatch = score === 100;

    return {
      score,
      isFullMatch,
      matchLoc,
      matchSal,
      matchWork
    };
  };

  // Filtering & Sorting Logic
  const filteredAndRankedJobs = useMemo(() => {
    const list = jobs.filter((job) => {
      // 1. Keyword search (title, company, description, tags, category)
      if (keyword.trim()) {
        const query = keyword.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesTags = job.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCategory = job.category.toLowerCase().includes(query);
        const matchesLoc = (job.province || job.location).toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesDesc && !matchesTags && !matchesCategory && !matchesLoc) {
          return false;
        }
      }

      // 2. Category match
      if (selectedCategory !== 'Tất cả ngành nghề' && job.category !== selectedCategory) {
        return false;
      }

      // 3. Multi-select province match
      if (!matchLocation(job)) {
        return false;
      }

      // 4. Work type match
      if (selectedWorkType !== 'Tất cả hình thức' && job.workType !== selectedWorkType) {
        return false;
      }

      // 5. Salary filter match
      if (!matchSalary(job)) {
        return false;
      }

      // 6. Student friendly filter
      if (studentFriendlyOnly && !job.isStudentFriendly) {
        return false;
      }

      return true;
    });

    // Sort:
    // 1. VIP recruiter priority jobs (⭐ VIP Hot) boosted to the top
    // 2. Two-way matched jobs prioritized
    return [...list].sort((a, b) => {
      // 1. VIP recruiter priority
      if (a.isVipPriority && !b.isVipPriority) return -1;
      if (!a.isVipPriority && b.isVipPriority) return 1;

      // 2. Two-way matching priority
      if (enableTwoWayMatch) {
        const evalA = evaluateTwoWayMatch(a);
        const evalB = evaluateTwoWayMatch(b);
        if (evalA.score !== evalB.score) {
          return evalB.score - evalA.score; // Higher match score first
        }
      }
      return 0;
    });
  }, [
    jobs,
    keyword,
    selectedCategory,
    selectedProvinces,
    selectedWorkType,
    selectedSalaryTier,
    customSalaryInput,
    studentFriendlyOnly,
    enableTwoWayMatch,
    prefProvince,
    prefSalaryTier,
    prefWorkType
  ]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('Tất cả ngành nghề');
    setSelectedProvinces([]);
    setSelectedWorkType('Tất cả hình thức');
    setSelectedSalaryTier('all');
    setCustomSalaryInput('');
    setStudentFriendlyOnly(false);
    if (onClearExternalFilter) onClearExternalFilter();
  };

  const hasActiveFilters =
    keyword !== '' ||
    selectedCategory !== 'Tất cả ngành nghề' ||
    selectedProvinces.length > 0 ||
    selectedWorkType !== 'Tất cả hình thức' ||
    selectedSalaryTier !== 'all' ||
    customSalaryInput !== '' ||
    studentFriendlyOnly;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Greeting */}
      <div className="bg-gradient-to-r from-[#23412E] to-[#3B5B49] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#E6EFEA] text-xs font-semibold backdrop-blur-xs mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-[#A5C7B2]" />
            Nền tảng việc làm tin cậy cho sinh viên & người tìm việc
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Tìm đúng cơ hội, phát triển sự nghiệp tương lai
          </h1>
          <p className="text-xs sm:text-sm text-[#D1DFD6] mt-2 leading-relaxed">
            Hệ thống lọc đa tỉnh/thành phố, mức lương thực tế và kết nối hai chiều giúp bạn nhanh chóng chạm đến công việc mơ ước.
          </p>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-[#A5C7B2] font-semibold">Tìm nhanh:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setKeyword(tag)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CANDIDATE ACCOUNT STATUS & VIP UPGRADE BANNER */}
      {isFreeCandidate ? (
        <div className="p-3.5 rounded-2xl bg-[#FFF9ED] border border-[#FFE1A8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#8A5A00]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>
              <strong>Tài khoản thường:</strong> Đã dùng{' '}
              <strong className="text-[#1C2B22]">{appliedJobIds.size}/3</strong> lượt nộp hồ sơ hôm nay • Đã lưu{' '}
              <strong className="text-[#1C2B22]">{savedJobIds.size}/5</strong> việc làm
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRequestVipModal?.('Ứng tuyển & Lưu trữ việc làm không giới hạn')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-[11px] shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>💎 Nâng cấp VIP không giới hạn</span>
          </button>
        </div>
      ) : isVipCandidate ? (
        <div className="p-3.5 rounded-2xl bg-[#EAF2ED] border border-[#CADBCF] flex items-center justify-between text-xs text-[#1C3624]">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-sm">💎</span>
            <span>
              <strong>Thành viên VIP:</strong> Bạn đang có quyền <strong>Ứng tuyển không giới hạn</strong>, lưu trữ tối đa và mở khóa đầy đủ bộ lọc nâng cao!
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-300/60 px-2 py-0.5 rounded-md border border-amber-400/40 shrink-0">
            VIP Active
          </span>
        </div>
      ) : null}

      {/* TWO-WAY MATCHING CARD (Kết nối nhu cầu hai chiều) */}
      <div className="bg-gradient-to-r from-[#FAF7F2] via-white to-[#F2EFE9] rounded-3xl border-2 border-[#2E5339]/30 p-5 sm:p-6 shadow-sm relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5DEC0]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#23412E] text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#2E5339] bg-[#EAF2ED] px-2 py-0.5 rounded-md">
                  Tính năng thông minh
                </span>
                <span className="text-xs font-bold text-[#1C2B22]">Kết nối nhu cầu hai chiều</span>
              </div>
              <p className="text-xs text-[#526558] mt-0.5">
                Tự động ưu tiên đẩy lên đầu danh sách những công việc khớp chính xác nguyện vọng của bạn.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-[#23412E] cursor-pointer">
              <input
                type="checkbox"
                checked={enableTwoWayMatch}
                onChange={(e) => setEnableTwoWayMatch(e.target.checked)}
                className="w-4 h-4 rounded text-[#2E5339] focus:ring-[#2E5339]"
              />
              <span>Bật ưu tiên kết nối</span>
            </label>
          </div>
        </div>

        {/* Two-way matching selector controls */}
        {enableTwoWayMatch && (
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Preferred Location */}
            <div className="bg-white rounded-2xl p-3 border border-[#DCD3C5] shadow-xs">
              <label className="block text-[11px] font-bold text-[#55695C] mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2E5339]" />
                Tỉnh/Thành mong muốn
              </label>
              <select
                value={prefProvince}
                onChange={(e) => setPrefProvince(e.target.value)}
                className="w-full text-xs font-bold text-[#1C2B22] bg-[#FAF7F2] p-2 rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-1 focus:ring-[#2E5339]"
              >
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Salary */}
            <div className="bg-white rounded-2xl p-3 border border-[#DCD3C5] shadow-xs">
              <label className="block text-[11px] font-bold text-[#55695C] mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#2E5339]" />
                Mức lương mong muốn
              </label>
              <select
                value={prefSalaryTier}
                onChange={(e) => setPrefSalaryTier(e.target.value)}
                className="w-full text-xs font-bold text-[#1C2B22] bg-[#FAF7F2] p-2 rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-1 focus:ring-[#2E5339]"
              >
                {SALARY_TIERS.filter((s) => s.value !== 'all' && s.value !== 'custom').map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Work Type */}
            <div className="bg-white rounded-2xl p-3 border border-[#DCD3C5] shadow-xs">
              <label className="block text-[11px] font-bold text-[#55695C] mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#2E5339]" />
                Hình thức làm việc
              </label>
              <select
                value={prefWorkType}
                onChange={(e) => setPrefWorkType(e.target.value)}
                className="w-full text-xs font-bold text-[#1C2B22] bg-[#FAF7F2] p-2 rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-1 focus:ring-[#2E5339]"
              >
                {WORK_TYPES.filter((w) => w !== 'Tất cả hình thức').map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Live Matching Summary Bar */}
        {enableTwoWayMatch && (
          <div className="mt-3.5 px-3.5 py-2 rounded-xl bg-[#EAF2ED] text-[#1B3A25] text-xs font-semibold flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2E5339]" />
              Đang ưu tiên: <strong>📍 {prefProvince}</strong> · <strong>💰 {SALARY_TIERS.find((s) => s.value === prefSalaryTier)?.label}</strong> · <strong>💼 {prefWorkType}</strong>
            </span>
            <span className="text-[11px] text-[#2E5339] font-bold bg-white px-2.5 py-0.5 rounded-full border border-[#BED7C6]">
              {filteredAndRankedJobs.filter((j) => evaluateTwoWayMatch(j).isFullMatch).length} việc khớp 100%
            </span>
          </div>
        )}
      </div>

      {/* SEARCH AND MAIN FILTERS BAR */}
      <div className="bg-white rounded-3xl border border-[#E0D8CC] p-5 sm:p-6 shadow-xs space-y-4">
        {/* Row 1: Keyword + Category + Work Type + Filter Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#798C80] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Chức danh, công ty, kỹ năng (ReactJS, Shopee, Amata...)"
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white placeholder-[#889B8F]"
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#798C80] hover:text-[#1C2B22]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white text-[#1C2B22] font-medium"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Work Type Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white text-[#1C2B22] font-medium"
            >
              {WORK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Advanced Filter Toggle & Reset Button */}
          <div className="md:col-span-2 flex items-center gap-2">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                showAdvancedFilters || selectedProvinces.length > 0 || selectedSalaryTier !== 'all'
                  ? 'bg-[#23412E] text-white border-[#23412E]'
                  : 'bg-[#FAF7F2] text-[#4A5D50] border-[#D5CDC2] hover:bg-[#F0EAE0]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Bộ lọc</span>
              {(selectedProvinces.length > 0 || selectedSalaryTier !== 'all' || customSalaryInput) && (
                <span className="w-4 h-4 rounded-full bg-emerald-400 text-[#1C2B22] text-[10px] font-black flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="p-2.5 rounded-xl border border-[#D5CDC2] text-[#697B70] hover:text-[#1C2B22] hover:bg-[#FAF7F2] transition-colors"
                title="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* MULTI-SELECT PROVINCES / CITIES (Yêu cầu số 2) */}
        <div className="pt-3 border-t border-[#EAE3D6] space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#2E5339]" />
              <span className="text-xs font-extrabold text-[#1C2B22]">
                Địa điểm làm việc (Cho phép chọn nhiều tỉnh/thành phố):
              </span>
              {selectedProvinces.length > 0 && (
                <span className="text-[11px] font-bold text-[#23412E] bg-[#EAF2ED] px-2 py-0.5 rounded-full">
                  Đã chọn {selectedProvinces.length} khu vực
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleSelectAllProvinces}
                className="text-[11px] font-bold text-[#2E5339] hover:underline"
              >
                Chọn tất cả
              </button>
              <span className="text-[#C4BCB0]">•</span>
              <button
                onClick={handleClearProvinces}
                className="text-[11px] font-medium text-[#798C80] hover:underline"
              >
                Xóa chọn
              </button>
            </div>
          </div>

          {/* Province Multi-select Pills */}
          <div className="flex flex-wrap gap-2">
            {PROVINCES.map((prov) => {
              const isSelected = selectedProvinces.includes(prov);
              return (
                <button
                  key={prov}
                  type="button"
                  onClick={() => toggleProvince(prov)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#23412E] text-white shadow-xs border border-[#23412E]'
                      : 'bg-[#FAF7F2] text-[#4A5D50] border border-[#DDD5C7] hover:border-[#2E5339] hover:bg-white'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#A5C7B2]' : 'text-[#7D9183]'}`} />
                  <span>{prov}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* SALARY TIERS & CUSTOM SALARY INPUT (Yêu cầu số 1) */}
        <div className="pt-3 border-t border-[#EAE3D6] space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#2E5339]" />
              <span className="text-xs font-extrabold text-[#1C2B22]">
                Mức lương mong muốn:
              </span>
            </div>
            {selectedSalaryTier !== 'all' && (
              <button
                onClick={() => {
                  setSelectedSalaryTier('all');
                  setCustomSalaryInput('');
                }}
                className="text-[11px] font-semibold text-[#798C80] hover:underline"
              >
                Đặt lại lương
              </button>
            )}
          </div>

          {/* Salary Tier Buttons */}
          <div className="flex flex-wrap gap-2">
            {SALARY_TIERS.map((tier) => {
              const isSelected = selectedSalaryTier === tier.value;
              const isLockedCustom = tier.value === 'custom' && isFreeCandidate;
              return (
                <button
                  key={tier.value}
                  type="button"
                  onClick={() => handleSelectSalaryTier(tier.value as SalaryTier)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#2E5339] text-white shadow-xs border border-[#2E5339]'
                      : 'bg-[#FAF7F2] text-[#4A5D50] border border-[#DDD5C7] hover:border-[#2E5339] hover:bg-white'
                  }`}
                >
                  <span>{tier.label}</span>
                  {isLockedCustom && (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1 rounded font-black flex items-center gap-0.5">
                      🔒 VIP
                    </span>
                  )}
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-300 stroke-[3]" />}
                </button>
              );
            })}
          </div>

          {/* Custom Salary Input Box */}
          {selectedSalaryTier === 'custom' && (
            <div className="mt-2 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#D5CDC2] flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in duration-200">
              <label className="text-xs font-bold text-[#1C2B22] whitespace-nowrap">
                Nhập mức lương mong muốn (triệu VNĐ):
              </label>
              <div className="relative max-w-xs flex-1">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="100"
                  value={customSalaryInput}
                  onChange={(e) => setCustomSalaryInput(e.target.value)}
                  placeholder="Ví dụ: 10 (tương đương 10 triệu)"
                  className="w-full px-3 py-2 pr-20 text-xs font-bold rounded-xl border border-[#C5BCAD] focus:outline-none focus:ring-2 focus:ring-[#2E5339] bg-white"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6B7E72] font-semibold">
                  triệu đ/tháng
                </span>
              </div>
              <span className="text-[11px] text-[#697B70]">
                {customSalaryInput
                  ? `Đang lọc các việc làm chi trả quanh mức ${customSalaryInput} triệu VNĐ`
                  : 'Vui lòng nhập số tiền mong muốn'}
              </span>
            </div>
          )}
        </div>

        {/* Student friendly checkbox */}
        <div className="pt-2 flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-[#23412E]">
            <input
              type="checkbox"
              checked={studentFriendlyOnly}
              onChange={(e) => setStudentFriendlyOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#2E5339] focus:ring-[#2E5339]"
            />
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#2E5339]" />
              Chỉ hiện công việc thân thiện với sinh viên (Linh hoạt giờ, hỗ trợ dấu thực tập)
            </span>
          </label>
        </div>
      </div>

      {/* RESULTS HEADER & COUNTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#1C2B22]">
            Việc làm tuyển dụng phù hợp
          </h2>
          <p className="text-xs text-[#63766A]">
            Tìm thấy{' '}
            <strong className="text-[#2E5339] font-extrabold">{filteredAndRankedJobs.length}</strong> việc
            làm theo tiêu chí bạn đã chọn
            {enableTwoWayMatch && (
              <span className="ml-1 text-emerald-800 font-semibold">
                (đã ưu tiên đẩy việc khớp hồ sơ lên trước)
              </span>
            )}
          </p>
        </div>

        <button
          onClick={onNavigateToPostJob}
          className="text-xs font-bold text-[#2E5339] hover:text-[#1F3C28] flex items-center gap-1 underline underline-offset-4 self-start sm:self-auto"
        >
          Bạn là nhà tuyển dụng? Đăng tin ngay →
        </button>
      </div>

      {/* JOBS GRID */}
      {filteredAndRankedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAndRankedJobs.map((job) => {
            const matchEval = evaluateTwoWayMatch(job);
            return (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.has(job.id)}
                hasApplied={appliedJobIds.has(job.id)}
                onToggleSave={handleToggleSaveWrapped}
                onViewDetails={onViewDetails}
                onApply={handleApplyWrapped}
                isPreferredMatch={enableTwoWayMatch && matchEval.isFullMatch}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E0D8CC] p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E5DEC0] flex items-center justify-center mx-auto text-[#798C80]">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1D2C22]">
              Không tìm thấy việc làm phù hợp
            </h3>
            <p className="text-xs text-[#5D6F63] mt-1">
              Thử điều chỉnh dải lương mong muốn, mở rộng địa điểm tỉnh/thành hoặc đặt lại bộ lọc.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#2E5339] text-white hover:bg-[#23412E] transition-all"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      )}

      {/* GÓC NGHỀ NGHIỆP 💡 */}
      <CareerCorner
        className="mt-8"
        onNavigateToTab={onNavigateToTab}
      />
    </div>
  );
};
