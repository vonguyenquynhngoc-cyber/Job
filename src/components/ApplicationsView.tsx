import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Video,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  XCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Application, ApplicationStatus } from '../types';

interface ApplicationsViewProps {
  applications: Application[];
  onWithdrawApplication: (appId: string) => void;
  onNavigateToJobs: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({
  applications,
  onWithdrawApplication,
  onNavigateToJobs
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedAppId(expandedAppId === id ? null : id);
  };

  const filteredApps = applications.filter((app) => {
    if (selectedStatus === 'all') return true;
    return app.status === selectedStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return {
          label: 'Đã gửi hồ sơ',
          color: 'bg-[#FAF7F2] text-[#55695D] border-[#DDD5C8]',
          step: 1
        };
      case 'reviewing':
        return {
          label: 'Đang xét duyệt',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          step: 2
        };
      case 'interview':
        return {
          label: 'Được mời phỏng vấn 🎉',
          color: 'bg-[#EAF1EC] text-[#23412E] border-[#2E5339] font-bold ring-1 ring-[#2E5339]/20',
          step: 3
        };
      case 'accepted':
        return {
          label: 'Đã tiếp nhận trúng tuyển',
          color: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
          step: 4
        };
      case 'rejected':
        return {
          label: 'Chưa phù hợp',
          color: 'bg-stone-100 text-stone-600 border-stone-200',
          step: 4
        };
    }
  };

  const interviewCount = applications.filter((a) => a.status === 'interview').length;
  const reviewingCount = applications.filter((a) => a.status === 'reviewing').length;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-[#E0D8CC] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E5339] text-white flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1B2A20]">
              Theo dõi tiến độ ứng tuyển ({applications.length})
            </h1>
          </div>
          <p className="text-xs text-[#5E7164] mt-1">
            Kiểm tra trạng thái hồ sơ trực tiếp từ nhà tuyển dụng: Đã gửi, Đang xét duyệt hoặc Lịch hẹn phỏng vấn.
          </p>
        </div>

        {/* Highlight notification if there are interviews */}
        {interviewCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EAF1EC] border border-[#2E5339] text-[#23412E] text-xs font-bold shrink-0 shadow-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-[#2E5339]" />
            <span>Bạn có {interviewCount} lời mời phỏng vấn!</span>
          </div>
        )}
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Tất cả', count: applications.length },
          {
            id: 'submitted',
            label: 'Đã gửi hồ sơ',
            count: applications.filter((a) => a.status === 'submitted').length
          },
          {
            id: 'reviewing',
            label: 'Đang xét duyệt',
            count: reviewingCount
          },
          {
            id: 'interview',
            label: 'Được mời phỏng vấn',
            count: interviewCount
          }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedStatus === tab.id
                ? 'bg-[#2E5339] text-white shadow-xs'
                : 'bg-white text-[#526458] border border-[#E0D8CC] hover:bg-[#FAF7F2]'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedStatus === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#EAE3D6] text-[#4A5D51]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const statusInfo = getStatusBadge(app.status);
            const isExpanded = expandedAppId === app.id;

            return (
              <div
                key={app.id}
                id={`application-item-${app.id}`}
                className="bg-white rounded-3xl border border-[#E0D8CC] hover:border-[#2E5339] p-5 sm:p-6 shadow-xs transition-all space-y-4"
              >
                {/* Header Row: Company, Title, Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs shrink-0"
                      style={{ backgroundColor: app.companyLogoColor || '#284B35' }}
                    >
                      {app.company.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#526458]">
                        <Building className="w-3.5 h-3.5" />
                        <span className="font-semibold">{app.company}</span>
                        {app.location && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-[#9EB0A3]" />
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {app.location}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1B2A20] mt-0.5">
                        {app.jobTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7E72] mt-1">
                        <span>Ngày nộp: <strong>{app.appliedDate}</strong></span>
                        {app.salaryRange && (
                          <>
                            <span>•</span>
                            <span className="font-bold text-[#2E5339]">{app.salaryRange}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 sm:self-start">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs border ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Stepper */}
                <div className="pt-2 pb-1">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Step 1: Đã gửi */}
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          statusInfo.step >= 1 ? 'bg-[#2E5339]' : 'bg-[#E5DFD4]'
                        }`}
                      />
                      <p
                        className={`text-[11px] font-bold ${
                          statusInfo.step >= 1 ? 'text-[#2E5339]' : 'text-[#8A9C90]'
                        }`}
                      >
                        1. Đã gửi hồ sơ
                      </p>
                    </div>

                    {/* Step 2: Đang xét duyệt */}
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          statusInfo.step >= 2 ? 'bg-[#2E5339]' : 'bg-[#E5DFD4]'
                        }`}
                      />
                      <p
                        className={`text-[11px] font-bold ${
                          statusInfo.step >= 2 ? 'text-[#2E5339]' : 'text-[#8A9C90]'
                        }`}
                      >
                        2. Đang xét duyệt
                      </p>
                    </div>

                    {/* Step 3: Phỏng vấn */}
                    <div className="space-y-1">
                      <div
                        className={`h-1.5 rounded-full ${
                          statusInfo.step >= 3 ? 'bg-[#2E5339]' : 'bg-[#E5DFD4]'
                        }`}
                      />
                      <p
                        className={`text-[11px] font-bold ${
                          statusInfo.step >= 3 ? 'text-[#2E5339]' : 'text-[#8A9C90]'
                        }`}
                      >
                        3. Mời phỏng vấn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interview Highlight Callout (If interview scheduled) */}
                {app.status === 'interview' && app.interviewDetails && (
                  <div className="p-4 rounded-2xl bg-[#EAF1EC] border border-[#2E5339] text-[#23412E] space-y-3">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <Video className="w-4 h-4 text-[#2E5339]" />
                      <span>Thông tin lịch hẹn phỏng vấn</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#5A6E60] block">Thời gian:</span>
                        <strong className="text-sm text-[#1A2E20]">
                          {app.interviewDetails.time} - {app.interviewDetails.date}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#5A6E60] block">Hình thức:</span>
                        <strong>{app.interviewDetails.format}</strong>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[#5A6E60] block">Link hoặc Địa điểm:</span>
                        {app.interviewDetails.locationOrLink.startsWith('http') ? (
                          <a
                            href={app.interviewDetails.locationOrLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#2E5339] font-bold underline inline-flex items-center gap-1"
                          >
                            {app.interviewDetails.locationOrLink}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <strong>{app.interviewDetails.locationOrLink}</strong>
                        )}
                      </div>
                      {app.interviewDetails.note && (
                        <div className="sm:col-span-2 bg-white/60 p-2.5 rounded-xl text-[11px] text-[#425547] leading-relaxed">
                          <strong>Lưu ý từ HR:</strong> {app.interviewDetails.note}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* HR Note / Feedback if any */}
                {app.feedbackNote && app.status !== 'interview' && (
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E0D8CC] text-xs text-[#526558] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#2E5339] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#23412E]">Phản hồi từ Nhà tuyển dụng:</strong>{' '}
                      {app.feedbackNote}
                    </div>
                  </div>
                )}

                {/* Collapsible Details: Cover Letter & CV link */}
                <div className="pt-2 border-t border-[#F0EAE0] flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleExpand(app.id)}
                    className="inline-flex items-center gap-1.5 font-bold text-[#2E5339] hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{isExpanded ? 'Thu gọn thư giới thiệu' : 'Xem lại thư giới thiệu đã gửi'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Bạn có chắc muốn rút hồ sơ ứng tuyển vị trí ${app.jobTitle}?`)) {
                        onWithdrawApplication(app.id);
                      }
                    }}
                    className="text-xs text-[#8A9C90] hover:text-red-600 transition-colors"
                  >
                    Rút hồ sơ
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E3DDD1] text-xs space-y-2 animate-in fade-in duration-150">
                    <p className="font-bold text-[#23412E]">Nội dung thư giới thiệu (Cover Letter):</p>
                    <p className="text-[#43564A] leading-relaxed whitespace-pre-line">
                      {app.coverLetter}
                    </p>
                    {app.portfolioUrl && (
                      <p className="pt-2 text-[11px] text-[#55695D]">
                        Link đính kèm:{' '}
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2E5339] underline"
                        >
                          {app.portfolioUrl}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-[#E0D8CC] p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#E5DEC0] flex items-center justify-center mx-auto text-[#798C80]">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1D2C22]">
              Chưa có hồ sơ ứng tuyển nào
            </h3>
            <p className="text-xs text-[#5D6F63] mt-1 leading-relaxed">
              Hãy duyệt danh sách việc làm phù hợp và bấm "Ứng tuyển trực tuyến" để gửi hồ sơ đến nhà tuyển dụng.
            </p>
          </div>
          <button
            onClick={onNavigateToJobs}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#2E5339] text-white hover:bg-[#23412E] transition-all"
          >
            <span>Tìm việc làm ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
