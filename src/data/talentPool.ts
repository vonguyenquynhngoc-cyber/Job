import { CandidateProfile } from '../types';

export interface TalentCandidate extends CandidateProfile {
  id: string;
  featuredHighlight: string;
}

export const TALENT_POOL: TalentCandidate[] = [
  {
    id: 'talent-1',
    fullName: 'Lê Hoàng Minh',
    email: 'hoangminh.le@gmail.com',
    phone: '0988 123 456',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '14/05/1998',
    gender: 'Nam',
    location: 'Cầu Giấy, Hà Nội',
    currentTitle: 'Kỹ sư Fullstack Senior / Team Lead',
    industry: 'Công nghệ thông tin',
    highestDegree: 'Thạc sĩ (Master)',
    experienceYears: 'Trên 3 năm',
    bio: 'Thạc sĩ Khoa học Máy tính Đại học Bách Khoa, có hơn 3.5 năm kinh nghiệm kiến trúc hệ thống phân tán, ReactJS, NodeJS và tối ưu hóa hiệu năng đám mây.',
    desiredJob: 'Trưởng nhóm kỹ thuật / Senior Software Engineer',
    desiredSalary: '30.000.000 - 45.000.000 đ',
    desiredWorkType: 'Full-time / Linh hoạt',
    featuredHighlight: 'Bằng Thạc sĩ Bách Khoa & 3.5 năm dẫn dắt dự án SaaS quy mô lớn',
    skills: [
      { id: 's1', name: 'React / Next.js', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's2', name: 'Node.js & Microservices', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's3', name: 'Docker / Kubernetes / AWS', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's4', name: 'Quản lý dự án Agile/Scrum', level: 'Thành thạo', category: 'Kỹ năng mềm' }
    ],
    education: [
      {
        id: 'edu-1',
        school: 'Đại học Bách Khoa Hà Nội',
        major: 'Khoa học Máy tính',
        degree: 'Thạc sĩ',
        startYear: '2021',
        endYear: '2023',
        gpa: '3.85/4.0 (Xuất sắc)',
        description: 'Tốt nghiệp thủ khoa đầu ra chương trình Thạc sĩ chuyên ngành AI & Distributed Systems'
      },
      {
        id: 'edu-1b',
        school: 'Đại học Bách Khoa Hà Nội',
        major: 'Kỹ thuật Phần mềm',
        degree: 'Kỹ sư',
        startYear: '2016',
        endYear: '2021',
        gpa: '3.6/4.0 (Giỏi)',
        description: 'Bằng Kỹ sư Xuất sắc'
      }
    ],
    experience: [
      {
        id: 'exp-1',
        company: 'FPT Software & Fintech Corp',
        position: 'Senior Fullstack Engineer & Tech Lead',
        startDate: '01/2022',
        endDate: 'Hiện tại',
        current: true,
        description: 'Dẫn dắt đội ngũ 8 kỹ sư phát triển giải pháp thanh toán điện tử phục vụ hơn 500.000 người dùng hàng ngày.'
      },
      {
        id: 'exp-1b',
        company: 'VNG Cloud',
        position: 'Software Developer',
        startDate: '06/2020',
        endDate: '12/2021',
        current: false,
        description: 'Tham gia xây dựng API Gateway và cải tiến tốc độ xử lý dữ liệu lên 40%.'
      }
    ],
    certificates: [
      { id: 'c1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
      { id: 'c2', name: 'IELTS 7.5 Academic', issuer: 'British Council', year: '2022' }
    ],
    portfolioLinks: [
      { id: 'p1', title: 'GitHub Profile', url: 'https://github.com/hoangminh-tech' },
      { id: 'p2', title: 'Tech Blog & Architecture Docs', url: 'https://minh-engineering.dev' }
    ]
  },
  {
    id: 'talent-2',
    fullName: 'Trần Thị Thu Thảo',
    email: 'thuthao.tran@gmail.com',
    phone: '0905 678 901',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '20/09/1999',
    gender: 'Nữ',
    location: 'Quận 1, TP. Hồ Chí Minh',
    currentTitle: 'Chuyên viên Digital Marketing & Brand Growth',
    industry: 'Marketing / Truyền thông',
    highestDegree: 'Thạc sĩ (Master)',
    experienceYears: '2 - 3 năm',
    bio: 'Thạc sĩ Marketing Quốc tế tốt nghiệp tại ĐH Kinh tế TP.HCM (UEH), có 2.5 năm triển khai chiến dịch đa kênh cho các nhãn hàng F&B và E-commerce.',
    desiredJob: 'Digital Marketing Specialist / Brand Executive',
    desiredSalary: '18.000.000 - 25.000.000 đ',
    desiredWorkType: 'Full-time',
    featuredHighlight: 'Bằng Thạc sĩ UEH & 2.5 năm kinh nghiệm tăng trưởng doanh thu chiến dịch đa kênh',
    skills: [
      { id: 's5', name: 'Meta & Google Ads Specialist', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's6', name: 'Content Marketing & SEO', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's7', name: 'Data Analysis (GA4 / PowerBI)', level: 'Khá', category: 'Chuyên môn' },
      { id: 's8', name: 'Kỹ năng đàm phán KOLs/KOCs', level: 'Thành thạo', category: 'Kỹ năng mềm' }
    ],
    education: [
      {
        id: 'edu-2',
        school: 'Đại học Kinh Tế TP.HCM (UEH)',
        major: 'Marketing Quốc tế',
        degree: 'Thạc sĩ',
        startYear: '2022',
        endYear: '2024',
        gpa: '3.7/4.0 (Giỏi)',
        description: 'Luận văn tốt nghiệp đạt loại A về Chiến lược Omni-channel cho thị trường Đông Nam Á'
      },
      {
        id: 'edu-2b',
        school: 'Đại học Ngoại Thương CS2',
        major: 'Kinh doanh Quốc tế',
        degree: 'Cử nhân',
        startYear: '2017',
        endYear: '2021',
        gpa: '3.5/4.0 (Giỏi)',
        description: 'Tốt nghiệp cử nhân loại giỏi'
      }
    ],
    experience: [
      {
        id: 'exp-2',
        company: 'Omni Media Global',
        position: 'Digital Marketing Leader',
        startDate: '03/2023',
        endDate: 'Hiện tại',
        current: true,
        description: 'Quản trị ngân sách quảng cáo hơn 800 triệu/tháng, tối ưu chi phí thu hút khách hàng (CAC) giảm 25%.'
      },
      {
        id: 'exp-2b',
        company: 'Shopee Vietnam',
        position: 'Campaign Associate',
        startDate: '08/2021',
        endDate: '02/2023',
        current: false,
        description: 'Phối hợp thực hiện các Mega Sale chiến dịch 9.9 và 11.11 mang lại GMV vượt mục tiêu.'
      }
    ],
    certificates: [
      { id: 'c3', name: 'Google Ads & Analytics Certified', issuer: 'Google Academy', year: '2023' },
      { id: 'c4', name: 'TOEIC 920/990', issuer: 'ETS', year: '2022' }
    ],
    portfolioLinks: [
      { id: 'p3', title: 'Case Studies Portfolio', url: 'https://behance.net/thuthaomarketing' }
    ]
  },
  {
    id: 'talent-3',
    fullName: 'Phạm Đức Anh',
    email: 'ducanh.pham@gmail.com',
    phone: '0973 456 789',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '18/11/2000',
    gender: 'Nam',
    location: 'Thanh Xuân, Hà Nội',
    currentTitle: 'UI/UX Designer & Product Design Specialist',
    industry: 'Thiết kế / Đồ họa / UI-UX',
    highestDegree: 'Cử nhân / Kỹ sư',
    experienceYears: '2 - 3 năm',
    bio: 'Cử nhân Mỹ thuật Công nghiệp với 2.5 năm thiết kế trải nghiệm người dùng, xây dựng Design System và Prototype cho các ứng dụng Mobile App và Web SaaS.',
    desiredJob: 'Senior UI/UX Designer / Product Designer',
    desiredSalary: '18.000.000 - 24.000.000 đ',
    desiredWorkType: 'Full-time / Hybrid',
    featuredHighlight: 'Cử nhân Mỹ thuật Công nghiệp & 2.5 năm thiết kế hệ thống Design System chuyên nghiệp',
    skills: [
      { id: 's9', name: 'Figma & Design Systems', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's10', name: 'User Research & Wireframing', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's11', name: 'Adobe Photoshop / Illustrator', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's12', name: 'Tư duy thị giác & Prototyping', level: 'Thành thạo', category: 'Kỹ năng mềm' }
    ],
    education: [
      {
        id: 'edu-3',
        school: 'Đại học Mỹ Thuật Công Nghiệp Hà Nội',
        major: 'Thiết kế Đồ họa & Tương tác',
        degree: 'Cử nhân',
        startYear: '2018',
        endYear: '2022',
        gpa: '3.6/4.0 (Giỏi)',
        description: 'Giải Nhất cuộc thi Sáng tạo Thiết kế Ứng dụng trẻ năm 2021'
      }
    ],
    experience: [
      {
        id: 'exp-3',
        company: 'VNPAY Design Studio',
        position: 'UI/UX Product Designer',
        startDate: '06/2022',
        endDate: 'Hiện tại',
        current: true,
        description: 'Phụ trách cải tiến luồng thanh toán và đăng ký thẻ, tăng tỷ lệ hoàn thành tác vụ thêm 18%.'
      }
    ],
    certificates: [
      { id: 'c5', name: 'Google UX Design Professional Certificate', issuer: 'Coursera & Google', year: '2023' }
    ],
    portfolioLinks: [
      { id: 'p4', title: 'Behance Portfolio', url: 'https://behance.net/ducanhdesign' }
    ]
  },
  {
    id: 'talent-4',
    fullName: 'Võ Thị Thanh Mai',
    email: 'thanhmai.vo@gmail.com',
    phone: '0918 890 123',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '05/03/2001',
    gender: 'Nữ',
    location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    currentTitle: 'Chuyên viên Kế toán Tổng hợp & Tài chính',
    industry: 'Tài chính / Kế toán / Ngân hàng',
    highestDegree: 'Cử nhân / Kỹ sư',
    experienceYears: '1 - 2 năm',
    bio: 'Cử nhân Kế toán - Kiểm toán Đại học Kinh tế Quốc dân, 1.5 năm kinh nghiệm hạch toán, lập báo cáo thuế và quản trị dòng tiền doanh nghiệp.',
    desiredJob: 'Kế toán tổng hợp / Chuyên viên Phân tích Tài chính',
    desiredSalary: '12.000.000 - 16.000.000 đ',
    desiredWorkType: 'Full-time',
    featuredHighlight: 'Bằng Cử nhân Kế toán Kiểm toán & 1.5 năm phụ trách sổ sách kế toán thuế',
    skills: [
      { id: 's13', name: 'Phần mềm MISA / FAST', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's14', name: 'Lập báo cáo tài chính & Thuế', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's15', name: 'Excel nâng cao (VBA/Macros)', level: 'Thành thạo', category: 'Chuyên môn' }
    ],
    education: [
      {
        id: 'edu-4',
        school: 'Đại học Kinh Tế Quốc Dân',
        major: 'Kế toán & Kiểm toán',
        degree: 'Cử nhân',
        startYear: '2019',
        endYear: '2023',
        gpa: '3.55/4.0 (Giỏi)',
        description: 'Học bổng khuyến khích học tập 4 kỳ liên tiếp'
      }
    ],
    experience: [
      {
        id: 'exp-4',
        company: 'Công ty CP Sản Xuất & Thương Mại An Nam',
        position: 'Kế toán tổng hợp',
        startDate: '07/2023',
        endDate: 'Hiện tại',
        current: true,
        description: 'Thực hiện quyết toán thuế GTGT, TNCN, TNDN và đối soát công nợ khách hàng.'
      }
    ],
    certificates: [
      { id: 'c6', name: 'Chứng chỉ Kế toán trưởng', issuer: 'Bộ Tài Chính', year: '2024' }
    ],
    portfolioLinks: []
  },
  {
    id: 'talent-5',
    fullName: 'Nguyễn Văn Hải',
    email: 'hai.nguyenvan@gmail.com',
    phone: '0934 567 890',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '12/08/2003',
    gender: 'Nam',
    location: 'Hà Đông, Hà Nội',
    currentTitle: 'Sinh viên năm 4 CNTT / Frontend Intern',
    industry: 'Công nghệ thông tin',
    highestDegree: 'Đang học Đại học / Sinh viên',
    experienceYears: 'Dưới 1 năm',
    bio: 'Sinh viên năm cuối ngành Công nghệ thông tin Học viện Công nghệ Bưu chính Viễn thông. Nắm vững HTML/CSS/JavaScript, ReactJS và nhiệt tình học hỏi công nghệ mới.',
    desiredJob: 'Thực tập sinh ReactJS / Fresher Frontend',
    desiredSalary: '4.000.000 - 7.000.000 đ',
    desiredWorkType: 'Thực tập / Part-time',
    featuredHighlight: 'Sinh viên năm cuối PTIT & Đã làm 3 dự án Capstone với ReactJS & Tailwind',
    skills: [
      { id: 's16', name: 'ReactJS & TypeScript', level: 'Khá', category: 'Chuyên môn' },
      { id: 's17', name: 'Tailwind CSS & Responsive', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's18', name: 'Git & GitHub Workflow', level: 'Khá', category: 'Chuyên môn' },
      { id: 's19', name: 'Chăm chỉ, ham học hỏi', level: 'Thành thạo', category: 'Kỹ năng mềm' }
    ],
    education: [
      {
        id: 'edu-5',
        school: 'Học viện Công nghệ Bưu chính Viễn thông (PTIT)',
        major: 'Công nghệ Thông tin',
        degree: 'Sinh viên đại học (năm 4)',
        startYear: '2021',
        endYear: '2025',
        gpa: '3.2/4.0 (Khá)',
        description: 'Dự kiến tốt nghiệp tháng 06/2025'
      }
    ],
    experience: [
      {
        id: 'exp-5',
        company: 'Dự án Sinh viên Capstone',
        position: 'Thực tập sinh Frontend',
        startDate: '06/2024',
        endDate: '10/2024',
        current: false,
        description: 'Xây dựng giao diện web thương mại điện tử kết hợp API thanh toán VNPay.'
      }
    ],
    certificates: [
      { id: 'c7', name: 'Responsive Web Design', issuer: 'freeCodeCamp', year: '2023' }
    ],
    portfolioLinks: [
      { id: 'p5', title: 'GitHub Dự án Web', url: 'https://github.com/hai-frontend-intern' }
    ]
  },
  {
    id: 'talent-6',
    fullName: 'Đặng Mai Lan',
    email: 'mailan.dang@gmail.com',
    phone: '0945 123 789',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '25/02/2002',
    gender: 'Nữ',
    location: 'Cầu Giấy, Hà Nội',
    currentTitle: 'Biên phiên dịch & Trợ lý Đối ngoại Tiếng Anh - Tiếng Trung',
    industry: 'Ngôn ngữ / Biên phiên dịch',
    highestDegree: 'Cử nhân / Kỹ sư',
    experienceYears: '1 - 2 năm',
    bio: 'Cử nhân Song ngữ Anh - Trung Đại học Hà Nội (HANU), có 1.5 năm dịch tài liệu kỹ thuật, phiên dịch hội thảo và hỗ trợ giao dịch thương mại xuất nhập khẩu.',
    desiredJob: 'Biên phiên dịch / Trợ lý Giám đốc Đối ngoại',
    desiredSalary: '14.000.000 - 18.000.000 đ',
    desiredWorkType: 'Full-time',
    featuredHighlight: 'Bằng Cử nhân Song ngữ HANU & Chứng chỉ IELTS 8.0 cùng HSK 6',
    skills: [
      { id: 's20', name: 'Tiếng Anh C2 (IELTS 8.0)', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's21', name: 'Tiếng Trung Cao Cấp (HSK 6)', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's22', name: 'Kỹ năng soạn thảo văn bản', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's23', name: 'Giao tiếp đối ngoại quốc tế', level: 'Thành thạo', category: 'Kỹ năng mềm' }
    ],
    education: [
      {
        id: 'edu-6',
        school: 'Đại học Hà Nội (HANU)',
        major: 'Ngôn ngữ Anh & Ngôn ngữ Trung',
        degree: 'Cử nhân',
        startYear: '2020',
        endYear: '2024',
        gpa: '3.75/4.0 (Giỏi)',
        description: 'Tốt nghiệp cử nhân loại giỏi song ngữ Anh - Trung'
      }
    ],
    experience: [
      {
        id: 'exp-6',
        company: 'Công ty TNHH Thương Mại Quốc Tế Á - Âu',
        position: 'Trợ lý biên phiên dịch',
        startDate: '01/2023',
        endDate: 'Hiện tại',
        current: true,
        description: 'Phiên dịch các buổi đàm phán hợp đồng với đối tác Trung Quốc và Singapore.'
      }
    ],
    certificates: [
      { id: 'c8', name: 'IELTS 8.0 Academic', issuer: 'IDP Education', year: '2023' },
      { id: 'c9', name: 'HSK 6 (280/300 điểm)', issuer: 'Hanban', year: '2024' }
    ],
    portfolioLinks: []
  },
  {
    id: 'talent-7',
    fullName: 'Bùi Gia Huy',
    email: 'giahuy.bui@gmail.com',
    phone: '0966 889 911',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    dateOfBirth: '30/07/2002',
    gender: 'Nam',
    location: 'Quận 10, TP. Hồ Chí Minh',
    currentTitle: 'Chuyên viên Phát triển Kinh doanh (B2B Sales)',
    industry: 'Kinh doanh / Bán hàng',
    highestDegree: 'Cao đẳng',
    experienceYears: '1 - 2 năm',
    bio: 'Tốt nghiệp Cao đẳng Kinh tế Đối ngoại, có 1.5 năm kinh nghiệm tìm kiếm khách hàng doanh nghiệp, tư vấn giải pháp phần mềm và đàm phán hợp đồng.',
    desiredJob: 'B2B Sales Executive / Account Executive',
    desiredSalary: '10.000.000 đ + Hoa hồng doanh số',
    desiredWorkType: 'Full-time',
    featuredHighlight: 'Bằng Cao đẳng Kinh tế Đối ngoại & Doanh số Top 2 quý 3/2024',
    skills: [
      { id: 's24', name: 'Kỹ năng telesales & chốt deal', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's25', name: 'CRM HubSpot / Zoho', level: 'Thành thạo', category: 'Chuyên môn' },
      { id: 's26', name: 'Thuyết phục khách hàng', level: 'Thành thạo', category: 'Kỹ năng mềm' }
    ],
    education: [
      {
        id: 'edu-7',
        school: 'Cao đẳng Kinh Tế Đối Ngoại (COFER)',
        major: 'Quản trị Kinh doanh',
        degree: 'Cao đẳng',
        startYear: '2020',
        endYear: '2023',
        gpa: '3.4/4.0',
        description: 'Tốt nghiệp loại Khá giỏi'
      }
    ],
    experience: [
      {
        id: 'exp-7',
        company: 'SaaS Solutions Vietnam',
        position: 'B2B Sales Associate',
        startDate: '04/2023',
        endDate: 'Hiện tại',
        current: true,
        description: 'Đạt 130% KPI doanh số năm 2023, mang lại hơn 40 khách hàng doanh nghiệp mới.'
      }
    ],
    certificates: [],
    portfolioLinks: []
  }
];
