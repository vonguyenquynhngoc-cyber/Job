import { Job } from '../types';

export const CATEGORIES = [
  'Tất cả ngành nghề',
  'Công nghệ thông tin',
  'Marketing & Truyền thông',
  'Thiết kế & Đồ họa',
  'Kinh doanh & Bán hàng',
  'Tài chính - Kế toán',
  'Nhân sự & Tuyển dụng',
  'Chăm sóc khách hàng',
  'Giáo dục & Dịch thuật',
  'Sản xuất & Kỹ thuật'
];

export const PROVINCES: string[] = [
  'TP. Hồ Chí Minh',
  'Đồng Nai',
  'Bình Dương',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Hải Phòng',
  'Các tỉnh/thành khác'
];

export const LOCATIONS = [
  'Tất cả địa điểm',
  ...PROVINCES
];

export const WORK_TYPES = [
  'Tất cả hình thức',
  'Part-time',
  'Full-time',
  'Thực tập',
  'Freelance'
];

export const SALARY_TIERS = [
  { value: 'all', label: 'Tất cả mức lương', min: 0, max: 9999 },
  { value: 'under_5m', label: 'Dưới 5 triệu VNĐ', min: 0, max: 5 },
  { value: '5m_8m', label: '5 – 8 triệu VNĐ', min: 5, max: 8 },
  { value: '8m_12m', label: '8 – 12 triệu VNĐ', min: 8, max: 12 },
  { value: '12m_15m', label: '12 – 15 triệu VNĐ', min: 12, max: 15 },
  { value: 'above_15m', label: 'Trên 15 triệu VNĐ', min: 15, max: 9999 },
  { value: 'custom', label: 'Tự nhập mức lương mong muốn', min: 0, max: 9999 }
];

