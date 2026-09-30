import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  FileText,
  HelpCircle,
  Briefcase,
  Users,
  ChevronRight,
  X,
  MessageSquareQuote,
  Send,
  CheckCircle2,
  Building,
  Heart
} from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  onNavigateTab: (tab: ActiveTab, filterWorkType?: string) => void;
  onShowToast?: (message: string) => void;
}

type ModalType =
  | 'gioi-thieu'
  | 'cau-hoi-thuong-gap'
  | 'doi-tac'
  | 'trung-tam-tro-giup'
  | 'chinh-sach-bao-mat'
  | 'dieu-khoan-su-dung'
  | 'bao-cao-van-de'
  | 'lien-he-modal'
  | null;

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onShowToast }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [feedbackReport, setFeedbackReport] = useState({ title: '', content: '', email: '' });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackReport.content.trim()) return;
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setFeedbackReport({ title: '', content: '', email: '' });
      setActiveModal(null);
      if (onShowToast) {
        onShowToast('Cảm ơn bạn! Báo cáo của bạn đã được ghi nhận để kiểm tra và xử lý.');
      }
    }, 1500);
  };

  return (
    <>
      <footer className="bg-[#1C2D22] text-[#E7EDE8] border-t border-[#2F4435] mt-12">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Column 1: Brand Info (Spans 4 columns on large screens) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#345B3F] text-white flex items-center justify-center shadow-md border border-[#487355]">
                  <GraduationCap className="w-6 h-6 text-[#B6D9C2]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    JOB – Nền tảng tuyển dụng & việc làm
                  </h3>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#253A2C] border border-[#34513E] inline-block">
                <p className="text-sm font-bold text-[#A7CDB3] italic">
                  “Tìm việc. Tìm người. Tìm đúng cơ hội.”
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#A9BDB0] leading-relaxed">
                JOB kết nối sinh viên và nhà tuyển dụng, giúp quá trình tìm kiếm việc làm và tuyển dụng trở nên nhanh chóng, thuận tiện và phù hợp hơn.
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-[#8BA594]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Hệ thống hoạt động 24/7
                </span>
                <span>•</span>
                <span>Dành riêng cho sinh viên Việt Nam</span>
              </div>
            </div>

            {/* Column 2: Về JOB (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#A7CDB3]">
                Về JOB
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#C4D5CA]">
                <li>
                  <button
                    onClick={() => setActiveModal('gioi-thieu')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Giới thiệu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('lien-he-modal')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Liên hệ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('cau-hoi-thuong-gap')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Câu hỏi thường gặp
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('doi-tac')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Đối tác
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Dành cho ứng viên (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#A7CDB3]">
                Dành cho ứng viên
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#C4D5CA]">
                <li>
                  <button
                    onClick={() => onNavigateTab('jobs')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Tìm việc làm
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab('jobs', 'Part-time')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Việc làm Part-time</span>
                    <span className="text-[10px] bg-[#365940] text-[#B8DFC5] px-1.5 py-0.2 rounded font-bold">Hot</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab('jobs', 'Thực tập')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left flex items-center gap-1.5"
                  >
                    <span>Việc thực tập</span>
                    <span className="text-[10px] bg-[#365940] text-[#B8DFC5] px-1.5 py-0.2 rounded font-bold">2026</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigateTab('profile')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Tạo CV
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Hỗ trợ (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#A7CDB3]">
                Hỗ trợ
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[#C4D5CA]">
                <li>
                  <button
                    onClick={() => setActiveModal('trung-tam-tro-giup')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Trung tâm trợ giúp
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('chinh-sach-bao-mat')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Chính sách bảo mật
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('dieu-khoan-su-dung')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left"
                  >
                    Điều khoản sử dụng
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('bao-cao-van-de')}
                    className="hover:text-white hover:underline underline-offset-4 transition-colors text-left text-amber-300/90 hover:text-amber-200"
                  >
                    Báo cáo vấn đề
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Liên hệ (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#A7CDB3]">
                Liên hệ
              </h4>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#C4D5CA]">
                <a
                  href="mailto:job@gmail.com"
                  className="flex items-start gap-2 hover:text-white transition-colors group"
                >
                  <Mail className="w-4 h-4 text-[#A7CDB3] shrink-0 mt-0.5 group-hover:text-white" />
                  <span className="break-all font-medium">Email: job@gmail.com</span>
                </a>
                <a
                  href="tel:0966014967"
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#A7CDB3] shrink-0 group-hover:text-white" />
                  <span className="font-medium">Hotline: 0966014967</span>
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#A7CDB3] shrink-0 mt-0.5" />
                  <span className="font-medium">Địa chỉ: Đồng Nai, Việt Nam</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Terms Bar */}
        <div className="border-t border-[#293E30] bg-[#16241B]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#95AAA0]">
            <div>
              © 2026 JOB – Nền tảng tuyển dụng & việc làm.
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveModal('chinh-sach-bao-mat')}
                className="hover:text-white transition-colors"
              >
                Chính sách bảo mật
              </button>
              <span>·</span>
              <button
                onClick={() => setActiveModal('dieu-khoan-su-dung')}
                className="hover:text-white transition-colors"
              >
                Điều khoản sử dụng
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Info Modals */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white text-[#1C2B22] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E0D8CC] overflow-hidden my-auto max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#FAF7F2] border-b border-[#E0D8CC] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#23412E] text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-4 h-4 text-[#A5C7B2]" />
                </div>
                <h3 className="font-bold text-base text-[#1E2E23]">
                  {activeModal === 'gioi-thieu' && 'Về JOB – Nền tảng tuyển dụng & việc làm'}
                  {activeModal === 'lien-he-modal' && 'Thông tin liên hệ JOB'}
                  {activeModal === 'cau-hoi-thuong-gap' && 'Câu hỏi thường gặp (FAQ)'}
                  {activeModal === 'doi-tac' && 'Chương trình đối tác tuyển dụng'}
                  {activeModal === 'trung-tam-tro-giup' && 'Trung tâm trợ giúp ứng viên & nhà tuyển dụng'}
                  {activeModal === 'chinh-sach-bao-mat' && 'Chính sách bảo mật thông tin'}
                  {activeModal === 'dieu-khoan-su-dung' && 'Điều khoản sử dụng dịch vụ'}
                  {activeModal === 'bao-cao-van-de' && 'Báo cáo vấn đề & Đóng góp ý kiến'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-xl text-[#677A6E] hover:text-[#1C2B22] hover:bg-[#E8E1D5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto text-xs sm:text-sm text-[#46574C] leading-relaxed space-y-4">
              {activeModal === 'gioi-thieu' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#EBF3ED] border border-[#C5DDD0] text-[#1D3B26]">
                    <strong className="block text-sm mb-1 font-extrabold">Tìm việc. Tìm người. Tìm đúng cơ hội.</strong>
                    JOB được thành lập với sứ mệnh kết nối sinh viên và các nhà tuyển dụng chất lượng cao, xóa bỏ rào cản thiếu kinh nghiệm và tạo môi trường minh bạch cho người trẻ phát triển sự nghiệp.
                  </div>
                  <h4 className="font-bold text-[#1C2B22] text-sm">Điểm nổi bật của JOB:</h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>100% tin tuyển dụng được kiểm duyệt rõ ràng về mức lương, địa chỉ và phúc lợi.</li>
                    <li>Bộ lọc chuyên biệt cho sinh viên: Việc part-time linh hoạt giờ học, thực tập có phụ cấp và hỗ trợ mộc thực tập tốt nghiệp.</li>
                    <li>Hệ sinh thái tự điền hồ sơ năng lực (CV) chuyên nghiệp, nộp đơn 1-chạm không qua trung gian.</li>
                    <li>Dành cho nhà tuyển dụng: Đăng tin nhanh, lọc ứng viên theo lĩnh vực, bằng cấp và kinh nghiệm nổi bật.</li>
                  </ul>
                </div>
              )}

              {activeModal === 'lien-he-modal' && (
                <div className="space-y-4">
                  <p>Mọi thắc mắc, đề xuất hợp tác tuyển dụng hoặc phản ánh chất lượng dịch vụ, vui lòng liên hệ:</p>
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E0D8CC] space-y-3 font-medium">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#2E5339]" />
                      <span>Email: <a href="mailto:job@gmail.com" className="text-[#2E5339] font-bold hover:underline">job@gmail.com</a></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-[#2E5339]" />
                      <span>Hotline hỗ trợ: <a href="tel:0966014967" className="text-[#2E5339] font-bold hover:underline">0966014967</a> (8:00 - 18:00 thứ 2 - thứ 7)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#2E5339]" />
                      <span>Văn phòng đại diện: Đồng Nai, Việt Nam</span>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'cau-hoi-thuong-gap' && (
                <div className="space-y-4">
                  <div className="border border-[#E0D8CC] rounded-2xl p-4 bg-[#FAF7F2]">
                    <h5 className="font-bold text-[#1C2B22] mb-1">1. Sinh viên chưa có kinh nghiệm có thể tìm việc trên JOB không?</h5>
                    <p>Hoàn toàn có thể! JOB tập hợp hàng trăm vị trí thực tập sinh (Intern), nhân viên học việc, và việc làm bán thời gian thân thiện với sinh viên không yêu cầu kinh nghiệm trước đó.</p>
                  </div>
                  <div className="border border-[#E0D8CC] rounded-2xl p-4 bg-[#FAF7F2]">
                    <h5 className="font-bold text-[#1C2B22] mb-1">2. Ứng tuyển trên nền tảng có mất phí không?</h5>
                    <p>Không. Tất cả tính năng tạo CV, tìm kiếm việc làm và ứng tuyển trực tuyến đều hoàn toàn miễn phí 100% dành cho ứng viên.</p>
                  </div>
                  <div className="border border-[#E0D8CC] rounded-2xl p-4 bg-[#FAF7F2]">
                    <h5 className="font-bold text-[#1C2B22] mb-1">3. Nhà tuyển dụng quản lý và duyệt hồ sơ như thế nào?</h5>
                    <p>Nhà tuyển dụng có tab "Nhà tuyển dụng" riêng để đăng tin, xem hồ sơ ứng viên gửi về, lọc theo bằng cấp/kinh nghiệm nổi bật và xếp lịch hẹn phỏng vấn trực tiếp.</p>
                  </div>
                </div>
              )}

              {activeModal === 'doi-tac' && (
                <div className="space-y-4">
                  <p>JOB hân hạnh đồng hành cùng hơn 250+ doanh nghiệp, tập đoàn công nghệ và các trường đại học tại khu vực phía Nam và toàn quốc.</p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl border border-[#E0D8CC] bg-[#FAF7F2] text-center font-bold text-xs text-[#2E5339]">
                      Hợp tác tuyển dụng doanh nghiệp
                    </div>
                    <div className="p-3 rounded-xl border border-[#E0D8CC] bg-[#FAF7F2] text-center font-bold text-xs text-[#2E5339]">
                      Ngày hội việc làm sinh viên
                    </div>
                    <div className="p-3 rounded-xl border border-[#E0D8CC] bg-[#FAF7F2] text-center font-bold text-xs text-[#2E5339]">
                      Tiếp nhận sinh viên thực tập
                    </div>
                    <div className="p-3 rounded-xl border border-[#E0D8CC] bg-[#FAF7F2] text-center font-bold text-xs text-[#2E5339]">
                      Tài trợ học bổng & hướng nghiệp
                    </div>
                  </div>
                  <p className="text-xs text-[#63766A]">Để đăng ký gói đối tác tuyển dụng, vui lòng liên hệ hotline 0966014967 hoặc gửi email về job@gmail.com.</p>
                </div>
              )}

              {activeModal === 'trung-tam-tro-giup' && (
                <div className="space-y-3">
                  <p>Chào mừng bạn đến với trung tâm hỗ trợ của JOB. Bạn cần giúp đỡ về nội dung nào?</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        onNavigateTab('profile');
                      }}
                      className="w-full text-left p-3 rounded-xl border border-[#E0D8CC] hover:bg-[#FAF7F2] transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-xs text-[#1C2B22]">Hướng dẫn cập nhật thông tin cá nhân & CV</span>
                      <ChevronRight className="w-4 h-4 text-[#798C80]" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        onNavigateTab('applications');
                      }}
                      className="w-full text-left p-3 rounded-xl border border-[#E0D8CC] hover:bg-[#FAF7F2] transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-xs text-[#1C2B22]">Cách theo dõi tiến độ ứng tuyển & lịch phỏng vấn</span>
                      <ChevronRight className="w-4 h-4 text-[#798C80]" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        onNavigateTab('recruiter');
                      }}
                      className="w-full text-left p-3 rounded-xl border border-[#E0D8CC] hover:bg-[#FAF7F2] transition-colors flex items-center justify-between"
                    >
                      <span className="font-semibold text-xs text-[#1C2B22]">Dành cho nhà tuyển dụng: Đăng bài & lọc ứng viên</span>
                      <ChevronRight className="w-4 h-4 text-[#798C80]" />
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'chinh-sach-bao-mat' && (
                <div className="space-y-3 text-xs leading-relaxed text-[#4A5D50]">
                  <p><strong>1. Thu thập thông tin:</strong> Chúng tôi chỉ thu thập các thông tin cần thiết do bạn chủ động cung cấp (Họ tên, email, số điện thoại, kinh nghiệm, bằng cấp) phục vụ việc ứng tuyển và tuyển dụng.</p>
                  <p><strong>2. Mục đích sử dụng:</strong> Thông tin của bạn chỉ được chuyển tiếp đến đúng nhà tuyển dụng khi bạn nhấn "Xác nhận nộp hồ sơ ứng tuyển".</p>
                  <p><strong>3. Quyền riêng tư:</strong> JOB cam kết không bán, không thương mại hóa dữ liệu cá nhân của ứng viên cho bất kỳ bên thứ ba quảng cáo nào.</p>
                  <p><strong>4. Quyền tự chỉnh sửa:</strong> Bạn có toàn quyền cập nhật, thay đổi hoặc xóa bỏ thông tin cá nhân trong tab Hồ sơ năng lực bất kỳ lúc nào.</p>
                </div>
              )}

              {activeModal === 'dieu-khoan-su-dung' && (
                <div className="space-y-3 text-xs leading-relaxed text-[#4A5D50]">
                  <p><strong>1. Tính trung thực:</strong> Người dùng cam kết cung cấp thông tin trung thực về học vấn, kỹ năng và kinh nghiệm trong hồ sơ ứng tuyển.</p>
                  <p><strong>2. Nghiêm cấm hành vi gian lận:</strong> Nghiêm cấm các bài đăng tuyển dụng thu phí đặt cọc bất hợp pháp, việc làm lừa đảo hoặc vi phạm pháp luật Việt Nam.</p>
                  <p><strong>3. Trách nhiệm nhà tuyển dụng:</strong> Nhà tuyển dụng có trách nhiệm bảo mật thông tin hồ sơ của ứng viên và chỉ sử dụng cho mục đích phỏng vấn.</p>
                  <p><strong>4. Thay đổi điều khoản:</strong> JOB có quyền cập nhật điều khoản để bảo vệ quyền lợi sinh viên và người tìm việc một cách tốt nhất.</p>
                </div>
              )}

              {activeModal === 'bao-cao-van-de' && (
                <div>
                  {reportSubmitted ? (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#2E5339] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-sm text-[#1C2B22]">Đã gửi báo cáo thành công!</h4>
                      <p className="text-xs text-[#5C6E62]">Bộ phận kỹ thuật và chăm sóc khách hàng JOB sẽ kiểm tra ngay lập tức.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleReportSubmit} className="space-y-3">
                      <p className="text-xs text-[#526457]">
                        Nếu bạn phát hiện tin tuyển dụng có dấu hiệu lừa đảo, lỗi hiển thị hoặc cần góp ý tính năng, vui lòng gửi phản hồi bên dưới:
                      </p>
                      <div>
                        <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                          Tiêu đề vấn đề
                        </label>
                        <input
                          type="text"
                          required
                          value={feedbackReport.title}
                          onChange={(e) => setFeedbackReport({ ...feedbackReport, title: e.target.value })}
                          placeholder="Ví dụ: Tin tuyển dụng nghi ngờ thu phí, lỗi giao diện..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                          Email của bạn để nhận phản hồi
                        </label>
                        <input
                          type="email"
                          value={feedbackReport.email}
                          onChange={(e) => setFeedbackReport({ ...feedbackReport, email: e.target.value })}
                          placeholder="email@gmail.com"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#1C2B22] mb-1">
                          Nội dung chi tiết
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={feedbackReport.content}
                          onChange={(e) => setFeedbackReport({ ...feedbackReport, content: e.target.value })}
                          placeholder="Mô tả cụ thể vấn đề bạn gặp phải..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC2] focus:outline-none focus:ring-2 focus:ring-[#2E5339]"
                        />
                      </div>
                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveModal(null)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#57695D] hover:bg-[#F2ECE1]"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] transition-all flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Gửi phản ánh
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
