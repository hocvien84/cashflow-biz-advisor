'use client';

import React, { useState } from 'react';
import {
  AreaIntelligenceRecord,
  IkigaiUserInput,
  LeadUser,
  ScoredRecommendation,
} from '@/types/business';
import {
  CheckCircle2,
  Download,
  FileText,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  X,
} from 'lucide-react';

export interface SmtpClientConfig {
  gmailUser: string;
  gmailAppPassword: string;
  resendApiKey: string;
  webhookUrl: string;
}

export const ADMIN_EMAIL_WHITELIST = ['nghvien@gmail.com', 'vien.nguyenh@gmail.com'];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAIL_WHITELIST.includes(email.trim().toLowerCase());
}

export function triggerPdfDownload(pdfBase64: string, fileName: string) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName || 'Bao-Cao-Tu-Van-Mo-Hinh-Kinh-Doanh.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ============================================================================
// 1. MANDATORY LEAD GATE (REGISTER / LOGIN) BEFORE USING THE ADVISOR
// ============================================================================
export function LeadAuthGate({
  onAuthenticated,
  onOpenAdmin,
  smtpConfig,
}: {
  onAuthenticated: (user: LeadUser) => void;
  onOpenAdmin: () => void;
  smtpConfig: SmtpClientConfig;
}) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [capitalBudgetMilVND, setCapitalBudgetMilVND] = useState<number>(500);
  const [targetArea, setTargetArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (loading) return;
    setErrorMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập địa chỉ Email hợp lệ để nhận file PDF kết quả tư vấn.');
      return;
    }
    if (mode === 'register' && !fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên của bạn.');
      return;
    }
    if (mode === 'register' && !phone.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại / Zalo để hệ thống cá nhân hóa hồ sơ tư vấn.');
      return;
    }

    setLoading(true);
    try {
      // Blur active input first so browser autofill/password manager detaches cleanly before DOM transition
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mode,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim() || '123456',
          capitalBudgetMilVND,
          targetArea: targetArea.trim(),
          webhookUrl: smtpConfig.webhookUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Không thể xác thực tài khoản.');
      }

      const authedUser = data.user as LeadUser;
      try {
        localStorage.setItem('CBA_LEAD_USER', JSON.stringify(authedUser));
      } catch {
        // ignore storage quota errors
      }

      // Defer state transition by 1 frame so browser input/autofill popups close cleanly without crashing DOM
      setTimeout(() => {
        onAuthenticated(authedUser);
      }, 40);
    } catch (err) {
      setErrorMsg((err as Error).message);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <TrendingUp className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-white">
              Cashflow Matrix & Ikigai Biz Advisor
            </span>
            <span className="block text-xs text-emerald-300">
              Hệ thống AI Tư vấn Mô hình Kinh doanh Khai thác Dòng tiền Thực chiến
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl w-full mx-auto my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Pitch Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            Mở khóa Toàn bộ Ma trận 106+ Mô hình + Xuất Báo Cáo PDF Qua Email
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            Tìm Mô Hình Kinh Doanh{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Hái Ra Dòng Tiền
            </span>{' '}
            Khớp Với Mặt Bằng & Nguồn Lực Của Bạn
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Đăng ký tài khoản bằng Email trong 15 giây để sử dụng bộ công cụ phân tích mặt bằng
            Google Maps bán kính 0.2–2km, đối chiếu báo cáo P&L từ các chuỗi niêm yết Châu Á và nhận{' '}
            <strong className="text-emerald-300">
              Bản Báo Cáo Tư Vấn Đầu Tư (File PDF) gửi thẳng về Email của bạn
            </strong>
            .
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {[
              {
                title: 'Ma trận 8 Độ tuổi × 6 Nhu cầu Maslow',
                desc: '106+ mô hình từ Trẻ sơ sinh, Học sinh, Gia đình trẻ đến Cao tuổi & Thú cưng (Giá rẻ • Bình dân • Cao cấp).',
              },
              {
                title: 'Quét Google Maps 0.2km – 2.0km',
                desc: 'Tự động đếm Trường học, Chung cư, Bệnh viện, Chợ, Văn phòng và phân tích thu nhập cư dân địa phương.',
              },
              {
                title: 'Chấm điểm Ikigai & Nguồn lực cá nhân',
                desc: 'Khớp số vốn hiện có, sở trường, năng lực công nghệ và mối quan hệ đối tác để chọn mô hình tỷ lệ thắng cao nhất.',
              },
              {
                title: 'Xuất PDF Báo cáo P&L & Gửi qua Email',
                desc: 'Tự động tổng hợp bảng tính Doanh thu, Giá vốn, Thuê nhà, Lãi ròng (EBITDA), Thời gian hoàn vốn thành file PDF.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/75 border border-slate-800/90 flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-white">{item.title}</div>
                  <div className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Card */}
        <div className="lg:col-span-5">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 bg-slate-100 p-1.5 border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition ${
                  mode === 'register'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✨ Đăng ký Tài khoản mới
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition ${
                  mode === 'login'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔑 Đăng nhập bằng Email
              </button>
            </div>

            <div onKeyDown={handleKeyDown} className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {mode === 'register'
                    ? 'Tạo tài khoản nhận Tư vấn & Báo cáo PDF'
                    : 'Đăng nhập vào Hệ thống Tư vấn'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mode === 'register'
                    ? 'Kết quả tư vấn & bảng tính P&L sẽ được xuất thành file PDF gửi qua Email này.'
                    : 'Nhập email và mật khẩu bạn đã đăng ký để tiếp tục.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  <span>⚠️ {errorMsg}</span>
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Họ và tên của bạn <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="lead_fullname"
                      autoComplete="off"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Địa chỉ Email (Nhận file PDF Báo cáo) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="lead_email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: nguyenvanan@gmail.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Số điện thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      name="lead_phone"
                      autoComplete="off"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="VD: 0901234567"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mã bảo mật / Mật khẩu <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="lead_passcode"
                    autoComplete="off"
                    style={{ WebkitTextSecurity: 'disc' } as React.CSSProperties}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu để bảo mật tài khoản..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vốn đầu tư dự kiến (Triệu)
                    </label>
                    <div className="relative">
                      <Wallet className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="number"
                        min={20}
                        max={50000}
                        step={50}
                        value={capitalBudgetMilVND}
                        onChange={(e) => setCapitalBudgetMilVND(Number(e.target.value) || 300)}
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-semibold text-emerald-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Khu vực muốn kinh doanh
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="lead_area"
                        autoComplete="off"
                        value={targetArea}
                        onChange={(e) => setTargetArea(e.target.value)}
                        placeholder="VD: Cầu Giấy, Hà Nội"
                        className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span>Đang khởi tạo hồ sơ tư vấn...</span>
                ) : mode === 'register' ? (
                  <>
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Mở Khóa Công Cụ Tư Vấn & Nhận Báo Cáo PDF</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <span>Đăng Nhập Vào Hệ Thống</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Thông tin của bạn được bảo mật và chỉ dùng để gửi File PDF kết quả phân tích mô
                hình kinh doanh.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-slate-500 py-2">
        © 2026 Cashflow Matrix & Ikigai Biz Advisor • Dữ liệu P&L tham chiếu từ các chuỗi niêm yết
        Châu Á & thị trường Việt Nam
      </div>
    </div>
  );
}

// ============================================================================
// 2. EMAIL PDF REPORT GENERATOR & SENDER BANNER (INSIDE TAB 4)
// ============================================================================
export function EmailPdfActionCard({
  currentUser,
  areaRecord,
  ikigai,
  recommendations,
  smtpConfig,
}: {
  currentUser: LeadUser;
  areaRecord: AreaIntelligenceRecord | null;
  ikigai: IkigaiUserInput;
  recommendations: ScoredRecommendation[];
  smtpConfig: SmtpClientConfig;
}) {
  const [recipientEmail, setRecipientEmail] = useState(currentUser.email);
  const [sending, setSending] = useState(false);
  const [statusResult, setStatusResult] = useState<{
    emailSent: boolean;
    deliveryMethod: string;
    emailError?: string;
    fileName: string;
    pdfBase64: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateAndSend = async (autoDownload = false) => {
    setSending(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: {
            fullName: currentUser.fullName,
            email: recipientEmail.trim() || currentUser.email,
            phone: currentUser.phone,
          },
          areaRecord,
          ikigai,
          recommendations: recommendations.slice(0, 5),
          smtpConfig,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Lỗi khi tạo báo cáo PDF');
      }

      setStatusResult(data);
      // Always download PDF if requested OR if email server wasn't configured yet so user immediately gets their PDF
      if (autoDownload || !data.emailSent) {
        triggerPdfDownload(data.pdfBase64, data.fileName);
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-emerald-500/30">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <FileText className="w-3.5 h-3.5" />
            XUẤT HỒ SƠ TƯ VẤN ĐẦU TƯ PDF & GỬI EMAIL TỰ ĐỘNG
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Nhận Bản Báo Cáo Phân Tích Mô Hình Dòng Tiền & P&L (File PDF)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Báo cáo PDF bao gồm: Hồ sơ nguồn lực của <strong>{currentUser.fullName}</strong>, Phân
            tích mật độ khách hàng trong bán kính{' '}
            <strong>{areaRecord ? `${areaRecord.radiusKm}km` : '1.0km'}</strong> tại{' '}
            <strong>{areaRecord?.locationName || 'khu vực mục tiêu'}</strong>, Top 5 mô hình phù hợp
            nhất và Bảng dự toán dòng tiền P&L.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Email nhận báo cáo PDF..."
              className="w-full sm:w-64 pl-9 pr-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-600 text-white text-xs sm:text-sm focus:border-emerald-400 outline-none"
            />
          </div>

          <button
            type="button"
            disabled={sending}
            onClick={() => handleGenerateAndSend(false)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Đang tạo PDF & Gửi...' : 'Gửi PDF Qua Email'}
          </button>

          <button
            type="button"
            disabled={sending}
            onClick={() => handleGenerateAndSend(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Tải PDF Ngay
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs">
          ⚠️ {errorMsg}
        </div>
      )}

      {statusResult && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            {statusResult.emailSent ? (
              <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Đã gửi thành công email kèm file đính kèm ({statusResult.fileName}) tới hộp thư{' '}
                <span className="underline">{recipientEmail}</span>!
              </div>
            ) : (
              <div className="text-amber-300 font-semibold">
                ✅ Đã xuất thành công file <strong>{statusResult.fileName}</strong> và tự động tải
                về máy của bạn!
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => triggerPdfDownload(statusResult.pdfBase64, statusResult.fileName)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 font-semibold shrink-0 flex items-center gap-1.5 self-start sm:self-center"
          >
            <Download className="w-3.5 h-3.5" />
            Tải lại file PDF
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 3. ADMIN LEAD CRM & EMAIL SMTP CONFIG MODAL
// ============================================================================
export function AdminLeadCrmModal({
  isOpen,
  onClose,
  currentUserEmail,
  smtpConfig,
  onSaveSmtpConfig,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail?: string;
  smtpConfig: SmtpClientConfig;
  onSaveSmtpConfig: (cfg: SmtpClientConfig) => void;
}) {
  const [adminPassword, setAdminPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<LeadUser[]>([]);
  const [envStatus, setEnvStatus] = useState<{
    hasGmailSmtp: boolean;
    gmailUser: string;
    hasResendApi: boolean;
    hasWebhookUrl: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'settings'>('leads');

  const [draftConfig, setDraftConfig] = useState<SmtpClientConfig>(smtpConfig);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen || !isAdminEmail(currentUserEmail)) return null;

  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: currentUserEmail,
          adminPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Mật khẩu không đúng');
      }
      setLeads(data.leads || []);
      setEnvStatus(data.envStatus || null);
      setAuthenticated(true);
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Họ và Tên',
      'Email',
      'Số Điện Thoại',
      'Vốn Dự Kiến (Triệu VNĐ)',
      'Khu Vực Mục Tiêu',
      'Các Tọa Độ Đã Quét',
      'Top Mô Hình Tư Vấn',
      'Số Lần Gửi PDF',
      'Ngày Tạo',
      'Hoạt Động Cuối',
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      l.email,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      l.capitalBudgetMilVND,
      `"${(l.targetArea || '').replace(/"/g, '""')}"`,
      `"${(l.scannedLocations || []).join(' | ').replace(/"/g, '""')}"`,
      `"${(l.topRecommendedModels || []).join(' | ').replace(/"/g, '""')}"`,
      l.reportSentCount || 0,
      l.createdAt,
      l.lastActiveAt,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh-Sach-Lead-Khach-Hang-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">
                Quản Trị Lead Khách Hàng (CRM) & Cấu Hình Email Tự Động
              </h3>
              <p className="text-xs text-slate-400">
                Xem danh sách người dùng đăng ký, xuất file Excel/CSV và cài đặt Gmail gửi PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!authenticated ? (
          <form onSubmit={handleLoginAdmin} className="p-6 max-w-md mx-auto space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900">Nhập mật khẩu Quản trị viên</h4>
              <p className="text-xs text-slate-500">
                Mật khẩu mặc định là <code className="bg-slate-100 px-1.5 py-0.5 rounded font-bold">admin123</code>{' '}
                (Bạn có thể đổi bằng biến <code className="bg-slate-100 px-1 rounded">ADMIN_PASSWORD</code> trên Vercel).
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                ⚠️ {errorMsg}
              </div>
            )}

            <input
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Nhập mật khẩu Admin (Mặc định: admin123)"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition"
            >
              {loading ? 'Đang kiểm tra...' : 'Truy cập Bảng Quản Trị Lead'}
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Sub-navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubTab('leads')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activeSubTab === 'leads'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Danh sách Lead ({leads.length})
                </button>
                <button
                  onClick={() => setActiveSubTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                    activeSubTab === 'settings'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Cấu hình Gửi Email PDF & Google Sheets Webhook
                </button>
              </div>

              {activeSubTab === 'leads' && (
                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Xuất Excel / CSV ({leads.length} khách)
                </button>
              )}
            </div>

            {activeSubTab === 'leads' ? (
              leads.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  Chưa có khách hàng nào đăng ký trong phiên hiện tại.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                        <th className="p-3 font-bold">Khách hàng</th>
                        <th className="p-3 font-bold">Email & SĐT</th>
                        <th className="p-3 font-bold">Vốn dự kiến</th>
                        <th className="p-3 font-bold">Khu vực / Địa điểm quét</th>
                        <th className="p-3 font-bold">Top Mô hình quan tâm</th>
                        <th className="p-3 font-bold">Báo cáo PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {leads.map((lead) => (
                        <tr key={lead.email} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">
                            {lead.fullName}
                            <div className="text-[11px] font-normal text-slate-400">
                              {new Date(lead.createdAt).toLocaleString('vi-VN')}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-emerald-700">{lead.email}</div>
                            <div className="text-slate-500">{lead.phone || '—'}</div>
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            {lead.capitalBudgetMilVND.toLocaleString('vi-VN')} Tr
                          </td>
                          <td className="p-3 text-slate-600 max-w-xs">
                            {lead.scannedLocations?.length
                              ? lead.scannedLocations.join('; ')
                              : lead.targetArea || '—'}
                          </td>
                          <td className="p-3 text-slate-700 max-w-xs">
                            {lead.topRecommendedModels?.length
                              ? lead.topRecommendedModels.slice(0, 3).join(', ')
                              : 'Đang xem ma trận'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full font-semibold ${
                                lead.reportSentCount > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              Đã gửi: {lead.reportSentCount || 0} lần
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                  <div className="font-bold text-sm">
                    💡 Hướng dẫn kích hoạt Gửi Email PDF Tự Động 100% Miễn Phí qua Gmail:
                  </div>
                  <p>
                    1. Truy cập tài khoản Google của bạn tại{' '}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-bold text-emerald-700"
                    >
                      myaccount.google.com/apppasswords
                    </a>{' '}
                    (Mật khẩu ứng dụng / App Passwords).
                  </p>
                  <p>
                    2. Tạo một mật khẩu ứng dụng tên là <strong>Cashflow Advisor</strong>, Google sẽ
                    cấp cho bạn chuỗi <strong>16 ký tự</strong>.
                  </p>
                  <p>
                    3. Nhập địa chỉ Gmail và 16 ký tự đó vào ô bên dưới (hoặc thêm biến môi trường{' '}
                    <code>GMAIL_USER</code> và <code>GMAIL_APP_PASSWORD</code> trong mục{' '}
                    <strong>Settings → Environment Variables</strong> trên Vercel). Khi khách bấm
                    nhận báo cáo, cả khách hàng VÀ hộp thư Gmail của bạn đều sẽ nhận được file PDF!
                  </p>
                </div>

                {envStatus && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block">Trạng thái Gmail trên Vercel:</span>
                      <strong className={envStatus.hasGmailSmtp ? 'text-emerald-600' : 'text-amber-600'}>
                        {envStatus.hasGmailSmtp
                          ? `Đã cấu hình (${envStatus.gmailUser})`
                          : 'Chưa đặt biến môi trường'}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block">Resend API trên Vercel:</span>
                      <strong className={envStatus.hasResendApi ? 'text-emerald-600' : 'text-slate-600'}>
                        {envStatus.hasResendApi ? 'Đã kết nối' : 'Chưa dùng (Tùy chọn)'}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 block">Webhook Google Sheets:</span>
                      <strong className={envStatus.hasWebhookUrl ? 'text-emerald-600' : 'text-slate-600'}>
                        {envStatus.hasWebhookUrl ? 'Đã kết nối' : 'Chưa đặt trên Vercel'}
                      </strong>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Gmail Gửi Báo Cáo (`GMAIL_USER`)
                    </label>
                    <input
                      type="email"
                      value={draftConfig.gmailUser}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, gmailUser: e.target.value })
                      }
                      placeholder="VD: hotro.tencongty@gmail.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật khẩu ứng dụng Gmail 16 ký tự (`GMAIL_APP_PASSWORD`)
                    </label>
                    <input
                      type="password"
                      value={draftConfig.gmailAppPassword}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, gmailAppPassword: e.target.value })
                      }
                      placeholder="xxxx xxxx xxxx xxxx"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Hoặc Resend API Key (`RESEND_API_KEY` - Tùy chọn)
                    </label>
                    <input
                      type="password"
                      value={draftConfig.resendApiKey}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, resendApiKey: e.target.value })
                      }
                      placeholder="re_xxxxxxxxxxxx..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Webhook URL đẩy Lead về Google Sheets / Make / Zapier (`LEAD_WEBHOOK_URL`)
                    </label>
                    <input
                      type="url"
                      value={draftConfig.webhookUrl}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, webhookUrl: e.target.value })
                      }
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onSaveSmtpConfig(draftConfig);
                      setSavedNotice(true);
                      setTimeout(() => setSavedNotice(false), 3000);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    Lưu Cấu Hình Trực Tiếp
                  </button>
                  {savedNotice && (
                    <span className="text-xs font-bold text-emerald-600">
                      ✅ Đã lưu cấu hình Email & Webhook!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 4. TOP USER PILL IN HEADER
// ============================================================================
export function LoggedInUserBar({
  user,
  onLogout,
  onOpenAdmin,
}: {
  user: LeadUser;
  onLogout: () => void;
  onOpenAdmin: () => void;
}) {
  const isAdmin = isAdminEmail(user.email);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 text-xs">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="font-semibold text-white">{user.fullName}</span>
        <span className="text-slate-400 hidden sm:inline">({user.email})</span>
      </div>
      {isAdmin && (
        <button
          type="button"
          onClick={onOpenAdmin}
          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
          title="Quản trị Lead (Admin CRM)"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Admin CRM</span>
        </button>
      )}
      <button
        type="button"
        onClick={onLogout}
        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-xs flex items-center gap-1 transition"
        title="Đăng xuất tài khoản"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Đổi TK</span>
      </button>
    </div>
  );
}