export const INITIAL_JOBS: Job[] = [
  // 1. DONG NAI - Job matching prompt example (Đồng Nai · 8 - 12 triệu VNĐ · Full-time)
  {
    id: 'job-dn-1',
    title: 'Kỹ sư Quản trị Hệ thống & Mạng IT (Junior/Fresher)',
    company: 'Amata Technology Vietnam',
    companyLogoColor: '#284B35',
    category: 'Công nghệ thông tin',
    location: 'Đồng Nai',
    province: 'Đồng Nai',
    address: 'KCN Amata, Phường Long Bình, TP. Biên Hòa, Đồng Nai',
    workType: 'Full-time',
    salaryRange: '8.000.000 - 12.000.000 đ',
    salaryTier: '8m_12m',
    salaryMin: 8,
    salaryMax: 12,
    experienceLevel: 'Dưới 1 năm',
    tags: ['KCN Amata', 'Đồng Nai', 'Hỗ trợ xe đưa đón', 'Đóng BHXH 100%'],
    postedDate: 'Hôm nay',
    deadline: '28/10/2026',
    description: 'Vận hành và giám sát hạ tầng máy chủ, hệ thống mạng nội bộ và hỗ trợ kỹ thuật người dùng tại nhà máy khu công nghiệp Amata Biên Hòa. Chấp nhận sinh viên mới tốt nghiệp ngành CNTT/Điện tử viễn thông.',
    requirements: [
      'Tốt nghiệp hoặc sinh viên năm cuối ĐH/CĐ chuyên ngành CNTT, Mạng máy tính, An toàn thông tin',
      'Hiểu biết cơ bản về TCP/IP, cấu hình Router, Switch, Windows Server, Linux',
      'Nhiệt tình, có trách nhiệm cao, ưu tiên ứng viên cư trú tại Đồng Nai hoặc lân cận',
      'Khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh cơ bản'
    ],
    benefits: [
      'Mức lương chính thức: 8.000.000 - 12.000.000 đ/tháng + Thưởng năng suất',
      'Xe buýt đưa đón nhân viên từ TP. Biên Hòa và TP. Thủ Đức đến nhà máy',
      'Cơm trưa miễn phí tại nhà ăn công ty, phụ cấp xăng xe hàng tháng',
      'Bảo hiểm y tế sức khỏe toàn diện và khám sức khỏe định kỳ hàng năm'
    ],
    contactEmail: 'tuyendung.dongnai@amata.vn',
    isStudentFriendly: true,
    recruiterName: 'Nguyễn Văn Hùng',
    recruiterRole: 'Trưởng phòng Nhân sự KCN Amata Đồng Nai'
  },
  {
    id: 'job-dn-2',
    title: 'Chuyên viên Kinh doanh B2B & Xuất nhập khẩu',
    company: 'CP Group Vietnam',
    companyLogoColor: '#36533F',
    category: 'Kinh doanh & Bán hàng',
    location: 'Đồng Nai',
    province: 'Đồng Nai',
    address: 'KCN Biên Hòa 2, TP. Biên Hòa, Đồng Nai',
    workType: 'Full-time',
    salaryRange: '9.000.000 - 12.000.000 đ',
    salaryTier: '8m_12m',
    salaryMin: 9,
    salaryMax: 12,
    experienceLevel: 'Dưới 1 năm',
    tags: ['Đồng Nai', 'KCN Biên Hòa 2', 'Hoa hồng hấp dẫn', 'Đào tạo chuyên sâu'],
    postedDate: 'Hôm qua',
    deadline: '31/10/2026',
    description: 'Tìm kiếm khách hàng doanh nghiệp, đàm phán hợp đồng cung ứng và phối hợp các thủ tục logistics xuất nhập khẩu nguyên liệu tại khu vực miền Đông Nam Bộ.',
    requirements: [
      'Tốt nghiệp ĐH/CĐ ngành Quản trị kinh doanh, Ngoại thương, Kinh tế quốc tế',
      'Kỹ năng giao tiếp tự tin, đàm phán tốt và tinh thần cầu tiến',
      'Sẵn sàng di chuyển thị trường khi có yêu cầu công việc'
    ],
    benefits: [
      'Lương cứng 9 - 12 triệu + Thưởng % doanh số không giới hạn',
      'Được đào tạo bài bản kỹ năng bán hàng B2B chuyên nghiệp',
      'Du lịch teambuilding 2 lần/năm cùng tập đoàn'
    ],
    contactEmail: 'recruitment@cp.com.vn',
    isStudentFriendly: true,
    recruiterName: 'Trần Thị Thu Hà',
    recruiterRole: 'HR Manager CP Vietnam'
  },
  {
    id: 'job-dn-3',
    title: 'Thực tập sinh Kế toán Sản xuất (Có phụ cấp)',
    company: 'Pou Chen Group Vietnam',
    companyLogoColor: '#284B35',
    category: 'Tài chính - Kế toán',
    location: 'Đồng Nai',
    province: 'Đồng Nai',
    address: 'KCN Hóa An, TP. Biên Hòa, Đồng Nai',
    workType: 'Thực tập',
    salaryRange: '4.500.000 - 6.000.000 đ',
    salaryTier: 'under_5m',
    salaryMin: 4.5,
    salaryMax: 6,
    experienceLevel: 'Không yêu cầu kinh nghiệm',
    tags: ['Hỗ trợ dấu thực tập', 'Đồng Nai', 'Excel kế toán'],
    postedDate: '2 ngày trước',
    deadline: '15/11/2026',
    description: 'Hỗ trợ kiểm kê chứng từ kho, nhập liệu phần mềm SAP/ERP và rà soát số liệu kế toán chi phí giá thành tại nhà máy.',
    requirements: [
      'Sinh viên năm 3, 4 ngành Kế toán, Kiểm toán, Tài chính tại Đồng Nai hoặc TP. HCM',
      'Cẩn thận, tỉ mỉ, thành thạo Excel (Vlookup, PivotTable)',
      'Làm việc tối thiểu 4 ngày/tuần'
    ],
    benefits: [
      'Phụ cấp thực tập 4.5 - 6 triệu/tháng + Cơm trưa nhà máy',
      'Đóng dấu xác nhận báo cáo thực tập tốt nghiệp đầy đủ',
      'Cơ hội trở thành nhân viên chính thức sau khi tốt nghiệp'
    ],
    contactEmail: 'hr-dongnai@pouchen.com',
    isStudentFriendly: true,
    recruiterName: 'Lê Hoàng Nam',
    recruiterRole: 'HR Officer'
  },

  // 2. BINH DUONG
  {
    id: 'job-bd-1',
    title: 'Nhân viên Xuất nhập khẩu & Logistics (Full-time)',
    company: 'TBS Group',
    companyLogoColor: '#43664E',
    category: 'Kinh doanh & Bán hàng',
    location: 'Bình Dương',
    province: 'Bình Dương',
    address: 'KCN VSIP 1, TP. Thuận An, Bình Dương',
    workType: 'Full-time',
    salaryRange: '8.500.000 - 12.000.000 đ',
    salaryTier: '8m_12m',
    salaryMin: 8.5,
    salaryMax: 12,
    experienceLevel: 'Dưới 1 năm',
    tags: ['Bình Dương', 'VSIP 1', 'Tiếng Anh giao tiếp', 'Full-time'],
    postedDate: 'Hôm nay',
    deadline: '20/11/2026',
    description: 'Theo dõi tiến độ đơn hàng quốc tế, làm thủ tục hải quan và điều phối xe giao nhận hàng hóa tại kho tổng KCN VSIP 1.',
    requirements: [
      'Tốt nghiệp CĐ/ĐH chuyên ngành Logistics, Xuất nhập khẩu, Ngoại thương',
      'Tiếng Anh đọc hiểu chứng từ tốt (Incoterms, Bill of Lading, Invoice)',
      'Nhanh nhẹn, chịu được áp lực tiến độ giao hàng'
    ],
    benefits: [
      'Thu nhập 8.5 - 12 triệu + Phụ cấp chuyên cần và cơm trưa',
      'Đầy đủ chế độ bảo hiểm và phúc lợi theo luật lao động',
      'Môi trường làm việc quốc tế năng động'
    ],
    contactEmail: 'hr@tbsgroup.vn',
    isStudentFriendly: true,
    recruiterName: 'Đặng Mai Phương',
    recruiterRole: 'Recruiter Lead TBS'
  },

  // 3. TP. HO CHI MINH
  {
    id: 'job-1',
    title: 'Chuyên viên Content Marketing & Social Media (Part-time)',
    company: 'Shopee Vietnam',
    companyLogoColor: '#36533F',
    category: 'Marketing & Truyền thông',
    location: 'TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    address: 'Saigon Centre, 67 Lê Lợi, Bến Nghé, Quận 1, TP. HCM',
    workType: 'Part-time',
    salaryRange: '5.500.000 - 8.000.000 đ',
    salaryTier: '5m_8m',
    salaryMin: 5.5,
    salaryMax: 8,
    experienceLevel: 'Dưới 1 năm',
    tags: ['Linh hoạt ca làm', 'GenZ Trendy', 'TikTok & Facebook', 'Phụ cấp ăn trưa'],
    postedDate: '1 ngày trước',
    deadline: '25/10/2026',
    description: 'Shopee tìm kiếm ứng viên trẻ trung, năng động, bắt trend nhanh để xây dựng nội dung sáng tạo cho các kênh mạng xã hội (TikTok, Facebook Fanpage, Instagram).',
    requirements: [
      'Sinh viên các trường ĐH/CĐ ngành Marketing, Báo chí, Truyền thông hoặc liên quan',
      'Khả năng viết lách lưu loát, ngôn từ trẻ trung, nhạy bén với xu hướng MXH',
      'Biết sử dụng cơ bản Canva, CapCut hoặc Photoshop để dựng video ngắn là lợi thế lớn',
      'Làm việc tối thiểu 24 giờ/tuần (có thể chọn ca sáng/chiều linh hoạt)'
    ],
    benefits: [
      'Mức lương Part-time cạnh tranh từ 5.5 - 8 triệu + Thưởng KPI tương tác',
      'Môi trường làm việc năng động tại văn phòng hiện đại bậc nhất Quận 1',
      'Voucher mua sắm Shopee độc quyền hàng tháng',
      'Cấp chứng nhận kinh nghiệm làm việc tại sàn TMĐT hàng đầu Đông Nam Á'
    ],
    contactEmail: 'careers-vn@shopee.com',
    isStudentFriendly: true,
    recruiterName: 'Lê Hoàng Lan',
    recruiterRole: 'Chuyên viên Tuyển dụng Cao cấp (Senior TA)'
  },
  {
    id: 'job-2',
    title: 'Thực tập sinh Phân tích Dữ liệu / Data Analyst Intern',
    company: 'VNG Corporation',
    companyLogoColor: '#284B35',
    category: 'Công nghệ thông tin',
    location: 'TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    address: 'VNG Campus, Khu chế xuất Tân Thuận, Quận 7, TP. HCM',
    workType: 'Thực tập',
    salaryRange: '6.000.000 - 8.000.000 đ',
    salaryTier: '5m_8m',
    salaryMin: 6,
    salaryMax: 8,
    experienceLevel: 'Không yêu cầu kinh nghiệm',
    tags: ['SQL / Python', 'Hỗ trợ dấu thực tập', 'Có xe đưa đón', 'Được đào tạo bài bản'],
    postedDate: '2 ngày trước',
    deadline: '15/11/2026',
    description: 'Cơ hội thực chiến cùng hệ thống dữ liệu hàng triệu người dùng tại VNG Campus. Bạn sẽ được đào tạo phân tích số liệu hành vi người dùng và trực quan hóa dashboard.',
    requirements: [
      'Sinh viên năm cuối ngành Khoa học dữ liệu, CNTT, Hệ thống thông tin, Toán tin, Kinh tế',
      'Hiểu biết cơ bản về SQL (SELECT, JOIN, GROUP BY) và tư duy logic phân tích tốt',
      'Biết sử dụng Python/R hoặc PowerBI/Tableau là điểm cộng',
      'Tinh thần ham học hỏi, cẩn thận và có trách nhiệm với số liệu'
    ],
    benefits: [
      'Trợ cấp thực tập hấp dẫn 6.000.000 - 8.000.000 đ/tháng',
      'Xe bus đưa đón CBNV từ các quận trung tâm tới VNG Campus',
      'Bữa sáng, bữa trưa dinh dưỡng miễn phí tại căng tin công ty',
      'Được tiếp cận dữ liệu thực tế lớn (Big Data) dưới sự hướng dẫn của Lead DA'
    ],
    contactEmail: 'talent@vng.com.vn',
    isStudentFriendly: true,
    recruiterName: 'Phạm Quốc Bảo',
    recruiterRole: 'HR Business Partner'
  },
  {
    id: 'job-3',
    title: 'Junior UI/UX Designer (Chấp nhận sinh viên mới ra trường)',
    company: 'Tiki Corporation',
    companyLogoColor: '#43664E',
    category: 'Thiết kế & Đồ họa',
    location: 'TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    address: 'Viettel Complex, 285 Cách Mạng Tháng 8, Phường 12, Quận 10, TP. HCM',
    workType: 'Full-time',
    salaryRange: '12.000.000 - 15.000.000 đ',
    salaryTier: '12m_15m',
    salaryMin: 12,
    salaryMax: 15,
    experienceLevel: 'Dưới 1 năm',
    tags: ['Figma', 'User Research', 'Design System', 'Đóng BHXH đầy đủ'],
    postedDate: '3 ngày trước',
    deadline: '05/11/2026',
    description: 'Thiết kế trải nghiệm người dùng và giao diện web/app cho hệ sinh thái thương mại điện tử Tiki. Chấp nhận ứng viên mới ra trường có portfolio sáng tạo.',
    requirements: [
      'Tốt nghiệp hoặc sinh viên năm cuối ngành Mỹ thuật ứng dụng, Thiết kế đa phương tiện, CNTT',
      'Sử dụng thành thạo công cụ Figma, hiểu về Auto-layout, Components và Design Token',
      'Có Portfolio đính kèm thể hiện ít nhất 2 dự án Web hoặc Mobile App'
    ],
    benefits: [
      'Thu nhập từ 12.000.000 - 15.000.000 đ/tháng + Lương tháng 13',
      'Cung cấp MacBook Pro và màn hình phụ làm việc',
      'Bảo hiểm sức khỏe cao cấp Tiki Care'
    ],
    contactEmail: 'recruitment@tiki.vn',
    isStudentFriendly: true,
    recruiterName: 'Vũ Thị Ngọc Mai',
    recruiterRole: 'Talent Acquisition Manager'
  },
  {
    id: 'job-hcm-senior',
    title: 'Senior Frontend Engineer (React/Next.js)',
    company: 'Fintech Unicorn Vietnam',
    companyLogoColor: '#284B35',
    category: 'Công nghệ thông tin',
    location: 'TP. Hồ Chí Minh',
    province: 'TP. Hồ Chí Minh',
    address: 'Toà nhà Bitexco, Quận 1, TP. HCM',
    workType: 'Full-time',
    salaryRange: '20.000.000 - 35.000.000 đ',
    salaryTier: 'above_15m',
    salaryMin: 20,
    salaryMax: 35,
    experienceLevel: 'Trên 3 năm',
    tags: ['React', 'Next.js', 'Lương cao', 'Thưởng cổ phần'],
    postedDate: 'Hôm nay',
    deadline: '30/11/2026',
    description: 'Phát triển ứng dụng ví điện tử và cổng thanh toán tài chính tốc độ cao phục vụ hàng triệu giao dịch mỗi ngày.',
    requirements: [
      'Kinh nghiệm 3+ năm làm việc với React, TypeScript, Redux Toolkit',
      'Hiểu sâu về Web Performance, SSR, micro-frontends'
    ],
    benefits: [
      'Mức lương 20 - 35 triệu VNĐ/tháng',
      'Thưởng cuối năm 2-4 tháng lương + cổ phần ESOP'
    ],
    contactEmail: 'tech-careers@fintech.vn',
    isStudentFriendly: false,
    recruiterName: 'Đoàn Quang Khải',
    recruiterRole: 'Engineering Manager'
  },

  // 4. HA NOI
  {
    id: 'job-4',
    title: 'Thực tập sinh Frontend ReactJS (Có lương)',
    company: 'FPT Software',
    companyLogoColor: '#284B35',
    category: 'Công nghệ thông tin',
    location: 'Hà Nội',
    province: 'Hà Nội',
    address: 'FPT Tower, Số 10 Phạm Văn Bạch, Cầu Giấy, Hà Nội',
    workType: 'Thực tập',
    salaryRange: '4.000.000 - 5.000.000 đ',
    salaryTier: 'under_5m',
    salaryMin: 4,
    salaryMax: 5,
    experienceLevel: 'Không yêu cầu kinh nghiệm',
    tags: ['Hỗ trợ dấu thực tập', 'ReactJS', 'Được đào tạo 1-1', 'Linh hoạt giờ học'],
    postedDate: 'Hôm nay',
    deadline: '30/10/2026',
    description: 'Chúng tôi đang tìm kiếm các bạn sinh viên năm 3, 4 hoặc mới tốt nghiệp ngành CNTT/KTPM đam mê lập trình Web để tham gia đội ngũ phát triển sản phẩm chuyển đổi số quy mô lớn.',
    requirements: [
      'Nắm vững kiến thức nền tảng HTML5, CSS3, JavaScript (ES6+)',
      'Đã từng làm dự án môn học hoặc bài tập lớn với ReactJS / TypeScript',
      'Có thể cam kết làm việc tối thiểu 3-4 ngày/tuần (hỗ trợ linh hoạt lịch thi)'
    ],
    benefits: [
      'Hỗ trợ phụ cấp thực tập 4 - 5 triệu đ/tháng',
      'Được Mentor kèm cặp 1-1 và đóng dấu mộc thực tập chuẩn',
      'Cơ hội ký hợp đồng chính thức ngay sau kỳ thực tập'
    ],
    contactEmail: 'tuyendung@fpt-software.com',
    isStudentFriendly: true,
    recruiterName: 'Trần Minh Tuấn',
    recruiterRole: 'Tech HR Lead'
  },
  {
    id: 'job-5',
    title: 'Lập trình viên Backend Node.js / Java (Fresher/Junior)',
    company: 'Viettel Solutions',
    companyLogoColor: '#36533F',
    category: 'Công nghệ thông tin',
    location: 'Hà Nội',
    province: 'Hà Nội',
    address: 'Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình, Hà Nội',
    workType: 'Full-time',
    salaryRange: '10.000.000 - 14.000.000 đ',
    salaryTier: '8m_12m',
    salaryMin: 10,
    salaryMax: 14,
    experienceLevel: 'Dưới 1 năm',
    tags: ['Node.js', 'Java Spring', 'Hà Nội', 'Full-time'],
    postedDate: '2 ngày trước',
    deadline: '15/11/2026',
    description: 'Phát triển API microservices và các giải pháp chính phủ số, y tế số và thành phố thông minh.',
    requirements: [
      'Nắm vững kiến thức OOP, Database SQL, cấu trúc dữ liệu và giải thuật',
      'Biết lập trình với Node.js hoặc Java Spring Boot',
      'Tốt nghiệp ĐH chuyên ngành CNTT loại Khá/Giỏi'
    ],
    benefits: [
      'Thu nhập 10 - 14 triệu/tháng + Thưởng dự án',
      'Môi trường công nghệ chuyển đổi số quốc gia'
    ],
    contactEmail: 'hr@viettelsolutions.vn',
    isStudentFriendly: true,
    recruiterName: 'Đỗ Quang Huy',
    recruiterRole: 'Talent Acquisition'
  },

  // 5. DA NANG
  {
    id: 'job-6',
    title: 'Nhân viên Tư vấn Bán hàng & CSKH Sinh viên (Part-time)',
    company: 'Giao Hàng Tiết Kiệm (GHTK)',
    companyLogoColor: '#36533F',
    category: 'Chăm sóc khách hàng',
    location: 'Đà Nẵng',
    province: 'Đà Nẵng',
    address: '403 Điện Biên Phủ, Thanh Khê, TP. Đà Nẵng',
    workType: 'Part-time',
    salaryRange: '4.000.000 - 5.000.000 đ',
    salaryTier: 'under_5m',
    salaryMin: 4,
    salaryMax: 5,
    experienceLevel: 'Không yêu cầu kinh nghiệm',
    tags: ['Xoay ca theo lịch học', 'Đà Nẵng', 'Part-time'],
    postedDate: '4 ngày trước',
    deadline: '30/10/2026',
    description: 'Tiếp nhận thông tin và giải đáp thắc mắc của khách hàng về đơn hàng qua hệ thống tổng đài và chatbox. Phù hợp sinh viên muốn rèn luyện kỹ năng mềm.',
    requirements: [
      'Sinh viên các trường ĐH/CĐ tại Đà Nẵng',
      'Giọng nói dễ nghe, không ngọng, hòa nhã và kiên nhẫn',
      'Đăng ký lịch làm theo tuần (4 ca/tuần, mỗi ca 4 tiếng)'
    ],
    benefits: [
      'Thu nhập 4.000.000 - 5.000.000 đ/tháng + Thưởng chuyên cần',
      'Chủ động xoay ca linh hoạt theo lịch học'
    ],
    contactEmail: 'tuyendung.danang@ghtk.vn',
    isStudentFriendly: true,
    recruiterName: 'Nguyễn Bích Ngọc',
    recruiterRole: 'Giám sát Tuyển dụng Miền Trung'
  },

  // 6. CAN THO
  {
    id: 'job-7',
    title: 'Chuyên viên Phát triển Thị trường Nông sản (Full-time)',
    company: 'Mekong Agri Corp',
    companyLogoColor: '#284B35',
    category: 'Kinh doanh & Bán hàng',
    location: 'Cần Thơ',
    province: 'Cần Thơ',
    address: 'Đường 30/4, Quận Ninh Kiều, TP. Cần Thơ',
    workType: 'Full-time',
    salaryRange: '8.000.000 - 11.000.000 đ',
    salaryTier: '8m_12m',
    salaryMin: 8,
    salaryMax: 11,
    experienceLevel: 'Dưới 1 năm',
    tags: ['Cần Thơ', 'Ninh Kiều', 'Full-time', 'Kinh doanh'],
    postedDate: '3 ngày trước',
    deadline: '20/11/2026',
    description: 'Phát triển mạng lưới phân phối nông sản sạch vùng Đồng bằng Sông Cửu Long và kết nối siêu thị.',
    requirements: [
      'Tốt nghiệp ĐH Cần Thơ hoặc các trường lân cận ngành Nông nghiệp, Kinh tế',
      'Nhiệt tình, trung thực, có kỹ năng giao tiếp tốt'
    ],
    benefits: [
      'Thu nhập 8 - 11 triệu/tháng + Hoa hồng theo doanh số',
      'Chế độ phúc lợi bảo hiểm đầy đủ'
    ],
    contactEmail: 'recruitment@mekongagri.com',
    isStudentFriendly: true,
    recruiterName: 'Lý Quốc Bảo',
    recruiterRole: 'HR Manager Cần Thơ'
  },

  // 7. HAI PHONG
  {
    id: 'job-8',
    title: 'Kỹ sư Giám sát Chất lượng QA/QC (Full-time)',
    company: 'VinFast Manufacturing',
    companyLogoColor: '#43664E',
    category: 'Sản xuất & Kỹ thuật',
    location: 'Hải Phòng',
    province: 'Hải Phòng',
    address: 'Khu công nghiệp Đình Vũ, Cát Hải, Hải Phòng',
    workType: 'Full-time',
    salaryRange: '12.000.000 - 15.000.000 đ',
    salaryTier: '12m_15m',
    salaryMin: 12,
    salaryMax: 15,
    experienceLevel: 'Dưới 1 năm',
    tags: ['Hải Phòng', 'Đình Vũ', 'Full-time', 'VinFast'],
    postedDate: 'Hôm nay',
    deadline: '25/11/2026',
    description: 'Kiểm soát chất lượng dây chuyền lắp ráp xe điện và linh kiện công nghệ cao tại tổ hợp sản xuất VinFast Hải Phòng.',
    requirements: [
      'Tốt nghiệp ĐH ngành Kỹ thuật cơ khí, Điện - Điện tử, Quản lý công nghiệp',
      'Cẩn thận, nguyên tắc, hiểu biết về ISO/TS 16949'
    ],
    benefits: [
      'Thu nhập 12 - 15 triệu/tháng + Phụ cấp đi lại',
      'Được làm việc trong tổ hợp nhà máy hiện đại hàng đầu Việt Nam'
    ],
    contactEmail: 'careers@vinfast.vn',
    isStudentFriendly: true,
    recruiterName: 'Phan Tuấn Anh',
    recruiterRole: 'QA Talent Lead'
  }
];
