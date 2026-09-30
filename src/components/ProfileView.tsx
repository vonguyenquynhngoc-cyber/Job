import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Link2,
  Plus,
  Trash2,
  Save,
  Printer,
  CheckCircle2,
  Eye,
  Edit3,
  Sparkles,
  Calendar,
  FileText,
  Camera,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  X
} from 'lucide-react';
import {
  CandidateProfile,
  SkillItem,
  EducationItem,
  ExperienceItem,
  CertificateItem,
  PortfolioLink
} from '../types';

interface ProfileViewProps {
  profile: CandidateProfile;
  onUpdateProfile: (updated: CandidateProfile) => void;
}

const PRESET_AVATARS = [
  {
    label: 'Sinh viên Nam 1',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Sinh viên Nữ 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Sinh viên Nam 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    label: 'Sinh viên Nữ 2',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  }
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'edit' | 'preview'>('edit');
  const [formData, setFormData] = useState<CandidateProfile>(profile);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New item draft states
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Cơ bản' | 'Khá' | 'Thành thạo'>('Khá');
  const [newSkillCat, setNewSkillCat] = useState<'Chuyên môn' | 'Kỹ năng mềm'>('Chuyên môn');

  const [newCertName, setNewCertName] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('2025');

  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Handle local image file upload
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh dung lượng dưới 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({ ...prev, avatarUrl: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setFormData((prev) => ({ ...prev, avatarUrl: customAvatarUrl.trim() }));
      setCustomAvatarUrl('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
  };

  // Reset all profile inputs to blank
  const handleResetToBlank = () => {
    if (window.confirm('Bạn có muốn làm mới toàn bộ thông tin cá nhân và liên hệ về dạng ô trống không nhập sẵn?')) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        location: '',
        currentTitle: '',
        industry: '',
        highestDegree: '',
        experienceYears: '',
        avatarUrl: '',
        bio: '',
        desiredJob: '',
        desiredSalary: '',
        desiredWorkType: '',
        skills: [],
        education: [],
        experience: [],
        certificates: [],
        portfolioLinks: []
      });
    }
  };

  // Calculate completeness percentage
  const calculateCompleteness = () => {
    let score = 0;
    if (formData.fullName && formData.email && formData.phone) score += 30;
    if (formData.bio) score += 15;
    if (formData.education.length > 0) score += 20;
    if (formData.skills.length >= 3) score += 15;
    if (formData.experience.length > 0) score += 10;
    if (formData.portfolioLinks.length > 0 || formData.certificates.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  // Skill Handlers
  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: SkillItem = {
      id: 'skill-' + Date.now(),
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCat
    };
    setFormData({
      ...formData,
      skills: [...formData.skills, newSkill]
    });
    setNewSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s.id !== id)
    });
  };

  // Education Handlers
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: 'edu-' + Date.now(),
      school: '',
      major: '',
      degree: 'Cử nhân / Kỹ sư',
      startYear: '2022',
      endYear: '2026',
      gpa: '',
      description: ''
    };
    setFormData({
      ...formData,
      education: [...formData.education, newEdu]
    });
  };

  const handleUpdateEducation = (id: string, field: keyof EducationItem, val: string) => {
    setFormData({
      ...formData,
      education: formData.education.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    });
  };

  const handleRemoveEducation = (id: string) => {
    setFormData({
      ...formData,
      education: formData.education.filter((e) => e.id !== id)
    });
  };

  // Experience Handlers
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: 'exp-' + Date.now(),
      company: '',
      position: '',
      startDate: '2025',
      endDate: 'Hiện tại',
      current: true,
      description: ''
    };
    setFormData({
      ...formData,
      experience: [...formData.experience, newExp]
    });
  };

  const handleUpdateExperience = (
    id: string,
    field: keyof ExperienceItem,
    val: string | boolean
  ) => {
    setFormData({
      ...formData,
      experience: formData.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e))
    });
  };

  const handleRemoveExperience = (id: string) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((e) => e.id !== id)
    });
  };

  // Certificate Handlers
  const handleAddCertificate = () => {
    if (!newCertName.trim()) return;
    const newCert: CertificateItem = {
      id: 'cert-' + Date.now(),
      name: newCertName.trim(),
      issuer: newCertIssuer.trim() || 'Tổ chức cấp chứng chỉ',
      year: newCertYear
    };
    setFormData({
      ...formData,
      certificates: [...formData.certificates, newCert]
    });
    setNewCertName('');
    setNewCertIssuer('');
  };

  const handleRemoveCertificate = (id: string) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((c) => c.id !== id)
    });
  };

  // Portfolio Links Handlers
  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    const newLink: PortfolioLink = {
      id: 'link-' + Date.now(),
      title: newLinkTitle.trim() || 'Liên kết dự án',
      url: newLinkUrl.trim()
    };
    setFormData({
      ...formData,
      portfolioLinks: [...formData.portfolioLinks, newLink]
    });
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleRemoveLink = (id: string) => {
    setFormData({
      ...formData,
      portfolioLinks: formData.portfolioLinks.filter((l) => l.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Profile Summary Bar */}
      <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#23412E] text-white font-extrabold text-2xl flex items-center justify-center shadow-xs shrink-0 overflow-hidden border-2 border-[#E0D8CC]">
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt={formData.fullName || 'Avatar'}
                className="w-full h-full object-cover"
              />
            ) : formData.fullName ? (
              formData.fullName.trim().split(' ').slice(-1)[0][0]?.toUpperCase() || 'U'
            ) : (
              <User className="w-8 h-8 text-white/80" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A291F]">
                {formData.fullName || 'Hồ sơ ứng viên (Chưa nhập tên)'}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF1EC] text-[#23412E] font-bold">
                Sinh viên tìm việc
              </span>
            </div>
            <p className="text-xs text-[#596C5E] mt-0.5">
              {formData.currentTitle || formData.desiredJob || 'Vui lòng cập nhật họ tên, ảnh đại diện và thông tin liên hệ'}
            </p>
          </div>
        </div>

        {/* Profile Completeness Gauge */}
        <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E5DEC0] min-w-[260px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-[#23412E] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2E5339]" />
              Độ hoàn thiện hồ sơ
            </span>
            <span className="font-extrabold text-[#2E5339]">{completeness}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#E6E0D4] overflow-hidden">
            <div
              className="h-full bg-[#2E5339] rounded-full transition-all duration-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
          <p className="text-[11px] text-[#697B6F] mt-1">
            {completeness >= 80
              ? '✨ Hồ sơ rất đầy đủ và tạo ấn tượng tốt với nhà tuyển dụng!'
              : 'Nhập thông tin cá nhân và tải ảnh đại diện để tăng cơ hội trúng tuyển.'}
          </p>
        </div>
      </div>

      {/* Tabs Switcher: Edit vs Preview */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#EFEAE0] p-1 rounded-2xl border border-[#E0D8CC]">
          <button
            id="profile-edit-tab-btn"
            onClick={() => setActiveSubTab('edit')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'edit'
                ? 'bg-[#2E5339] text-white shadow-xs'
                : 'text-[#54665A] hover:text-[#1E2D23]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Chỉnh sửa hồ sơ
          </button>
          <button
            id="profile-preview-tab-btn"
            onClick={() => setActiveSubTab('preview')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'preview'
                ? 'bg-[#2E5339] text-white shadow-xs'
                : 'text-[#54665A] hover:text-[#1E2D23]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Xem trước CV chuẩn
          </button>
        </div>

        {activeSubTab === 'edit' ? (
          <div className="flex items-center gap-2">
            <button
              id="reset-profile-blank-btn"
              onClick={handleResetToBlank}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#D5CDC0] bg-white text-[#65786B] hover:bg-[#FAF7F2] hover:text-red-600 transition-all"
              title="Làm mới tất cả ô về dạng trống"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm mới ô trống
            </button>
            <button
              id="save-profile-btn"
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] shadow-xs transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu thay đổi hồ sơ
            </button>
          </div>
        ) : (
          <button
            id="print-cv-btn"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[#2E5339] text-[#2E5339] hover:bg-[#EAF1EC] transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            In hoặc Lưu PDF
          </button>
        )}
      </div>

      {/* Success Toast */}
      {isSavedToast && (
        <div className="p-3 rounded-2xl bg-[#EAF1EC] border border-[#CADBCF] text-[#23412E] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#2E5339]" />
          Hồ sơ của bạn đã được lưu thành công vào hệ thống. Các lượt ứng tuyển tiếp theo sẽ sử dụng thông tin này!
        </div>
      )}

      {/* SUB-VIEW 1: FORM EDITING */}
      {activeSubTab === 'edit' && (
        <div className="space-y-6">
          {/* Section 1: Thông tin cơ bản & Ảnh đại diện */}
          <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE0]">
              <h2 className="text-base font-bold text-[#1D2C22] flex items-center gap-2">
                <User className="w-4 h-4 text-[#2E5339]" />
                1. Ảnh đại diện & Thông tin cá nhân (Dạng ô trống người dùng tự nhập)
              </h2>
              <span className="text-[11px] text-[#6E8074] font-medium hidden sm:inline">
                * Không điền sẵn dữ liệu, người dùng tự do nhập thông tin của mình
              </span>
            </div>

            {/* Avatar & Identity Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8E1D5] flex flex-col md:flex-row items-start md:items-center gap-5">
              {/* Avatar Preview Box */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-[#2E5339] overflow-hidden bg-white shadow-xs flex flex-col items-center justify-center text-center">
                  {formData.avatarUrl ? (
                    <img
                      src={formData.avatarUrl}
                      alt="Ảnh đại diện"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-[#7C8F82]">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-semibold">Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                {formData.avatarUrl && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white shadow-xs hover:bg-red-700 transition-colors"
                    title="Xóa ảnh này"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Avatar Actions & Identity Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      formData.avatarUrl
                        ? 'bg-[#EAF1EC] text-[#23412E] border border-[#CADBCF]'
                        : 'bg-[#FFF6E5] text-[#915B00] border border-[#FFE0A3]'
                    }`}
                  >
                    {formData.avatarUrl ? '✓ Đã có ảnh đại diện rõ nét' : '⚠ Chưa tải ảnh đại diện'}
                  </span>
                  <span className="text-[11px] text-[#718478]">
                    (Khuyến nghị dùng ảnh chân dung rõ mặt, hỗ trợ file JPG, PNG, WebP)
                  </span>
                </div>

                {/* Upload Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] transition-all shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Tải ảnh từ máy tính / điện thoại
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#D5CDC0] bg-white text-[#34483B] hover:bg-[#F2ECE1] transition-all"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#2E5339]" />
                    {showUrlInput ? 'Ẩn ô nhập link' : 'Nhập URL ảnh'}
                  </button>
                </div>

                {/* Optional URL Input */}
                {showUrlInput && (
                  <div className="flex items-center gap-2 max-w-md pt-1">
                    <input
                      type="url"
                      placeholder="Dán đường link ảnh đại diện (https://...)"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-xl border border-[#D5CDC0] bg-white flex-1 focus:outline-none focus:border-[#2E5339]"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCustomUrl}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#2E5339] text-white hover:bg-[#23412E]"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}

                {/* Preset Avatar Selection */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#5A6D60]">
                    Hoặc chọn ảnh sinh viên mẫu:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: preset.url }))}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all ${
                          formData.avatarUrl === preset.url
                            ? 'border-[#2E5339] ring-2 ring-[#2E5339]/30 scale-110'
                            : 'border-[#D5CDC0] hover:border-[#2E5339]'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-[#1D2C22] block mb-1">
                  Họ và tên của bạn *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nhập họ và tên đầy đủ của bạn (VD: Nguyễn Văn An)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1D2C22] block mb-1">
                  Chức danh / Trạng thái hiện tại *
                </label>
                <input
                  type="text"
                  value={formData.currentTitle}
                  onChange={(e) => setFormData({ ...formData, currentTitle: e.target.value })}
                  placeholder="VD: Sinh viên năm 4 CNTT, Thực tập sinh Marketing..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Email liên hệ *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập địa chỉ email (VD: sinhvien@gmail.com)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại (VD: 0912 345 678)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Ngày sinh
                </label>
                <input
                  type="text"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Giới tính
                </label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                >
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Nơi ở hiện tại
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="VD: Cầu Giấy, Hà Nội hoặc Quận 1, TP. HCM..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#23412E] block mb-1">
                  Lĩnh vực / Ngành nghề chuyên môn
                </label>
                <select
                  value={formData.industry || ''}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                >
                  <option value="">-- Chọn lĩnh vực chuyên môn --</option>
                  <option value="Công nghệ thông tin">Công nghệ thông tin (IT / Phần mềm)</option>
                  <option value="Marketing / Truyền thông">Marketing / Truyền thông / Digital Ads</option>
                  <option value="Thiết kế / Đồ họa / UI-UX">Thiết kế / Đồ họa / UI-UX</option>
                  <option value="Kinh doanh / Bán hàng">Kinh doanh / Bán hàng / Sales</option>
                  <option value="Tài chính / Kế toán / Ngân hàng">Tài chính / Kế toán / Ngân hàng</option>
                  <option value="Ngôn ngữ / Biên phiên dịch">Ngôn ngữ / Biên phiên dịch</option>
                  <option value="Nhân sự / Hành chính">Nhân sự / Hành chính</option>
                  <option value="Dịch vụ khách hàng">Dịch vụ khách hàng</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#23412E] block mb-1">
                  Trình độ / Bằng cấp cao nhất
                </label>
                <select
                  value={formData.highestDegree || ''}
                  onChange={(e) => setFormData({ ...formData, highestDegree: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                >
                  <option value="">-- Chọn bằng cấp cao nhất --</option>
                  <option value="Tiến sĩ (PhD)">Tiến sĩ (PhD)</option>
                  <option value="Thạc sĩ (Master)">Thạc sĩ (Master)</option>
                  <option value="Cử nhân / Kỹ sư">Cử nhân / Kỹ sư (Đại học)</option>
                  <option value="Cao đẳng">Cao đẳng chính quy</option>
                  <option value="Đang học Đại học / Sinh viên">Đang học Đại học / Sinh viên năm 1-4</option>
                  <option value="Trung cấp nghề">Trung cấp nghề</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#23412E] block mb-1">
                  Kinh nghiệm làm việc tích lũy
                </label>
                <select
                  value={formData.experienceYears || ''}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                >
                  <option value="">-- Chọn mức kinh nghiệm --</option>
                  <option value="Trên 3 năm">Trên 3 năm kinh nghiệm</option>
                  <option value="2 - 3 năm">2 - 3 năm kinh nghiệm</option>
                  <option value="1 - 2 năm">1 - 2 năm kinh nghiệm</option>
                  <option value="Dưới 1 năm">Dưới 1 năm (Mới tốt nghiệp / Đã thực tập)</option>
                  <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm (Sinh viên bắt đầu)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Vị trí mong muốn ứng tuyển
                </label>
                <input
                  type="text"
                  value={formData.desiredJob}
                  onChange={(e) => setFormData({ ...formData, desiredJob: e.target.value })}
                  placeholder="VD: Thực tập sinh Frontend ReactJS, Part-time Content..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Mức lương kỳ vọng
                </label>
                <input
                  type="text"
                  value={formData.desiredSalary}
                  onChange={(e) => setFormData({ ...formData, desiredSalary: e.target.value })}
                  placeholder="VD: 4 - 7 triệu / Thỏa thuận..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Hình thức làm việc mong muốn
                </label>
                <input
                  type="text"
                  value={formData.desiredWorkType}
                  onChange={(e) => setFormData({ ...formData, desiredWorkType: e.target.value })}
                  placeholder="VD: Thực tập / Part-time / Full-time..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                  Giới thiệu bản thân & Mục tiêu nghề nghiệp
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Mô tả ngắn gọn về bản thân, định hướng phát triển và thế mạnh nổi bật của bạn..."
                  className="w-full p-3 text-xs leading-relaxed rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kỹ năng (Skills) */}
          <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#1D2C22] flex items-center gap-2 pb-2 border-b border-[#F0EAE0]">
              <Sparkles className="w-4 h-4 text-[#2E5339]" />
              2. Kỹ năng chuyên môn & Kỹ năng mềm ({formData.skills.length})
            </h2>

            {/* Existing Skills List */}
            {formData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-[#FAF7F2] border-[#E0D8CC] text-xs"
                  >
                    <span className="font-bold text-[#23412E]">{skill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EAE3D6] text-[#55675B]">
                      {skill.level}
                    </span>
                    <span className="text-[10px] text-[#7A8C80]">
                      ({skill.category})
                    </span>
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-[#8E9F94] hover:text-red-500 transition-colors ml-1"
                      title="Xóa kỹ năng này"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#7A8C80] italic py-1">
                Chưa có kỹ năng nào. Nhập tên kỹ năng ở ô bên dưới và bấm "Thêm kỹ năng" để thêm vào hồ sơ.
              </p>
            )}

            {/* Add New Skill Input Bar */}
            <div className="pt-2 border-t border-[#F0EAE0] flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Nhập tên kỹ năng (VD: ReactJS, Figma, Giao tiếp...)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339] flex-1 min-w-[200px]"
              />

              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              >
                <option value="Cơ bản">Cơ bản</option>
                <option value="Khá">Khá</option>
                <option value="Thành thạo">Thành thạo</option>
              </select>

              <select
                value={newSkillCat}
                onChange={(e) => setNewSkillCat(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#2E5339]"
              >
                <option value="Chuyên môn">Chuyên môn</option>
                <option value="Kỹ năng mềm">Kỹ năng mềm</option>
              </select>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#2E5339] text-white hover:bg-[#23412E] flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm kỹ năng
              </button>
            </div>
          </div>

          {/* Section 3: Trình độ học vấn (Education) */}
          <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
              <h2 className="text-base font-bold text-[#1D2C22] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#2E5339]" />
                3. Trình độ học vấn & Trường đại học ({formData.education.length})
              </h2>
              <button
                type="button"
                onClick={handleAddEducation}
                className="text-xs font-bold text-[#2E5339] hover:text-[#23412E] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm trường học
              </button>
            </div>

            {formData.education.length > 0 ? (
              <div className="space-y-4">
                {formData.education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E3DDD1] space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2E5339]">
                        Học vấn #{idx + 1}
                      </span>
                      {formData.education.length > 1 && (
                        <button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Xóa
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Trường Đại học / Cao đẳng
                        </label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)}
                          placeholder="VD: Đại học Bách Khoa, Ngoại Thương..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Chuyên ngành đào tạo
                        </label>
                        <input
                          type="text"
                          value={edu.major}
                          onChange={(e) => handleUpdateEducation(edu.id, 'major', e.target.value)}
                          placeholder="VD: CNTT, Marketing, Kế toán..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Bằng cấp / Trình độ đào tạo
                        </label>
                        <select
                          value={edu.degree || 'Cử nhân'}
                          onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                        >
                          <option value="Cử nhân">Cử nhân (Đại học)</option>
                          <option value="Kỹ sư">Kỹ sư</option>
                          <option value="Thạc sĩ">Thạc sĩ (Master)</option>
                          <option value="Tiến sĩ">Tiến sĩ (PhD)</option>
                          <option value="Cao đẳng">Cao đẳng</option>
                          <option value="Đang học Đại học">Đang học Đại học / Sinh viên</option>
                          <option value="Trung cấp">Trung cấp nghề</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Niên khóa (Bắt đầu - Kết thúc)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={edu.startYear}
                            onChange={(e) =>
                              handleUpdateEducation(edu.id, 'startYear', e.target.value)
                            }
                            placeholder="2022"
                            className="px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white"
                          />
                          <input
                            type="text"
                            value={edu.endYear}
                            onChange={(e) => handleUpdateEducation(edu.id, 'endYear', e.target.value)}
                            placeholder="2026"
                            className="px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Điểm GPA / Xếp loại học lực
                        </label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, 'gpa', e.target.value)}
                          placeholder="VD: 3.4/4.0 (Giỏi) hoặc 8.2/10"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Thành tích / Học bổng / Hoạt động nổi bật
                        </label>
                        <input
                          type="text"
                          value={edu.description || ''}
                          onChange={(e) =>
                            handleUpdateEducation(edu.id, 'description', e.target.value)
                          }
                          placeholder="Học bổng khuyến khích, thành viên câu lạc bộ học thuật..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white focus:outline-none focus:border-[#2E5339]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl bg-[#FAF7F2] border border-dashed border-[#D5CDC0] text-xs space-y-2">
                <p className="text-[#6C7E72] font-semibold">Chưa có thông tin học vấn / trường đại học</p>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2E5339] text-white font-bold text-xs hover:bg-[#23412E] transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm trường học
                </button>
              </div>
            )}
          </div>

          {/* Section 4: Kinh nghiệm & Hoạt động (Experience) */}
          <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE0]">
              <h2 className="text-base font-bold text-[#1D2C22] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#2E5339]" />
                4. Kinh nghiệm làm việc, Thực tập hoặc Hoạt động CLB ({formData.experience.length})
              </h2>
              <button
                type="button"
                onClick={handleAddExperience}
                className="text-xs font-bold text-[#2E5339] hover:text-[#23412E] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm kinh nghiệm
              </button>
            </div>

            {formData.experience.length > 0 ? (
              <div className="space-y-4">
                {formData.experience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E3DDD1] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2E5339]">
                        Kinh nghiệm #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Xóa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Công ty / Tổ chức / Dự án / CLB
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                          placeholder="VD: Dự án Capstone Web, Shopee, CLB Truyền thông..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Vị trí đảm nhiệm
                        </label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                          placeholder="VD: Thực tập sinh Frontend, Cộng tác viên..."
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Thời gian làm việc
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) =>
                              handleUpdateExperience(exp.id, 'startDate', e.target.value)
                            }
                            placeholder="Từ (01/2025)"
                            className="px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white"
                          />
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="Đến (Hiện tại)"
                            className="px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-white"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-[#4C5E52] block mb-1">
                          Mô tả chi tiết công việc & Kết quả đạt được
                        </label>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) =>
                            handleUpdateExperience(exp.id, 'description', e.target.value)
                          }
                          placeholder="Những nhiệm vụ chính đã thực hiện và thành tích đóng góp..."
                          className="w-full p-3 text-xs rounded-xl border border-[#D5CDC0] bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl bg-[#FAF7F2] border border-dashed border-[#D5CDC0] text-xs space-y-2">
                <p className="text-[#6C7E72] font-semibold">Chưa có kinh nghiệm làm việc hoặc hoạt động dự án</p>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2E5339] text-white font-bold text-xs hover:bg-[#23412E] transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm kinh nghiệm
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Chứng chỉ & Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certificates */}
            <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#1D2C22] flex items-center gap-2 pb-2 border-b border-[#F0EAE0]">
                <Award className="w-4 h-4 text-[#2E5339]" />
                5. Chứng chỉ & Ngoại ngữ
              </h2>

              <div className="space-y-2">
                {formData.certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E3DDD1] text-xs"
                  >
                    <div>
                      <p className="font-bold text-[#23412E]">{cert.name}</p>
                      <p className="text-[11px] text-[#697B6F]">
                        {cert.issuer} • {cert.year}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveCertificate(cert.id)}
                      className="text-[#8E9F94] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F0EAE0] space-y-2">
                <input
                  type="text"
                  placeholder="Tên chứng chỉ (VD: IELTS 7.0, MOS Excel...)"
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tổ chức cấp (VD: British Council, Coursera...)"
                    value={newCertIssuer}
                    onChange={(e) => setNewCertIssuer(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                  />
                  <input
                    type="text"
                    placeholder="Năm"
                    value={newCertYear}
                    onChange={(e) => setNewCertYear(e.target.value)}
                    className="w-20 px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCertificate}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-[#EAF1EC] text-[#23412E] hover:bg-[#DFEBE2] transition-colors"
                >
                  + Thêm chứng chỉ
                </button>
              </div>
            </div>

            {/* Portfolio Links */}
            <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#1D2C22] flex items-center gap-2 pb-2 border-b border-[#F0EAE0]">
                <Link2 className="w-4 h-4 text-[#2E5339]" />
                6. Liên kết Portfolio / GitHub / LinkedIn
              </h2>

              <div className="space-y-2">
                {formData.portfolioLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E3DDD1] text-xs"
                  >
                    <div className="truncate mr-2">
                      <p className="font-bold text-[#23412E]">{link.title}</p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-[#2E5339] hover:underline truncate block"
                      >
                        {link.url}
                      </a>
                    </div>
                    <button
                      onClick={() => handleRemoveLink(link.id)}
                      className="text-[#8E9F94] hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#F0EAE0] space-y-2">
                <input
                  type="text"
                  placeholder="Tiêu đề link (VD: GitHub, Portfolio, LinkedIn...)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                />
                <input
                  type="url"
                  placeholder="URL link (https://...)"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5CDC0] bg-[#FAF8F5]"
                />
                <button
                  type="button"
                  onClick={handleAddLink}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-[#EAF1EC] text-[#23412E] hover:bg-[#DFEBE2] transition-colors"
                >
                  + Thêm liên kết sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: PRINTABLE STANDARD CV SHEET */}
      {activeSubTab === 'preview' && (
        <div className="bg-white rounded-3xl border border-[#D5CDC0] shadow-lg max-w-4xl mx-auto overflow-hidden text-[#1E2D23] print:m-0 print:border-none print:shadow-none">
          {/* CV Header Banner */}
          <div className="bg-[#23412E] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Candidate Avatar in CV */}
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-white/10 border-2 border-white/40 overflow-hidden shadow-md flex items-center justify-center shrink-0">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.fullName || 'Ảnh chân dung'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-white/60">
                    <User className="w-7 h-7 mb-1" />
                    <span className="text-[10px] font-medium text-center">Ảnh 3x4</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-white/15 text-[#D1DFD5] font-bold inline-block">
                  HỒ SƠ ỨNG VIÊN / CV
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {formData.fullName || 'Chưa nhập họ tên'}
                </h1>
                <p className="text-xs sm:text-sm text-[#D5E2D9] font-medium">
                  {formData.currentTitle || formData.desiredJob || 'Ứng viên tìm kiếm việc làm'}
                </p>
                {(formData.highestDegree || formData.experienceYears || formData.industry) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {formData.highestDegree && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                        Bằng cấp: {formData.highestDegree}
                      </span>
                    )}
                    {formData.experienceYears && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                        Kinh nghiệm: {formData.experienceYears}
                      </span>
                    )}
                    {formData.industry && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                        Ngành: {formData.industry}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information in Header */}
            <div className="text-xs space-y-1.5 text-[#E6EFEA] shrink-0 border-l border-white/20 pl-4 sm:pl-6">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#A5C7B2]" />
                <span>{formData.email || 'Chưa cập nhật email'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#A5C7B2]" />
                <span>{formData.phone || 'Chưa cập nhật SĐT'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#A5C7B2]" />
                <span>{formData.location || 'Chưa cập nhật địa chỉ'}</span>
              </div>
              {formData.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#A5C7B2]" />
                  <span>{formData.dateOfBirth}</span>
                </div>
              )}
            </div>
          </div>

          {/* CV Two Column Layout */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column: Summary, Education, Experience */}
            <div className="md:col-span-8 space-y-6">
              {/* About Me */}
              {formData.bio && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#23412E] border-b-2 border-[#2E5339] pb-1 mb-2.5 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#2E5339]" />
                    Giới thiệu bản thân
                  </h3>
                  <p className="text-xs text-[#3E4F43] leading-relaxed whitespace-pre-line">
                    {formData.bio}
                  </p>
                </div>
              )}

              {/* Education */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#23412E] border-b-2 border-[#2E5339] pb-1 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#2E5339]" />
                  Trình độ học vấn
                </h3>
                <div className="space-y-4">
                  {formData.education.map((edu) => (
                    <div key={edu.id} className="relative pl-4 border-l-2 border-[#D1DFD5]">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#1C2B22]">
                            {edu.school}
                          </h4>
                          <p className="text-xs text-[#2E5339] font-medium">{edu.major}</p>
                        </div>
                        <span className="text-[11px] text-[#7A8C80] font-medium">
                          {edu.startYear} - {edu.endYear}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-[11px] text-[#55695D] mt-0.5 font-semibold">
                          Điểm tích lũy: {edu.gpa}
                        </p>
                      )}
                      {edu.description && (
                        <p className="text-[11px] text-[#55695D] mt-0.5 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              {formData.experience.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#23412E] border-b-2 border-[#2E5339] pb-1 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#2E5339]" />
                    Kinh nghiệm & Dự án thực tế
                  </h3>
                  <div className="space-y-4">
                    {formData.experience.map((exp) => (
                      <div key={exp.id} className="relative pl-4 border-l-2 border-[#D1DFD5]">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-[#1C2B22]">
                              {exp.position}
                            </h4>
                            <p className="text-xs text-[#2E5339] font-medium">{exp.company}</p>
                          </div>
                          <span className="text-[11px] text-[#7A8C80] font-medium">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4A5D51] mt-1 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Skills, Certificates, Links */}
            <div className="md:col-span-4 space-y-6 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E3DDD1]">
              {/* Skills */}
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#23412E] border-b-2 border-[#2E5339] pb-1 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2E5339]" />
                  Kỹ năng nổi bật
                </h3>
                <div className="space-y-2">
                  {formData.skills.map((skill) => (
                    <div key={skill.id} className="text-xs">
                      <div className="flex justify-between font-semibold text-[#2C3D31] mb-0.5">
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-[#2E5339] font-bold">
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E5DFD4]">
                        <div
                          className="h-full rounded-full bg-[#2E5339]"
                          style={{
                            width:
                              skill.level === 'Thành thạo'
                                ? '90%'
                                : skill.level === 'Khá'
                                ? '70%'
                                : '45%'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              {formData.certificates.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#23412E] border-b-2 border-[#2E5339] pb-1 mb-2.5 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#2E5339]" />
                    Chứng chỉ
                  </h3>
                  <div className="space-y-2 text-xs">
                    {formData.certificates.map((c) => (
                      <div key={c.id}>
                        <p className="font-bold text-[#1C2B22]">{c.name}</p>
                        <p className="text-[11px] text-[#63766A]">
                          {c.issuer} ({c.year})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {formData.portfolioLinks.length > 0 && (
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#23412E] border-b-2 border-[#2E5339] pb-1 mb-2.5 flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-[#2E5339]" />
                    Sản phẩm & Liên kết
                  </h3>
                  <div className="space-y-2 text-xs">
                    {formData.portfolioLinks.map((l) => (
                      <div key={l.id}>
                        <p className="font-semibold text-[#1C2B22]">{l.title}:</p>
                        <a
                          href={l.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#2E5339] hover:underline truncate block"
                        >
                          {l.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom CV Footer */}
          <div className="p-4 bg-[#F2ECE1] border-t border-[#E3DDD1] text-center text-[11px] text-[#697B6F]">
            Hồ sơ được tạo và lưu trữ trên nền tảng tuyển dụng sinh viên <strong>Job</strong>
          </div>
        </div>
      )}
    </div>
  );
};
