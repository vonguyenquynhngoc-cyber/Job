import React, { useState, useMemo } from 'react';
import {
  Building2,
  PlusCircle,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  CheckCircle2,
  Users,
  Video,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Trophy,
  Sparkles,
  Award,
  ArrowUpDown,
  RotateCcw,
  Check,
  Eye,
  UserCheck,
  Crown,
  Lock,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { Job, WorkType, Application, ApplicationStatus, CandidateProfile, UserAccount, UserRole } from '../types';
import { CATEGORIES, PROVINCES, LOCATIONS, WORK_TYPES, SALARY_TIERS } from '../data/initialJobs';
import { TALENT_POOL, TalentCandidate } from '../data/talentPool';
import {
  evaluateCandidate,
  sortCandidatesByMerit,
  RECRUITER_INDUSTRIES,
  RECRUITER_DEGREE_FILTERS,
  RECRUITER_EXP_FILTERS,
  matchDegreeFilter,
  matchExperienceFilter,
  CandidateScoreResult
} from '../utils/candidateRanking';
import { CandidateDetailModal } from './CandidateDetailModal';

interface PostJobViewProps {
  jobs: Job[];
  applications: Application[];
  currentUserProfile?: CandidateProfile;
  userAccount?: UserAccount;
  onAddNewJob: (newJob: Job) => void;
  onUpdateApplicationStatus: (
    appId: string,
    newStatus: ApplicationStatus,
    interviewDetails?: any,
    feedbackNote?: string
  ) => void;
  onRequestVipModal?: (featureName: string) => void;
  onOpenOtpModal?: () => void;
}

// Unified candidate item representation for recruiter filtering
export interface RecruiterCandidateItem {
  id: string;
  sourceType: 'applicant' | 'talent' | 'user';
  candidateName: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  industry?: string;
  highestDegree?: string;
  experienceYears?: string;
  featuredHighlight?: string;
  jobAppliedTitle?: string;
  appliedDate?: string;
  applicationId?: string;
  applicationStatus?: ApplicationStatus;
  coverLetter?: string;
  profile: CandidateProfile;
}

export const PostJobView: React.FC<PostJobViewProps> = ({
  jobs,
  applications,
  currentUserProfile,
  userAccount,
  onAddNewJob,
  onUpdateApplicationStatus,
  onRequestVipModal,
  onOpenOtpModal
}) => {
  const [activeTab, setActiveTab] = useState<'candidates' | 'create' | 'my_jobs'>('candidates');

  // Candidate Filter & Sort States
  const [selectedIndustry, setSelectedIndustry] = useState<string>('Tất cả lĩnh vực');
  const [selectedDegree, setSelectedDegree] = useState<string>('Tất cả bằng cấp');
  const [selectedExperience, setSelectedExperience] = useState<string>('Tất cả kinh nghiệm');
  const [selectedProvince, setSelectedProvince] = useState<string>('Tất cả tỉnh/thành');
  const [selectedSalary, setSelectedSalary] = useState<string>('Tất cả mức lương');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'applicants' | 'talents'>('all');
  const [sortOption, setSortOption] = useState<'merit' | 'exp_first' | 'degree_first'>('merit');

  // Modal inspection states
  const [inspectingCandidate, setInspectingCandidate] = useState<RecruiterCandidateItem | null>(null);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  const [interviewDate, setInterviewDate] = useState('22/09/2026');
  const [interviewTime, setInterviewTime] = useState('10:00 AM');
  const [interviewFormat, setInterviewFormat] = useState<'Online (Google Meet/Zoom)' | 'Trực tiếp tại văn phòng'>('Online (Google Meet/Zoom)');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/xyz-job-interview');
  const [interviewNote, setInterviewNote] = useState('Vui lòng chuẩn bị CV và tinh thần thoải mái để trao đổi.');
  const [interviewScheduledSuccess, setInterviewScheduledSuccess] = useState(false);

  // New Job Form State
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterRole, setRecruiterRole] = useState('Trưởng phòng Tuyển dụng');
  const [recruiterAvatar, setRecruiterAvatar] = useState('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('Công nghệ thông tin');
  const [location, setLocation] = useState('Hà Nội');
  const [address, setAddress] = useState('');
  const [workType, setWorkType] = useState<WorkType>('Thực tập');
  const [salaryRange, setSalaryRange] = useState('4.000.000 - 7.000.000 đ');
  const [salaryTier, setSalaryTier] = useState<'under_5m' | '5m_10m' | '10m_15m' | '15m_25m' | 'above_25m' | 'negotiable'>('under_5m');
  const [experienceLevel, setExperienceLevel] = useState('Không yêu cầu kinh nghiệm');
  const [deadline, setDeadline] = useState('15/11/2026');
  const [contactEmail, setContactEmail] = useState('');
  const [isStudentFriendly, setIsStudentFriendly] = useState(true);
  const [tagsInput, setTagsInput] = useState('Hỗ trợ dấu thực tập, Đào tạo 1-1, Linh hoạt giờ học');
  const [description, setDescription] = useState('');
  const [requirementsInput, setRequirementsInput] = useState(
    'Sinh viên năm 3, 4 hoặc mới tốt nghiệp\nChủ động học hỏi và có tinh thần trách nhiệm\nCam kết làm việc tối thiểu 3-4 buổi/tuần'
  );
  const [benefitsInput, setBenefitsInput] = useState(
    'Phụ cấp thực tập hàng tháng\nĐược đóng dấu mộc xác nhận thực tập chính quy\nCơ hội ký hợp đồng chính thức sau kỳ thực tập'
  );
  const [postSuccess, setPostSuccess] = useState(false);

  // Compile full candidates list across:
  // 1. Applications submitted to this company
  // 2. Verified talent pool
  // 3. User's self-entered profile (if filled)
  const allCandidates: RecruiterCandidateItem[] = useMemo(() => {
    const list: RecruiterCandidateItem[] = [];

    // 1. Add applications
    applications.forEach((app) => {
      list.push({
        id: 'app-' + app.id,
        sourceType: 'applicant',
        candidateName: app.candidateName,
        avatarUrl: app.cvSnapshot?.avatarUrl,
        email: app.candidateEmail,
        phone: app.candidatePhone,
        location: app.cvSnapshot?.location || app.location || 'Chưa cập nhật',
        currentTitle: app.cvSnapshot?.currentTitle || 'Ứng viên nộp hồ sơ',
        industry: app.industry || app.cvSnapshot?.industry || 'Công nghệ thông tin',
        highestDegree: app.highestDegree || app.cvSnapshot?.highestDegree || app.cvSnapshot?.education?.[0]?.degree,
        experienceYears: app.experienceYears || app.cvSnapshot?.experienceYears,
        jobAppliedTitle: app.jobTitle,
        appliedDate: app.appliedDate,
        applicationId: app.id,
        applicationStatus: app.status,
        coverLetter: app.coverLetter,
        profile: app.cvSnapshot
      });
    });

    // 2. Add current active user profile if user has entered name
    if (currentUserProfile && currentUserProfile.fullName.trim().length > 0) {
      list.push({
        id: 'current-user-candidate',
        sourceType: 'user',
        candidateName: currentUserProfile.fullName,
        avatarUrl: currentUserProfile.avatarUrl,
        email: currentUserProfile.email || 'Liên hệ qua hệ thống',
        phone: currentUserProfile.phone || 'Chưa cập nhật',
        location: currentUserProfile.location || 'Hà Nội',
        currentTitle: currentUserProfile.currentTitle || 'Ứng viên tìm việc',
        industry: currentUserProfile.industry || 'Công nghệ thông tin',
        highestDegree: currentUserProfile.highestDegree || currentUserProfile.education?.[0]?.degree,
        experienceYears: currentUserProfile.experienceYears,
        featuredHighlight: currentUserProfile.bio || 'Hồ sơ ứng viên đang cập nhật trên hệ thống',
        profile: currentUserProfile
      });
    }

    // 3. Add talent pool candidates
    TALENT_POOL.forEach((talent) => {
      list.push({
        id: talent.id,
        sourceType: 'talent',
        candidateName: talent.fullName,
        avatarUrl: talent.avatarUrl,
        email: talent.email,
        phone: talent.phone,
        location: talent.location,
        currentTitle: talent.currentTitle,
        industry: talent.industry,
        highestDegree: talent.highestDegree,
        experienceYears: talent.experienceYears,
        featuredHighlight: talent.featuredHighlight,
        profile: talent
      });
    });

    return list;
  }, [applications, currentUserProfile]);

  // Filter candidates according to recruiter criteria
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter((cand) => {
      // Source filter
      if (sourceFilter === 'applicants' && cand.sourceType !== 'applicant') return false;
      if (sourceFilter === 'talents' && cand.sourceType !== 'talent' && cand.sourceType !== 'user') return false;

      // Industry / Lĩnh vực filter
      if (selectedIndustry !== 'Tất cả lĩnh vực') {
        const candIndustry = cand.industry || cand.profile.industry || '';
        const lowerCandInd = candIndustry.toLowerCase();
        const lowerFilter = selectedIndustry.toLowerCase();
        if (!lowerCandInd.includes(lowerFilter) && !lowerFilter.includes(lowerCandInd)) {
          // Check if candidate desired job or skills match
          const hasJobMatch = (cand.currentTitle || '').toLowerCase().includes(lowerFilter);
          const hasSkillMatch = (cand.profile.skills || []).some((s) => lowerFilter.includes(s.name.toLowerCase()));
          if (!hasJobMatch && !hasSkillMatch) return false;
        }
      }

      // Pre-evaluate candidate for degree and experience checks
      const evaluation = evaluateCandidate({
        highestDegree: cand.highestDegree || cand.profile.highestDegree,
        experienceYears: cand.experienceYears || cand.profile.experienceYears,
        education: cand.profile.education,
        experience: cand.profile.experience
      });

      // Degree / Bằng cấp filter
      if (!matchDegreeFilter(evaluation.degreeScore, selectedDegree)) {
        return false;
      }

      // Experience / Kinh nghiệm nổi bật filter
      if (!matchExperienceFilter(evaluation.experienceScore, selectedExperience)) {
        return false;
      }

      // Province / Tỉnh thành filter
      if (selectedProvince !== 'Tất cả tỉnh/thành') {
        const loc = (cand.location || cand.profile.location || '').toLowerCase();
        const desiredLocs = (cand.profile.desiredLocations || []).map((l) => l.toLowerCase());
        const filterProv = selectedProvince.toLowerCase();
        const matchLoc = loc.includes(filterProv) || desiredLocs.some((dl) => dl.includes(filterProv));
        if (!matchLoc) return false;
      }

      // Salary / Mức lương mong muốn filter
      if (selectedSalary !== 'Tất cả mức lương') {
        const candSal = (cand.profile.desiredSalary || '').toLowerCase();
        if (selectedSalary === 'Dưới 5 triệu VNĐ' && !candSal.includes('dưới 5') && !candSal.includes('4') && !candSal.includes('3') && !candSal.includes('phụ cấp')) return false;
        if (selectedSalary === '5 – 8 triệu VNĐ' && !candSal.includes('5') && !candSal.includes('6') && !candSal.includes('7') && !candSal.includes('8')) return false;
        if (selectedSalary === '8 – 12 triệu VNĐ' && !candSal.includes('8') && !candSal.includes('9') && !candSal.includes('10') && !candSal.includes('11') && !candSal.includes('12')) return false;
        if (selectedSalary === '12 – 15 triệu VNĐ' && !candSal.includes('12') && !candSal.includes('13') && !candSal.includes('14') && !candSal.includes('15')) return false;
        if (selectedSalary === 'Trên 15 triệu VNĐ' && !candSal.includes('15') && !candSal.includes('20') && !candSal.includes('25') && !candSal.includes('30') && !candSal.includes('trên 15')) return false;
      }

      // Search keyword filter
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const inName = cand.candidateName.toLowerCase().includes(kw);
        const inTitle = cand.currentTitle.toLowerCase().includes(kw);
        const inSchool = (cand.profile.education || []).some(
          (e) => e.school.toLowerCase().includes(kw) || e.major.toLowerCase().includes(kw)
        );
        const inSkills = (cand.profile.skills || []).some((s) => s.name.toLowerCase().includes(kw));
        const inHighlight = (cand.featuredHighlight || '').toLowerCase().includes(kw);
        if (!inName && !inTitle && !inSchool && !inSkills && !inHighlight) {
          return false;
        }
      }

      return true;
    });
  }, [allCandidates, sourceFilter, selectedIndustry, selectedDegree, selectedExperience, selectedProvince, selectedSalary, searchKeyword]);

  // Sort candidates:
  // "kinh nghiệm và bằng cấp của người nào cao sẽ được đẩy lên phía trên sau đó sắp xếp theo thứ tự"
  const rankedCandidates = useMemo(() => {
    return sortCandidatesByMerit(filteredCandidates, sortOption);
  }, [filteredCandidates, sortOption]);

  const handleResetFilters = () => {
    setSelectedIndustry('Tất cả lĩnh vực');
    setSelectedDegree('Tất cả bằng cấp');
    setSelectedExperience('Tất cả kinh nghiệm');
    setSelectedProvince('Tất cả tỉnh/thành');
    setSelectedSalary('Tất cả mức lương');
    setSearchKeyword('');
    setSourceFilter('all');
    setSortOption('merit');
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !contactEmail.trim()) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (Tiêu đề, Công ty, Email).');
      return;
    }

    const myPostedJobs = jobs.filter((j) => j.isRecruiterCustom);
    const isVipRecruiter = userAccount?.plan === 'vip';

    if (!isVipRecruiter && myPostedJobs.length >= 2) {
      if (onRequestVipModal) {
        onRequestVipModal('Đăng tin tuyển dụng không giới hạn (Tài khoản thường tối đa 2 tin tuyển dụng)');
      }
      return;
    }

    const newJob: Job = {
      id: 'job-' + Date.now(),
      title: title.trim(),
      company: company.trim(),
      recruiterName: recruiterName.trim() || undefined,
      recruiterRole: recruiterRole.trim() || undefined,
      recruiterAvatar: recruiterAvatar.trim() || undefined,
      companyLogoColor: '#284B35',
      category,
      location,
      province: location,
      address: address.trim() || `${location}, Việt Nam`,
      workType,
      salaryRange,
      salaryTier: salaryTier as any,
      experienceLevel,
      deadline,
      contactEmail: contactEmail.trim(),
      isStudentFriendly,
      postedDate: 'Vừa đăng',
      isRecruiterCustom: true,
      isVipPriority: isVipRecruiter,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      description:
        description.trim() ||
        `Công ty ${company} chào đón các bạn ứng viên nhiệt huyết ứng tuyển vị trí ${title}. Chúng tôi cam kết tạo điều kiện học tập và phát triển nghề nghiệp tốt nhất.`,
      requirements: requirementsInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      benefits: benefitsInput
        .split('\n')
        .map((b) => b.trim())
        .filter(Boolean)
    };

    onAddNewJob(newJob);
    setPostSuccess(true);
    setTitle('');
    setDescription('');
    setTimeout(() => setPostSuccess(false), 4000);
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    onUpdateApplicationStatus(
      selectedAppForInterview.id,
      'interview',
      {
        date: interviewDate,
        time: interviewTime,
        locationOrLink: interviewLink,
        format: interviewFormat,
        note: interviewNote
      },
      `Đã lên lịch phỏng vấn vào ${interviewTime} ngày ${interviewDate}.`
    );

    setInterviewScheduledSuccess(true);
    setTimeout(() => {
      setInterviewScheduledSuccess(false);
      setSelectedAppForInterview(null);
    }, 1500);
  };

  const myPostedJobs = jobs.filter((j) => j.isRecruiterCustom);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Header */}
      <div className="bg-[#23412E] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#EBF2EC]">
              <Building2 className="w-3.5 h-3.5 text-[#A5C7B2]" />
              Cổng Doanh Nghiệp & Nhà Tuyển Dụng
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Quản Trị Tuyển Dụng & Tuyển Chọn Ứng Viên
            </h1>
            <p className="text-xs sm:text-sm text-[#D1DFD5] max-w-2xl leading-relaxed">
              Lọc danh sách ứng viên thông minh theo lĩnh vực mong muốn, bằng cấp đào tạo và kinh nghiệm nổi bật. Hệ thống tự động đẩy ứng viên có năng lực cao nhất lên hàng đầu.
            </p>
          </div>

          {/* Recruiter Stats Snapshot */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <div className="text-center px-3 border-r border-white/15">
              <span className="block text-2xl font-black text-white">{applications.length}</span>
              <span className="text-[10px] text-[#C2D8CA] uppercase font-bold">Hồ sơ nộp</span>
            </div>
            <div className="text-center px-3 border-r border-white/15">
              <span className="block text-2xl font-black text-white">{allCandidates.length}</span>
              <span className="text-[10px] text-[#C2D8CA] uppercase font-bold">Nhân tài</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-2xl font-black text-white">{myPostedJobs.length}</span>
              <span className="text-[10px] text-[#C2D8CA] uppercase font-bold">Tin đã đăng</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'candidates'
                ? 'bg-white text-[#23412E] shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Lọc & Tuyển chọn Ứng viên ({rankedCandidates.length})
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'create'
                ? 'bg-white text-[#23412E] shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Đăng tin tuyển dụng mới
          </button>

          <button
            onClick={() => setActiveTab('my_jobs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my_jobs'
                ? 'bg-white text-[#23412E] shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Tin tuyển dụng của bạn ({myPostedJobs.length})
          </button>
        </div>
      </div>

      {/* TAB 1: LỌC & TUYỂN CHỌN ỨNG VIÊN (MAIN USER REQUIREMENT) */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          {/* Recruiter Role & OTP Verification Gate */}
          {userAccount && userAccount.role !== 'recruiter' ? (
            <div className="bg-white rounded-3xl border border-[#E0D8CC] p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1C2B22]">
                  ⛔ Quyền riêng tư & Bảo mật hồ sơ ứng viên
                </h3>
                <p className="text-xs text-[#5C6E62] leading-relaxed mt-1">
                  Chỉ Nhà tuyển dụng đã xác minh mới được xem thông tin và CV của ứng viên. Vai trò ứng viên không có quyền truy cập khu vực này.
                </p>
              </div>
            </div>
          ) : userAccount && !userAccount.isVerified ? (
            /* Unverified Recruiter Gate: Tài khoản chưa xác minh không được xem hồ sơ ứng viên */
            <div className="bg-white rounded-3xl border border-[#E0D8CC] p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Chưa xác minh email công ty
                </span>
                <h3 className="text-lg font-black text-[#1C2B22] mt-2">
                  🔒 Tài khoản chưa xác minh không được xem hồ sơ ứng viên
                </h3>
                <p className="text-xs text-[#5C6E62] leading-relaxed mt-1.5">
                  Bắt buộc cung cấp email công ty và xác minh bằng mã OTP gửi qua email. Vui lòng hoàn tất xác thực OTP để mở khóa quyền xem thông tin và CV ứng viên.
                </p>
              </div>
              {onOpenOtpModal && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenOtpModal}
                    className="px-6 py-3 rounded-2xl font-bold text-xs bg-[#23412E] hover:bg-[#1A3324] text-white shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Xác minh ngay bằng mã OTP</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Verified Recruiter Banner & VIP Status */}
              <div className="p-3.5 rounded-2xl bg-[#EAF2ED] border border-[#CADBCF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#1C3624]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2E5339] shrink-0" />
                  <span>
                    ✓ Nhà tuyển dụng đã xác minh: <strong>{userAccount?.companyEmail || userAccount?.email}</strong> — Đã xác thực OTP qua email công ty.
                  </span>
                </div>
                {userAccount?.plan === 'vip' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-black shadow-xs shrink-0 self-start sm:self-auto">
                    <Crown className="w-3.5 h-3.5 fill-amber-900" />
                    Doanh nghiệp VIP (Mở khóa SĐT & Email ứng viên)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRequestVipModal?.('Mở khóa số điện thoại & email đầy đủ của ứng viên')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 text-[11px] font-black shadow-xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <Crown className="w-3.5 h-3.5 fill-amber-900" />
                    Nâng cấp VIP mở khóa SĐT & Email
                  </button>
                )}
              </div>

              {/* CONTROL PANEL: FILTER BAR FOR RECRUITER */}
              <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EAE0]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#EAF1EC] text-[#23412E] flex items-center justify-center font-bold">
                      <Filter className="w-4 h-4 text-[#2E5339]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#1D2C22]">
                        Bộ lọc ứng viên theo lĩnh vực, bằng cấp, kinh nghiệm, địa điểm & mức lương
                      </h2>
                      <p className="text-[11px] text-[#65796D]">
                        Tuyển lọc ứng viên theo đúng tiêu chuẩn tỉnh thành và đãi ngộ của doanh nghiệp
                      </p>
                    </div>
                  </div>

                  {/* Reset filter button */}
                  {(selectedIndustry !== 'Tất cả lĩnh vực' ||
                    selectedDegree !== 'Tất cả bằng cấp' ||
                    selectedExperience !== 'Tất cả kinh nghiệm' ||
                    selectedProvince !== 'Tất cả tỉnh/thành' ||
                    selectedSalary !== 'Tất cả mức lương' ||
                    searchKeyword.trim() !== '' ||
                    sourceFilter !== 'all') && (
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#8A382A] bg-red-50 hover:bg-red-100 border border-red-200 transition-colors shrink-0 self-start sm:self-auto"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Đặt lại bộ lọc
                    </button>
                  )}
                </div>

                {/* Filter Inputs Grid - 5 Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {/* Filter 1: Lĩnh vực */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1D2C22] block mb-1 flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#2E5339]" />
                      1. Lĩnh vực mong muốn
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] font-medium text-[#1E2E23] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                    >
                      {RECRUITER_INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 2: Bằng cấp */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1D2C22] block mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#2E5339]" />
                      2. Bằng cấp / Học vấn
                    </label>
                    <select
                      value={selectedDegree}
                      onChange={(e) => setSelectedDegree(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] font-medium text-[#1E2E23] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                    >
                      {RECRUITER_DEGREE_FILTERS.map((deg) => (
                        <option key={deg} value={deg}>
                          {deg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 3: Kinh nghiệm */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1D2C22] block mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-[#2E5339]" />
                      3. Kinh nghiệm nổi bật
                    </label>
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] font-medium text-[#1E2E23] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                    >
                      {RECRUITER_EXP_FILTERS.map((exp) => (
                        <option key={exp} value={exp}>
                          {exp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 4: Tỉnh / Thành phố làm việc */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1D2C22] block mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2E5339]" />
                      4. Tỉnh / Thành mong muốn
                    </label>
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] font-bold text-[#1E2E23] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                    >
                      <option value="Tất cả tỉnh/thành">Tất cả tỉnh/thành</option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filter 5: Mức lương mong muốn */}
                  <div>
                    <label className="text-[11px] font-bold text-[#1D2C22] block mb-1 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#2E5339]" />
                      5. Mức lương kỳ vọng
                    </label>
                    <select
                      value={selectedSalary}
                      onChange={(e) => setSelectedSalary(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] font-bold text-[#1E2E23] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                    >
                      <option value="Tất cả mức lương">Tất cả mức lương</option>
                      <option value="Dưới 5 triệu VNĐ">Dưới 5 triệu VNĐ</option>
                      <option value="5 – 8 triệu VNĐ">5 – 8 triệu VNĐ</option>
                      <option value="8 – 12 triệu VNĐ">8 – 12 triệu VNĐ</option>
                      <option value="12 – 15 triệu VNĐ">12 – 15 triệu VNĐ</option>
                      <option value="Trên 15 triệu VNĐ">Trên 15 triệu VNĐ</option>
                    </select>
                  </div>
                </div>

            {/* Keyword Search & Source Filter Toolbar */}
            <div className="pt-3 border-t border-[#F0EAE0] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Keyword Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#7E9084] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm theo tên ứng viên, trường đại học (Bách Khoa, UEH...), kỹ năng (React, Figma, IELTS)..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              {/* Source Tabs */}
              <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#D5CDC0] shrink-0">
                <button
                  type="button"
                  onClick={() => setSourceFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    sourceFilter === 'all'
                      ? 'bg-white text-[#23412E] shadow-xs'
                      : 'text-[#63766A] hover:text-[#23412E]'
                  }`}
                >
                  Tất cả hồ sơ ({allCandidates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceFilter('applicants')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    sourceFilter === 'applicants'
                      ? 'bg-white text-[#23412E] shadow-xs'
                      : 'text-[#63766A] hover:text-[#23412E]'
                  }`}
                >
                  Đã nộp ứng tuyển ({applications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSourceFilter('talents')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    sourceFilter === 'talents'
                      ? 'bg-white text-[#23412E] shadow-xs'
                      : 'text-[#63766A] hover:text-[#23412E]'
                  }`}
                >
                  Kho nhân tài ({TALENT_POOL.length + (currentUserProfile?.fullName ? 1 : 0)})
                </button>
              </div>

              {/* Sorting Priority Option */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-[#576B5E] hidden lg:inline flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-[#2E5339]" />
                  Sắp xếp:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl border border-[#2E5339]/30 bg-[#EAF1EC] text-[#23412E] font-bold focus:outline-none"
                >
                  <option value="merit">⭐ Bằng cấp & Kinh nghiệm cao nhất (Đẩy lên trên)</option>
                  <option value="exp_first">💼 Ưu tiên kinh nghiệm nhiều nhất</option>
                  <option value="degree_first">🎓 Ưu tiên bằng cấp cao nhất</option>
                </select>
              </div>
            </div>

            {/* Smart Ranking Notification Banner */}
            <div className="p-3.5 rounded-2xl bg-[#EAF1EC] border border-[#CADBCF] flex items-start gap-2.5">
              <Trophy className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
              <div className="text-xs text-[#23412E] leading-relaxed">
                <strong>Nguyên tắc sắp xếp & xếp hạng thông minh:</strong> Hồ sơ có{' '}
                <span className="font-bold underline">Bằng cấp cao</span> (Tiến sĩ: 40đ, Thạc sĩ: 30đ, Cử nhân/Kỹ sư: 20đ) và{' '}
                <span className="font-bold underline">Kinh nghiệm nổi bật</span> (Trên 3 năm: 50đ, 2-3 năm: 35đ, 1-2 năm: 25đ) sẽ được hệ thống tính điểm và <strong>tự động đẩy lên vị trí cao nhất theo thứ tự từ trên xuống dưới</strong>.
              </div>
            </div>
          </div>

          {/* CANDIDATES LIST RANKED */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-[#1D2C22]">
                Kết quả: {rankedCandidates.length} ứng viên phù hợp với tiêu chí lọc
              </span>
              <span className="text-xs text-[#6F8275]">
                Đã sắp xếp theo thứ tự ưu tiên Bằng cấp & Kinh nghiệm cao nhất
              </span>
            </div>

            {rankedCandidates.length > 0 ? (
              <div className="space-y-4">
                {rankedCandidates.map(({ item: cand, evaluation, rank }) => {
                  const isTop1 = rank === 1;
                  const isTop3 = rank <= 3;

                  return (
                    <div
                      key={cand.id}
                      className={`bg-white rounded-3xl border transition-all hover:shadow-md p-5 sm:p-6 space-y-4 relative ${
                        isTop1
                          ? 'border-[#2E5339] ring-2 ring-[#2E5339]/20 shadow-xs'
                          : isTop3
                          ? 'border-[#D5CDC0] shadow-xs'
                          : 'border-[#E3DDD1]'
                      }`}
                    >
                      {/* Top Header with Rank and Score */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Rank Badge */}
                          <div
                            className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center shrink-0 font-black shadow-xs ${
                              isTop1
                                ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                                : rank === 2
                                ? 'bg-slate-200 text-slate-800'
                                : rank === 3
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-[#FAF7F2] text-[#55675B] border border-[#E0D8CC]'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold leading-none">Hạng</span>
                            <span className="text-base leading-none mt-0.5">#{rank}</span>
                          </div>

                          {/* Candidate Avatar */}
                          <div className="w-14 h-16 sm:w-16 sm:h-18 rounded-2xl bg-[#F0EAE0] border border-[#D5CDC0] overflow-hidden shrink-0 flex items-center justify-center">
                            {cand.avatarUrl ? (
                              <img
                                src={cand.avatarUrl}
                                alt={cand.candidateName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <UserCheck className="w-7 h-7 text-[#7A8C80]" />
                            )}
                          </div>

                          {/* Info Title */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base sm:text-lg font-black text-[#1A2E20]">
                                {cand.candidateName}
                              </h3>

                              {cand.sourceType === 'applicant' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                                  Đã nộp hồ sơ
                                </span>
                              )}

                              {cand.sourceType === 'user' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                                  Hồ sơ cá nhân của bạn
                                </span>
                              )}

                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${evaluation.tierColor}`}>
                                {evaluation.rankingTier}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-[#2E5339]">
                              {cand.currentTitle}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#6F8275] pt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-[#8EA295]" />
                                <span className={userAccount?.plan !== 'vip' ? 'font-mono text-amber-900 bg-amber-50 px-1 rounded' : ''}>
                                  {userAccount?.plan === 'vip'
                                    ? cand.email
                                    : cand.email.replace(/(.{2})(.*)(@.*)/, '$1••••$3')}
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-[#8EA295]" />
                                <span className={userAccount?.plan !== 'vip' ? 'font-mono text-amber-900 bg-amber-50 px-1 rounded' : ''}>
                                  {userAccount?.plan === 'vip'
                                    ? cand.phone
                                    : cand.phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 ••• •••')}
                                </span>
                              </span>
                              {userAccount?.plan !== 'vip' && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRequestVipModal?.('Mở khóa số điện thoại & email ứng viên đầy đủ');
                                  }}
                                  className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-lg transition-colors shadow-2xs"
                                >
                                  <Lock className="w-2.5 h-2.5" />
                                  [Nâng cấp VIP] mở khóa
                                </button>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#8EA295]" />
                                {cand.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Merit Score Card */}
                        <div className="bg-[#FAF8F5] border border-[#E0D8CC] rounded-2xl p-3 text-right sm:min-w-[190px] shrink-0">
                          <div className="flex items-center justify-between sm:justify-end gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold text-[#6D8073]">Điểm xếp hạng:</span>
                            <span className="text-base font-black text-[#23412E]">
                              {evaluation.totalScore}/100đ
                            </span>
                          </div>
                          <div className="space-y-0.5 text-[10px] text-[#55675B]">
                            <div>🎓 Bằng cấp: <strong>+{evaluation.degreeScore}đ</strong></div>
                            <div>💼 Kinh nghiệm: <strong>+{evaluation.experienceScore}đ</strong></div>
                            {evaluation.bonusScore > 0 && (
                              <div>✨ Điểm cộng GPA/Chứng chỉ: <strong>+{evaluation.bonusScore}đ</strong></div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Prominent Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0EAE0]">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#EAF1EC] text-[#23412E] border border-[#CADBCF] flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-[#2E5339]" />
                          Bằng cấp: <strong>{evaluation.degreeLabel}</strong>
                        </span>

                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-700" />
                          Kinh nghiệm: <strong>{evaluation.experienceLabel}</strong>
                        </span>

                        {cand.industry && (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-[#FAF7F2] text-[#485B4E] border border-[#E0D8CC]">
                            Lĩnh vực: {cand.industry}
                          </span>
                        )}

                        {cand.jobAppliedTitle && (
                          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200">
                            Vị trí nộp: {cand.jobAppliedTitle} (Ngày: {cand.appliedDate})
                          </span>
                        )}
                      </div>

                      {/* Featured Highlight or Bio Excerpt */}
                      {cand.featuredHighlight ? (
                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#23412E]">Thành tích nổi bật: </span>
                            <span className="text-[#3E5244] leading-relaxed">{cand.featuredHighlight}</span>
                          </div>
                        </div>
                      ) : cand.coverLetter ? (
                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs space-y-1">
                          <span className="font-bold text-[#23412E] block">Thư ứng tuyển của ứng viên:</span>
                          <p className="text-[#4E6154] leading-relaxed italic line-clamp-2">
                            "{cand.coverLetter}"
                          </p>
                        </div>
                      ) : null}

                      {/* Education & Experience Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Education item */}
                        <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5]">
                          <span className="text-[10px] uppercase font-bold text-[#6D8073] block mb-0.5">
                            Trường học & Chuyên ngành
                          </span>
                          {cand.profile.education?.[0] ? (
                            <div>
                              <strong className="text-[#1D2C22] block">
                                {cand.profile.education[0].school}
                              </strong>
                              <span className="text-[#4C5E52] text-[11px]">
                                {cand.profile.education[0].major} (Niên khóa: {cand.profile.education[0].startYear} - {cand.profile.education[0].endYear})
                              </span>
                              {cand.profile.education[0].gpa && (
                                <span className="block text-[10px] text-amber-800 font-bold">
                                  GPA: {cand.profile.education[0].gpa}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#7A8C80] italic">Chưa cập nhật chi tiết</span>
                          )}
                        </div>

                        {/* Recent experience item */}
                        <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5]">
                          <span className="text-[10px] uppercase font-bold text-[#6D8073] block mb-0.5">
                            Kinh nghiệm / Vị trí gần nhất
                          </span>
                          {cand.profile.experience?.[0] ? (
                            <div>
                              <strong className="text-[#1D2C22] block">
                                {cand.profile.experience[0].position}
                              </strong>
                              <span className="text-[#2E5339] text-[11px] font-semibold">
                                {cand.profile.experience[0].company}
                              </span>
                              <span className="block text-[10px] text-[#7A8C80]">
                                {cand.profile.experience[0].startDate} - {cand.profile.experience[0].endDate}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#7A8C80] italic">Sinh viên mới / Chưa có kinh nghiệm trước đây</span>
                          )}
                        </div>
                      </div>

                      {/* Skills tags */}
                      {cand.profile.skills && cand.profile.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] font-bold text-[#63766A]">Kỹ năng:</span>
                          {cand.profile.skills.slice(0, 5).map((sk) => (
                            <span
                              key={sk.id}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#D5CDC0] text-[#23412E]"
                            >
                              {sk.name}
                            </span>
                          ))}
                          {cand.profile.skills.length > 5 && (
                            <span className="text-[10px] text-[#7A8C80]">
                              +{cand.profile.skills.length - 5} kỹ năng khác
                            </span>
                          )}
                        </div>
                      )}

                      {/* Recruiter Action Bar */}
                      <div className="pt-3 border-t border-[#F0EAE0] flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setInspectingCandidate(cand)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-[#2E5339] text-[#23412E] bg-white hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#2E5339]" />
                            Xem hồ sơ CV chi tiết
                          </button>

                          {cand.profile.portfolioLinks?.[0] && (
                            <a
                              href={cand.profile.portfolioLinks[0].url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded-xl text-xs font-semibold text-[#485B4E] hover:text-[#23412E] flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Link dự án
                            </a>
                          )}
                        </div>

                        {/* Status update or invite button */}
                        <div className="flex items-center gap-2">
                          {cand.sourceType === 'applicant' && cand.applicationId ? (
                            <>
                              <button
                                onClick={() => {
                                  const originalApp = applications.find((a) => a.id === cand.applicationId);
                                  if (originalApp) setSelectedAppForInterview(originalApp);
                                }}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] transition-colors flex items-center gap-1.5 shadow-xs"
                              >
                                <Video className="w-3.5 h-3.5" />
                                {cand.applicationStatus === 'interview' ? 'Lịch PV đã xếp' : 'Mời phỏng vấn'}
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                alert(`Đã gửi thông báo kết nối và lời mời ứng tuyển tới ứng viên ${cand.candidateName} qua email ${cand.email}.`);
                              }}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Gửi lời mời ứng tuyển
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E0D8CC] p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-[#9FB3A5] mx-auto" />
                <h3 className="text-base font-bold text-[#1D2C22]">
                  Không tìm thấy ứng viên thỏa mãn tất cả tiêu chí
                </h3>
                <p className="text-xs text-[#6F8275] max-w-md mx-auto leading-relaxed">
                  Hãy thử mở rộng bộ lọc bằng cấp, kinh nghiệm hoặc chọn "Tất cả lĩnh vực" để hệ thống tìm kiếm nhiều ứng viên tiềm năng hơn.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Xóa bộ lọc & Hiển thị tất cả
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )}

      {/* TAB 2: ĐĂNG TIN TUYỂN DỤNG MỚI */}
      {activeTab === 'create' && (
        <form
          onSubmit={handlePostJob}
          className="bg-white rounded-3xl border border-[#E0D8CC] p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div className="border-b border-[#F0EAE0] pb-4">
            <h2 className="text-lg font-bold text-[#1D2C22] flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#2E5339]" />
              Tạo và đăng tin tuyển dụng việc làm mới
            </h2>
            <p className="text-xs text-[#63766A] mt-1">
              Tin đăng sẽ hiển thị trực tiếp trên trang chủ tìm việc dành cho sinh viên và người tìm việc.
            </p>
          </div>

          {postSuccess && (
            <div className="p-4 rounded-2xl bg-[#EAF1EC] border border-[#2E5339] text-xs text-[#23412E] flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#2E5339]" />
              Tin tuyển dụng đã được đăng thành công và sẵn sàng đón nhận hồ sơ ứng viên!
            </div>
          )}

          {/* Recruiter Identity Fields */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#D5CDC0] space-y-3">
            <h3 className="text-xs font-bold text-[#23412E] uppercase tracking-wider">
              Thông tin Người đại diện Doanh nghiệp
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Họ tên người đăng tuyển *
                </label>
                <input
                  type="text"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  placeholder="VD: Nguyễn Mai Trang"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Chức vụ tại doanh nghiệp
                </label>
                <input
                  type="text"
                  value={recruiterRole}
                  onChange={(e) => setRecruiterRole(e.target.value)}
                  placeholder="VD: Trưởng phòng Nhân sự (HRM)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Link ảnh chân dung đại diện
                </label>
                <input
                  type="url"
                  value={recruiterAvatar}
                  onChange={(e) => setRecruiterAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>
            </div>
          </div>

          {/* Job Details Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#1D2C22] block mb-1">
                Tiêu đề công việc tuyển dụng *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Thực tập sinh Frontend ReactJS, Chuyên viên Content..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1D2C22] block mb-1">
                Tên công ty / Doanh nghiệp tuyển dụng *
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="VD: Tập đoàn Công nghệ VinTech, Công ty TNHH Giải Pháp..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Ngành nghề / Lĩnh vực tuyển dụng
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              >
                {CATEGORIES.filter((c) => c !== 'Tất cả ngành nghề').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Hình thức làm việc
              </label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as WorkType)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              >
                {WORK_TYPES.filter((w) => w !== 'Tất cả hình thức').map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Tỉnh / Thành phố làm việc *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339] font-bold text-[#1C2B22]"
              >
                {PROVINCES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Địa chỉ chi tiết văn phòng
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: Số 123 Cầu Giấy, Phường Dịch Vọng..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Mức lương hiển thị
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="VD: 4 - 7 triệu, 10 - 15 triệu, Thỏa thuận..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Phân loại mức lương cho bộ lọc
              </label>
              <select
                value={salaryTier}
                onChange={(e) => setSalaryTier(e.target.value as any)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              >
                {SALARY_TIERS.filter((s) => s.value !== 'all').map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Yêu cầu kinh nghiệm
              </label>
              <input
                type="text"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                placeholder="Không yêu cầu kinh nghiệm, Dưới 1 năm..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Email nhận hồ sơ ứng tuyển *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="tuyendung@congty.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Hạn chót nộp hồ sơ
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            {/* Student friendly checkbox */}
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-[#EAF1EC] border border-[#CADBCF]">
              <label className="flex items-center gap-2 text-xs font-bold text-[#23412E] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStudentFriendly}
                  onChange={(e) => setIsStudentFriendly(e.target.checked)}
                  className="rounded text-[#2E5339] focus:ring-[#2E5339] w-4 h-4"
                />
                <GraduationCap className="w-4 h-4 text-[#2E5339]" />
                <span>Việc làm dành cho sinh viên (Hỗ trợ dấu mộc thực tập / Giờ giấc linh hoạt)</span>
              </label>
            </div>

            {/* Tags Input */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Từ khóa nổi bật (phân cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Hỗ trợ dấu thực tập, Đào tạo 1-1, Linh hoạt giờ học..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Mô tả công việc chi tiết
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Các nhiệm vụ, dự án và trách nhiệm của ứng viên..."
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            {/* Requirements */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Yêu cầu ứng viên (mỗi dòng một ý)
              </label>
              <textarea
                rows={3}
                value={requirementsInput}
                onChange={(e) => setRequirementsInput(e.target.value)}
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>

            {/* Benefits */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                Quyền lợi được hưởng (mỗi dòng một ý)
              </label>
              <textarea
                rows={3}
                value={benefitsInput}
                onChange={(e) => setBenefitsInput(e.target.value)}
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0EAE0] flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl font-bold text-xs bg-[#2E5339] text-white hover:bg-[#23412E] shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Đăng tin tuyển dụng ngay
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: TIN TUYỂN DỤNG CỦA DOANH NGHIỆP */}
      {activeTab === 'my_jobs' && (
        <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
            <div>
              <h2 className="text-base font-bold text-[#1D2C22]">
                Các tin tuyển dụng bạn đã đăng ({myPostedJobs.length})
              </h2>
              <p className="text-xs text-[#63766A]">
                Danh sách các tin việc làm do bạn khởi tạo và quản lý hồ sơ ứng viên
              </p>
            </div>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Đăng thêm tin mới
            </button>
          </div>

          {myPostedJobs.length > 0 ? (
            <div className="space-y-3">
              {myPostedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl border border-[#E5DFD3] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-[#1D2C22]">{job.title}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF1EC] text-[#23412E]">
                        {job.workType}
                      </span>
                    </div>
                    <p className="text-xs text-[#526558]">
                      {job.company} • {job.location} • Lương: {job.salaryRange}
                    </p>
                    <p className="text-[11px] text-[#7A8C80]">
                      Người đại diện: {job.recruiterName || 'Chưa cập nhật'} ({job.recruiterRole || 'Tuyển dụng'})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedIndustry(job.category);
                        setActiveTab('candidates');
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border border-[#2E5339] text-[#23412E] hover:bg-[#EAF1EC] transition-colors"
                    >
                      Lọc ứng viên cho tin này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-[#7A8C80]">
              Bạn chưa đăng tin tuyển dụng tùy chỉnh nào. Hãy bấm "Đăng tin tuyển dụng mới" để bắt đầu!
            </div>
          )}
        </div>
      )}

      {/* MODAL: XEM HỒ SƠ ỨNG VIÊN CHI TIẾT */}
      {inspectingCandidate && (
        <CandidateDetailModal
          candidate={inspectingCandidate.profile}
          isOpen={Boolean(inspectingCandidate)}
          onClose={() => setInspectingCandidate(null)}
          featuredHighlight={inspectingCandidate.featuredHighlight}
          applicationNote={inspectingCandidate.coverLetter}
          isVipRecruiter={userAccount?.plan === 'vip'}
          isRecruiter={userAccount?.role === 'recruiter'}
          isVerified={userAccount?.isVerified}
          recruiterEmail={userAccount?.email}
          onRequestVipModal={(feature) => onRequestVipModal?.(feature || 'Mở khóa số điện thoại & email đầy đủ của ứng viên')}
          onOpenOtpModal={onOpenOtpModal}
          onInvite={() => {
            if (inspectingCandidate.sourceType === 'applicant' && inspectingCandidate.applicationId) {
              const originalApp = applications.find((a) => a.id === inspectingCandidate.applicationId);
              if (originalApp) setSelectedAppForInterview(originalApp);
            } else {
              alert(`Đã gửi lời mời phỏng vấn & kết nối tới ${inspectingCandidate.candidateName} qua email ${inspectingCandidate.email}`);
            }
          }}
        />
      )}

      {/* MODAL: SẮP XẾP LỊCH PHỎNG VẤN CHO ỨNG VIÊN NỘP HỒ SƠ */}
      {selectedAppForInterview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#1D2C22] flex items-center gap-2">
              <Video className="w-5 h-5 text-[#2E5339]" />
              Sắp xếp lịch phỏng vấn cho: {selectedAppForInterview.candidateName}
            </h3>

            {interviewScheduledSuccess && (
              <div className="p-3 rounded-xl bg-[#EAF1EC] text-[#23412E] font-bold text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-[#2E5339]" />
                Lịch phỏng vấn đã được xếp và thông báo tới ứng viên!
              </div>
            )}

            <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#4C5E52] block mb-1">Ngày phỏng vấn</label>
                  <input
                    type="text"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    placeholder="dd/mm/yyyy"
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#4C5E52] block mb-1">Giờ phỏng vấn</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#4C5E52] block mb-1">Hình thức</label>
                <select
                  value={interviewFormat}
                  onChange={(e) => setInterviewFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                >
                  <option value="Online (Google Meet/Zoom)">Online (Google Meet/Zoom)</option>
                  <option value="Trực tiếp tại văn phòng">Trực tiếp tại văn phòng</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#4C5E52] block mb-1">Link họp / Địa điểm</label>
                <input
                  type="text"
                  required
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#4C5E52] block mb-1">Ghi chú gửi ứng viên</label>
                <textarea
                  rows={2}
                  value={interviewNote}
                  onChange={(e) => setInterviewNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppForInterview(null)}
                  className="px-4 py-2 rounded-xl border border-[#D5CDC0] text-[#55675B]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl font-bold bg-[#2E5339] text-white hover:bg-[#23412E]"
                >
                  Xác nhận lịch phỏng vấn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
