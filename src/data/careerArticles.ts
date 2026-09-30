export interface CareerArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  icon: string;
  summary: string;
  content: {
    heading: string;
    points: string[];
    tip?: string;
  }[];
}

export const CAREER_ARTICLES: CareerArticle[] = [
  {
    id: 'cv-5-dieu-can-co',
    title: '5 điều cần có trong một CV dành cho sinh viên',
    subtitle: 'Những nội dung quan trọng giúp CV của bạn trở nên rõ ràng và chuyên nghiệp hơn.',
    category: 'Mẹo viết CV',
    readTime: '5 phút đọc',
    date: 'Tháng 9, 2026',
    icon: 'FileText',
    summary: 'Đối với sinh viên chưa có nhiều năm kinh nghiệm, việc xây dựng một bản CV súc tích, làm nổi bật được năng lực học vấn và các hoạt động trải nghiệm thực tế là chìa khóa mở rộng cơ hội phỏng vấn.',
    content: [
      {
        heading: '1. Thông tin liên hệ chuẩn mực và chuyên nghiệp',
        points: [
          'Họ và tên viết hoa rõ ràng, số điện thoại chính chủ luôn sẵn sàng nhận cuộc gọi.',
          'Sử dụng địa chỉ email nghiêm túc (ví dụ: nguyenvanan.career@gmail.com), tuyệt đối tránh các biệt danh tuổi học trò.',
          'Đính kèm liên kết LinkedIn hoặc Portfolio cá nhân/GitHub nếu ứng tuyển ngành công nghệ, thiết kế.',
          'Địa chỉ cư trú ngắn gọn (Quận/Huyện, Tỉnh/TP) giúp nhà tuyển dụng ước lượng khoảng cách đi lại.'
        ],
        tip: '💡 Không cần ghi số CMND/CCCD hay tình trạng hôn nhân trong CV xin việc.'
      },
      {
        heading: '2. Mục tiêu nghề nghiệp (Career Objective) ngắn gọn, định hướng rõ ràng',
        points: [
          'Gói gọn trong 2 - 3 câu súc tích: Bạn là ai, điểm mạnh nổi bật là gì và bạn muốn đóng góp giá trị gì cho doanh nghiệp.',
          'Nêu rõ vị trí mong muốn (Thực tập sinh Marketing, Lập trình viên Frontend Part-time...).',
          'Tránh viết sáo rỗng như "Mong muốn học hỏi mọi thứ", hãy nhấn mạnh "Áp dụng kiến thức chuyên ngành để hỗ trợ dự án thực tế".'
        ]
      },
      {
        heading: '3. Quá trình học tập & Thành tích học thuật (GPA, Học bổng)',
        points: [
          'Ghi rõ Tên trường Đại học/Cao đẳng, Chuyên ngành và Niên khóa dự kiến tốt nghiệp.',
          'Nếu GPA từ 3.0/4.0 trở lên hoặc thuộc Top lớp, hãy tự tin đưa vào CV.',
          'Đề cập các học bổng khuyến khích học tập, giải thưởng nghiên cứu khoa học hoặc cuộc thi sinh viên cấp trường/toàn quốc.'
        ]
      },
      {
        heading: '4. Dự án môn học & Hoạt động Đoàn - Hội / Câu lạc bộ',
        points: [
          'Đây là "vũ khí thay thế kinh nghiệm" tốt nhất của sinh viên!',
          'Dự án học kỳ: Nêu rõ vai trò của bạn, công nghệ/công cụ sử dụng và kết quả đạt được.',
          'Hoạt động ngoại khóa: Tham gia ban tổ chức sự kiện, ban truyền thông câu lạc bộ thể hiện kỹ năng làm việc nhóm, giao tiếp và quản lý thời gian.'
        ],
        tip: '💡 Dùng con số cụ thể: "Thu hút 500+ sinh viên tham dự hội thảo", "Xây dựng website bán hàng gồm 4 trang chức năng".'
      },
      {
        heading: '5. Kỹ năng chuyên môn & Kỹ năng mềm kèm minh chứng',
        points: [
          'Kỹ năng cứng/công cụ: Tin học văn phòng (Excel nâng cao), Canva, Figma, Photoshop, Git, SQL...',
          'Kỹ năng mềm: Giao tiếp, giải quyết vấn đề, tinh thần trách nhiệm và khả năng thích ứng linh hoạt với môi trường mới.',
          'Ngoại ngữ: Chứng chỉ TOEIC, IELTS, HSK hoặc khả năng đọc hiểu tài liệu chuyên ngành.'
        ]
      }
    ]
  },
  {
    id: 'chuan-bi-phong-van-dau-tien',
    title: 'Cách chuẩn bị cho buổi phỏng vấn đầu tiên',
    subtitle: 'Những điều cần chuẩn bị trước khi gặp nhà tuyển dụng và những câu hỏi thường gặp.',
    category: 'Kỹ năng phỏng vấn',
    readTime: '7 phút đọc',
    date: 'Tháng 9, 2026',
    icon: 'Users',
    summary: 'Buổi phỏng vấn đầu tiên có thể khiến bạn hồi hộp, nhưng sự chuẩn bị chu đáo sẽ giúp bạn biến sự lo lắng thành phong thái tự tin, chuyên nghiệp trước nhà tuyển dụng.',
    content: [
      {
        heading: '1. Nghiên cứu kỹ về doanh nghiệp và mô tả công việc (JD)',
        points: [
          'Tìm hiểu website, fanpage, các sản phẩm/dịch vụ cốt lõi mà công ty đang cung cấp.',
          'Nắm rõ giá trị cốt lõi và phong cách văn hóa làm việc của công ty.',
          'Đọc kỹ lại bản mô tả công việc (JD) để đối chiếu những yêu cầu của họ với thế mạnh của bạn.'
        ],
        tip: '💡 Nhà tuyển dụng luôn đánh giá cao ứng viên hiểu rõ công ty họ đang làm gì và tại sao muốn gia nhập.'
      },
      {
        heading: '2. Luyện tập câu hỏi kinh điển: "Hãy giới thiệu về bản thân bạn"',
        points: [
          'Áp dụng công thức Hiện tại - Quá khứ - Tương lai trong 1.5 - 2 phút.',
          'Hiện tại: Bạn đang là sinh viên năm mấy, chuyên ngành gì tại trường nào.',
          'Quá khứ: Điểm sáng trong học tập, dự án hoặc hoạt động ngoại khóa có liên quan mật thiết đến vị trí ứng tuyển.',
          'Tương lai: Lý do bạn hào hứng và mục tiêu khi ứng tuyển vào vị trí này tại công ty.'
        ]
      },
      {
        heading: '3. Chuẩn bị các câu trả lời tình huống bằng mô hình STAR',
        points: [
          'Situation (Bối cảnh): Nêu ngắn gọn tình huống bạn gặp phải trong dự án trường lớp hay công việc cũ.',
          'Task (Nhiệm vụ): Trách nhiệm cụ thể của bạn khi đó là gì.',
          'Action (Hành động): Bạn đã làm gì để giải quyết vấn đề (chủ động, chi tiết).',
          'Result (Kết quả): Kết quả đo lường được và bài học rút ra.'
        ]
      },
      {
        heading: '4. Tác phong, trang phục và sự chuẩn bị kỹ thuật',
        points: [
          'Phỏng vấn trực tiếp: Đến sớm 10 - 15 phút, trang phục lịch sự (áo sơ mi, quần tây/váy công sở trang nhã), mang theo 2 bản CV in sẵn.',
          'Phỏng vấn online: Kiểm tra kết nối mạng, micro, webcam, chọn không gian yên tĩnh và ánh sáng tốt trước 15 phút.'
        ]
      },
      {
        heading: '5. Đặt câu hỏi thông minh ngược lại cho nhà tuyển dụng',
        points: [
          'Một ứng viên chủ động luôn chuẩn bị 2 - 3 câu hỏi vào cuối buổi phỏng vấn.',
          '"Trong 3 tháng đầu, một thực tập sinh xuất sắc ở vị trí này thường đạt được những mốc nào ạ?"',
          '"Công ty có lộ trình đào tạo hoặc phân công người hướng dẫn (mentor) cho sinh viên không ạ?"',
          '"Bước tiếp theo trong quy trình tuyển dụng sẽ diễn ra như thế nào ạ?"'
        ],
        tip: '💡 Tránh hỏi ngay về chế độ nghỉ phép hay việc được về sớm trong câu hỏi đầu tiên.'
      }
    ]
  },
  {
    id: 'tim-viec-part-time-lich-hoc',
    title: 'Cách tìm việc Part-time phù hợp với lịch học',
    subtitle: 'Bí quyết lựa chọn công việc phù hợp mà vẫn đảm bảo thời gian học tập.',
    category: 'Cân bằng học tập',
    readTime: '4 phút đọc',
    date: 'Tháng 9, 2026',
    icon: 'Clock',
    summary: 'Đi làm thêm mang lại thu nhập và kinh nghiệm quý giá, nhưng làm thế nào để việc làm thêm không làm ảnh hưởng đến điểm số và sức khỏe của bạn?',
    content: [
      {
        heading: '1. Đặt mục tiêu học tập là ưu tiên số một',
        points: [
          'Xác định rõ ràng: Tấm bằng đại học và kiến thức nền tảng là hành trang dài hạn quan trọng nhất.',
          'Tính toán số giờ học trên lớp, giờ tự học và làm bài tập lớn trước khi quyết định nhận số ca làm.',
          'Tổng thời gian làm thêm cho sinh viên khuyến nghị không nên vượt quá 20 - 24 giờ mỗi tuần.'
        ]
      },
      {
        heading: '2. Lựa chọn công việc có tính linh hoạt theo ca sinh viên',
        points: [
          'Ưu tiên những nơi cho phép đăng ký ca làm hàng tuần (part-time theo ca 4h, ca tối, hoặc cuối tuần).',
          'Thỏa thuận rõ ràng ngay từ buổi phỏng vấn về lịch thi cử định kỳ để được hỗ trợ đổi ca khi cần.',
          'Tìm kiếm công việc gần trường học hoặc nơi cư trú để tiết kiệm thời gian di chuyển.'
        ],
        tip: '💡 Các công việc như trợ giảng, gia sư, thu ngân, barista, nhân viên bán hàng chuỗi thường có cơ chế đổi ca sinh viên linh động.'
      },
      {
        heading: '3. Ưu tiên công việc bổ trợ kỹ năng cho ngành học tương lai',
        points: [
          'Sinh viên Ngoại ngữ/Sư phạm: Trợ giảng trung tâm tiếng Anh, gia sư, biên dịch viên part-time.',
          'Sinh viên Kinh tế/Marketing: Quản trị fanpage, viết content, chăm sóc khách hàng, telesales học kỹ năng giao tiếp.',
          'Sinh viên CNTT: Hỗ trợ kỹ thuật IT Helpdesk part-time, lập trình viên thực tập bán thời gian.'
        ]
      },
      {
        heading: '4. Quản lý thời gian bằng công cụ thông minh',
        points: [
          'Sử dụng Google Calendar hoặc Notion để lên lịch biểu cố định cho từng tuần.',
          'Quy tắc khối thời gian (Time-blocking): Giờ nào việc nấy, khi học tập trung 100%, khi làm việc hết mình.',
          'Dành ít nhất 1 ngày hoặc các buổi tối chủ nhật để nghỉ ngơi tái tạo năng lượng.'
        ]
      }
    ]
  },
  {
    id: 'bi-quyet-viet-cover-letter',
    title: 'Bí quyết viết thư ứng tuyển (Cover Letter) gây ấn tượng mạnh',
    subtitle: 'Làm thế nào để lá thư ngắn gọn biến hồ sơ của bạn thành ứng viên nổi bật trong mắt HR.',
    category: 'Mẹo xin việc',
    readTime: '6 phút đọc',
    date: 'Tháng 9, 2026',
    icon: 'Mail',
    summary: 'Một lá Cover Letter chân thành, súc tích chỉ ra chính xác lý do bạn phù hợp với công ty sẽ giúp bạn vượt qua hàng trăm hồ sơ ứng tuyển khác.',
    content: [
      {
        heading: '1. Cấu trúc chuẩn 3 đoạn của một Cover Letter',
        points: [
          'Đoạn mở đầu: Vị trí bạn ứng tuyển, bạn biết đến cơ hội này từ đâu và một câu thể hiện sự hào hứng.',
          'Đoạn thân bài: 2 - 3 điểm mạnh tiêu biểu gắn liền trực tiếp với yêu cầu của công việc.',
          'Đoạn kết thúc: Lời cảm ơn, lời khẳng định sự sẵn sàng cho buổi phỏng vấn và thông tin liên hệ.'
        ]
      },
      {
        heading: '2. Tùy biến Cover Letter cho từng doanh nghiệp cụ thể',
        points: [
          'Tuyệt đối không dùng 1 mẫu thư chung gửi hàng loạt cho 20 công ty khác nhau.',
          'Nhắc đến tên công ty và sản phẩm cụ thể của họ để chứng tỏ bạn đã dành thời gian nghiên cứu thực sự.'
        ]
      }
    ]
  },
  {
    id: 'sinh-vien-chua-kinh-nghiem-ghi-diem',
    title: 'Sinh viên chưa có kinh nghiệm: Làm sao để ghi điểm với nhà tuyển dụng?',
    subtitle: 'Chuyển hóa tinh thần học hỏi, trách nhiệm và tiềm năng thành thế mạnh cạnh tranh.',
    category: 'Phát triển bản thân',
    readTime: '5 phút đọc',
    date: 'Tháng 9, 2026',
    icon: 'Sparkles',
    summary: 'Nhà tuyển dụng khi tuyển sinh viên thực tập không kỳ vọng bạn là chuyên gia, họ tìm kiếm thái độ nhiệt huyết, tư duy nhanh nhạy và sự chỉn chu.',
    content: [
      {
        heading: '1. Thái độ và tinh thần trách nhiệm là chìa khóa vàng',
        points: [
          'Đúng giờ trong mọi lịch hẹn và phản hồi email nhanh chóng, lịch sự.',
          'Tinh thần chủ động đặt câu hỏi khi chưa hiểu rõ vấn đề thay vì giấu dốt.',
          'Sự cầu tiến và sẵn sàng tiếp thu những góp ý mang tính xây dựng từ cấp trên và đồng nghiệp.'
        ]
      },
      {
        heading: '2. Làm nổi bật các dự án cá nhân thực tế',
        points: [
          'Tự xây dựng một blog cá nhân, một trang fanpage nhỏ hoặc một sản phẩm mẫu chứng minh bạn có đam mê thực sự.',
          'Chủ động học thêm các khóa học trực tuyến uy tín (Coursera, Udemy, Google Garage) để cập nhật kiến thức mới nhất.'
        ]
      }
    ]
  }
];
