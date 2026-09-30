import { CandidateProfile, Application, EducationItem, ExperienceItem } from '../types';

export interface CandidateScoreResult {
  totalScore: number;
  degreeScore: number;
  degreeLabel: string;
  experienceScore: number;
  experienceLabel: string;
  bonusScore: number;
  rankingTier: 'Hồ sơ Xuất Sắc' | 'Hồ sơ Tiềm Năng Cao' | 'Hồ sơ Triển Vọng' | 'Hồ sơ Khởi Đầu';
  tierColor: string;
}

/**
 * Tính điểm Trình độ học vấn & Bằng cấp (Thang 40 điểm)
 */
export function getDegreeScore(degreeStr?: string, educationList?: EducationItem[]): { score: number; label: string } {
  // Kiểm tra chuỗi khai báo trực tiếp hoặc duyệt qua danh sách học vấn
  let bestScore = 0;
  let bestLabel = 'Chưa cập nhật';

  const checkDegree = (str: string) => {
    if (!str) return;
    const lower = str.toLowerCase();
    if (lower.includes('tiến sĩ') || lower.includes('phd') || lower.includes('doctor')) {
      if (bestScore < 40) {
        bestScore = 40;
        bestLabel = 'Tiến sĩ (PhD)';
      }
    } else if (lower.includes('thạc sĩ') || lower.includes('master') || lower.includes('cao học')) {
      if (bestScore < 30) {
        bestScore = 30;
        bestLabel = 'Thạc sĩ (Master)';
      }
    } else if (
      lower.includes('cử nhân') ||
      lower.includes('kỹ sư') ||
      lower.includes('đại học') ||
      lower.includes('bachelor') ||
      lower.includes('engineer')
    ) {
      if (bestScore < 20) {
        bestScore = 20;
        bestLabel = 'Cử nhân / Kỹ sư';
      }
    } else if (lower.includes('cao đẳng') || lower.includes('associate')) {
      if (bestScore < 10) {
        bestScore = 10;
        bestLabel = 'Cao đẳng';
      }
    } else if (
      lower.includes('sinh viên') ||
      lower.includes('đang học') ||
      lower.includes('trung cấp') ||
      lower.includes('nghề')
    ) {
      if (bestScore < 5) {
        bestScore = 5;
        bestLabel = 'Đang học ĐH / Trung cấp';
      }
    }
  };

  if (degreeStr) {
    checkDegree(degreeStr);
  }

  if (educationList && educationList.length > 0) {
    for (const edu of educationList) {
      if (edu.degree) checkDegree(edu.degree);
      if (edu.major) checkDegree(edu.major);
      if (edu.school) checkDegree(edu.school);
    }
  }

  if (bestScore === 0 && (educationList && educationList.length > 0)) {
    bestScore = 15;
    bestLabel = 'Đại học / Cao đẳng';
  }

  return { score: bestScore, label: bestLabel };
}

/**
 * Tính điểm Kinh nghiệm làm việc & Dự án (Thang 50 điểm)
 */
export function getExperienceScore(
  expYearsStr?: string,
  experienceList?: ExperienceItem[]
): { score: number; label: string } {
  let score = 0;
  let label = 'Chưa có kinh nghiệm';

  const lower = (expYearsStr || '').toLowerCase();

  if (lower.includes('trên 3 năm') || lower.includes('3 năm trở lên') || lower.includes('4 năm') || lower.includes('5 năm')) {
    score = 50;
    label = 'Trên 3 năm kinh nghiệm';
  } else if (lower.includes('2 - 3 năm') || lower.includes('2 năm')) {
    score = 35;
    label = '2 - 3 năm kinh nghiệm';
  } else if (lower.includes('1 - 2 năm') || lower.includes('1 năm')) {
    score = 25;
    label = '1 - 2 năm kinh nghiệm';
  } else if (lower.includes('dưới 1 năm') || lower.includes('mới tốt nghiệp')) {
    score = 15;
    label = 'Dưới 1 năm kinh nghiệm';
  } else if (lower.includes('thực tập') || lower.includes('intern') || lower.includes('dự án')) {
    score = 10;
    label = 'Kinh nghiệm thực tập / dự án';
  }

  // Nếu chưa có khai báo chuỗi nhưng có danh sách công ty đã làm
  if (score === 0 && experienceList && experienceList.length > 0) {
    const count = experienceList.length;
    if (count >= 3) {
      score = 40;
      label = `${count} dự án / công ty`;
    } else if (count === 2) {
      score = 25;
      label = '2 vị trí làm việc / dự án';
    } else {
      score = 15;
      label = '1 vị trí làm việc / dự án';
    }
  }

  return { score, label };
}

/**
 * Tính tổng điểm hồ sơ xếp hạng ứng viên (Thang 100 điểm)
 * Bằng cấp (40đ) + Kinh nghiệm (50đ) + Điểm cộng GPA/Chứng chỉ (10đ)
 */
