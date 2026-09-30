export type WorkType = 'Full-time' | 'Part-time' | 'Thực tập' | 'Freelance';

export type UserRole = 'candidate' | 'recruiter';

export type AccountPlan = 'free' | 'vip';

export interface UserAccount {
  id: string;
  role: UserRole;
  plan: AccountPlan; // 'free' (mặc định) | 'vip' (bắt buộc nạp tiền thanh toán mới được mở)
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  companyEmail?: string;
  isVerified: boolean; // Chỉ Nhà tuyển dụng đã xác minh bằng mã OTP email công ty mới xem được ứng viên
  verifiedAt?: string;
  registeredAt: string;
  appliedCountToday?: number;
  lastAppliedDate?: string;
  vipExpiresAt?: string;
  walletBalance?: number;
}

export interface VipPackage {
  id: 'month' | 'quarter' | 'year';
  name: string;
  price: number;
  durationMonths: number;
  badge: string;
  savings?: string;
  isPopular?: boolean;
}

export type SalaryTier =
  | 'all'
  | 'under_5m'
  | '5m_8m'
  | '8m_12m'
  | '12m_15m'
  | 'above_15m'
  | 'custom'
  | 'negotiable';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoColor: string;
  category: string;
  location: string;
  province?: string;
  address?: string;
  workType: WorkType;
  salaryRange: string;
  salaryTier: SalaryTier;
  salaryMin?: number; // in million VND (e.g. 8 = 8.000.000 đ)
  salaryMax?: number; // in million VND (e.g. 12 = 12.000.000 đ)
  experienceLevel: string;
  tags: string[];
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  isStudentFriendly: boolean;
  isRecruiterCustom?: boolean;
  isVipPriority?: boolean; // Highlighted priority for VIP recruiter jobs
  recruiterName?: string;
  recruiterRole?: string;
  recruiterAvatar?: string;
}

export interface RecruiterProfile {
  representativeName: string;
  representativeRole: string;
  companyName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  companyAddress?: string;
  province?: string;
  website?: string;
  companyBio?: string;
  employeeScale?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: 'Cơ bản' | 'Khá' | 'Thành thạo';
  category: 'Chuyên môn' | 'Kỹ năng mềm';
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  startYear: string;
  endYear: string;
  gpa?: string;
  description?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface PortfolioLink {
  id: string;
  title: string;
  url: string;
}

export interface CandidateProfile {
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  desiredLocations?: string[];
  currentTitle: string;
  industry?: string;
  highestDegree?: string;
  experienceYears?: string;
  bio: string;
  desiredJob: string;
  desiredSalary: string;
  desiredSalaryTier?: SalaryTier;
  desiredSalaryAmount?: number;
  desiredWorkType: string;
  skills: SkillItem[];
  education: EducationItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
  portfolioLinks: PortfolioLink[];
}

export type ApplicationStatus = 'submitted' | 'reviewing' | 'interview' | 'accepted' | 'rejected';

export interface InterviewDetails {
  date: string;
  time: string;
  locationOrLink: string;
  format: 'Online (Google Meet/Zoom)' | 'Trực tiếp tại văn phòng';
  note?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  companyLogoColor?: string;
  workType?: string;
  location?: string;
  salaryRange?: string;
  appliedDate: string;
  status: ApplicationStatus;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  coverLetter: string;
  portfolioUrl?: string;
  industry?: string;
  highestDegree?: string;
  experienceYears?: string;
  cvSnapshot: CandidateProfile;
  interviewDetails?: InterviewDetails;
  feedbackNote?: string;
}

export interface FilterState {
  keyword: string;
  category: string;
  locations: string[]; // Multi-select array of provinces/cities
  workType: string;
  salaryTier: SalaryTier;
  customSalary: string;
  experience: string;
  studentFriendlyOnly: boolean;
}

export type ActiveTab =
  | 'jobs'
  | 'saved'
  | 'profile'
  | 'applications'
  | 'recruiter'
  | 'recruiter_jobs'
  | 'recruiter_talents'
  | 'recruiter_applications'
  | 'recruiter_profile';