export function evaluateCandidate(candidate: {
  highestDegree?: string;
  experienceYears?: string;
  education?: EducationItem[];
  experience?: ExperienceItem[];
  skills?: any[];
  certificates?: any[];
}): CandidateScoreResult {
  const degreeResult = getDegreeScore(candidate.highestDegree, candidate.education);
  const expResult = getExperienceScore(candidate.experienceYears, candidate.experience);

  // Bonus: GPA giỏi / xuất sắc (+5) hoặc có chứng chỉ (+5)
  let bonus = 0;
  if (candidate.education && candidate.education.some((e) => {
    const gpaStr = e.gpa || '';
    return gpaStr.includes('3.') || gpaStr.includes('4.0') || gpaStr.includes('Giỏi') || gpaStr.includes('Xuất sắc') || gpaStr.includes('8.') || gpaStr.includes('9.');
  })) {
    bonus += 5;
  }
  if (candidate.certificates && candidate.certificates.length > 0) {
    bonus += 5;
  }

  const total = Math.min(100, degreeResult.score + expResult.score + bonus);

  let rankingTier: CandidateScoreResult['rankingTier'] = 'Hồ sơ Khởi Đầu';
  let tierColor = 'bg-gray-100 text-gray-700 border-gray-300';

  if (total >= 70) {
    rankingTier = 'Hồ sơ Xuất Sắc';
    tierColor = 'bg-[#EAF1EC] text-[#23412E] border-[#3F634A]';
  } else if (total >= 45) {
    rankingTier = 'Hồ sơ Tiềm Năng Cao';
    tierColor = 'bg-blue-50 text-blue-800 border-blue-200';
  } else if (total >= 25) {
    rankingTier = 'Hồ sơ Triển Vọng';
    tierColor = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  return {
    totalScore: total,
    degreeScore: degreeResult.score,
    degreeLabel: degreeResult.label,
    experienceScore: expResult.score,
    experienceLabel: expResult.label,
    bonusScore: bonus,
    rankingTier,
    tierColor
  };
}

/**
 * Danh sách ngành / lĩnh vực tuyển dụng chuẩn
 */
export const RECRUITER_INDUSTRIES = [
  'Tất cả lĩnh vực',
  'Công nghệ thông tin',
  'Marketing / Truyền thông',
  'Thiết kế / Đồ họa / UI-UX',
  'Kinh doanh / Bán hàng',
  'Tài chính / Kế toán / Ngân hàng',
  'Ngôn ngữ / Biên phiên dịch',
  'Nhân sự / Hành chính',
  'Dịch vụ khách hàng'
];

/**
 * Danh sách bậc bằng cấp lọc
 */
export const RECRUITER_DEGREE_FILTERS = [
  'Tất cả bằng cấp',
  'Thạc sĩ trở lên',
  'Cử nhân / Kỹ sư',
  'Cao đẳng',
  'Đang học Đại học / Sinh viên'
];

/**
 * Danh sách khoảng kinh nghiệm lọc
 */
export const RECRUITER_EXP_FILTERS = [
  'Tất cả kinh nghiệm',
  'Trên 3 năm',
  '2 - 3 năm',
  '1 - 2 năm',
  'Dưới 1 năm',
  'Chưa có kinh nghiệm'
];

/**
 * Kiểm tra xem ứng viên có thỏa mãn bộ lọc bằng cấp hay không
 */
export function matchDegreeFilter(candidateDegreeScore: number, degreeFilter: string): boolean {
  if (degreeFilter === 'Tất cả bằng cấp') return true;
  if (degreeFilter === 'Thạc sĩ trở lên') return candidateDegreeScore >= 30;
  if (degreeFilter === 'Cử nhân / Kỹ sư') return candidateDegreeScore >= 20;
  if (degreeFilter === 'Cao đẳng') return candidateDegreeScore === 10;
  if (degreeFilter === 'Đang học Đại học / Sinh viên') return candidateDegreeScore <= 15;
  return true;
}

/**
 * Kiểm tra xem ứng viên có thỏa mãn bộ lọc kinh nghiệm hay không
 */
export function matchExperienceFilter(candidateExpScore: number, expFilter: string): boolean {
  if (expFilter === 'Tất cả kinh nghiệm') return true;
  if (expFilter === 'Trên 3 năm') return candidateExpScore >= 50;
  if (expFilter === '2 - 3 năm') return candidateExpScore >= 35 && candidateExpScore < 50;
  if (expFilter === '1 - 2 năm') return candidateExpScore >= 25 && candidateExpScore < 35;
  if (expFilter === 'Dưới 1 năm') return candidateExpScore >= 10 && candidateExpScore < 25;
  if (expFilter === 'Chưa có kinh nghiệm') return candidateExpScore < 15;
  return true;
}

/**
 * Sắp xếp danh sách ứng viên ưu tiên người có Kinh nghiệm & Bằng cấp cao nhất lên trên
 */
export function sortCandidatesByMerit<T extends { highestDegree?: string; experienceYears?: string; education?: EducationItem[]; experience?: ExperienceItem[]; skills?: any[]; certificates?: any[] }>(
  items: T[],
  sortOption: 'merit' | 'exp_first' | 'degree_first' = 'merit'
): { item: T; evaluation: CandidateScoreResult; rank: number }[] {
  const evaluated = items.map((item) => ({
    item,
    evaluation: evaluateCandidate(item),
    rank: 1
  }));

  evaluated.sort((a, b) => {
    if (sortOption === 'exp_first') {
      if (b.evaluation.experienceScore !== a.evaluation.experienceScore) {
        return b.evaluation.experienceScore - a.evaluation.experienceScore;
      }
      return b.evaluation.degreeScore - a.evaluation.degreeScore;
    }

    if (sortOption === 'degree_first') {
      if (b.evaluation.degreeScore !== a.evaluation.degreeScore) {
        return b.evaluation.degreeScore - a.evaluation.degreeScore;
      }
      return b.evaluation.experienceScore - a.evaluation.experienceScore;
    }

    // Mặc định (Merit - Tổng điểm: Kinh nghiệm & Bằng cấp cao nhất được đẩy lên đầu)
    if (b.evaluation.totalScore !== a.evaluation.totalScore) {
      return b.evaluation.totalScore - a.evaluation.totalScore;
    }
    if (b.evaluation.experienceScore !== a.evaluation.experienceScore) {
      return b.evaluation.experienceScore - a.evaluation.experienceScore;
    }
    return b.evaluation.degreeScore - a.evaluation.degreeScore;
  });

  return evaluated.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
}
