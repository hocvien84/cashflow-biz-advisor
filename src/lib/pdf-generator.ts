import { jsPDF } from 'jspdf';
import {
  AreaIntelligenceRecord,
  IkigaiUserInput,
  LeadUser,
  ScoredRecommendation,
} from '@/types/business';
import { AGE_SEGMENTS, MASLOW_NEEDS, PRICE_TIERS } from '@/data/matrix-constants';

let cachedRegularFontBase64: string | null = null;
let cachedMediumFontBase64: string | null = null;

async function loadVietnameseFonts(): Promise<{ regular: string | null; medium: string | null }> {
  if (cachedRegularFontBase64 && cachedMediumFontBase64) {
    return { regular: cachedRegularFontBase64, medium: cachedMediumFontBase64 };
  }

  try {
    const [regRes, medRes] = await Promise.all([
      fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf', {
        signal: AbortSignal.timeout(4500),
      }),
      fetch('https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf', {
        signal: AbortSignal.timeout(4500),
      }),
    ]);

    if (regRes.ok) {
      const buf = Buffer.from(await regRes.arrayBuffer());
      cachedRegularFontBase64 = buf.toString('base64');
    }
    if (medRes.ok) {
      const buf = Buffer.from(await medRes.arrayBuffer());
      cachedMediumFontBase64 = buf.toString('base64');
    }
  } catch {
    // Fallback if offline
  }

  return { regular: cachedRegularFontBase64, medium: cachedMediumFontBase64 };
}

function stripVietnameseFallback(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export interface AdvisoryReportPayload {
  user: Pick<LeadUser, 'fullName' | 'email' | 'phone'>;
  areaRecord: AreaIntelligenceRecord | null;
  ikigai: IkigaiUserInput;
  recommendations: ScoredRecommendation[];
  customSimParams?: {
    capitalMil: number;
    monthlyRevMil: number;
    rentPercent: number;
    cogsPercent: number;
    laborPercent: number;
  };
}

export async function generateAdvisoryPdfBase64(payload: AdvisoryReportPayload): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const fonts = await loadVietnameseFonts();
  const hasVnFont = Boolean(fonts.regular);

  if (fonts.regular) {
    doc.addFileToVFS('Roboto-Regular.ttf', fonts.regular);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
  }
  if (fonts.medium) {
    doc.addFileToVFS('Roboto-Medium.ttf', fonts.medium);
    doc.addFont('Roboto-Medium.ttf', 'Roboto', 'bold');
  } else if (fonts.regular) {
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'bold');
  }

  const fontName = hasVnFont ? 'Roboto' : 'helvetica';
  const txt = (s: string) => (hasVnFont ? s : stripVietnameseFallback(s));

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      // Header bar on continuation pages
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 8, 'F');
      doc.setFont(fontName, 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(203, 213, 225);
      doc.text(txt('CASHFLOW MATRIX & IKIGAI BIZ ADVISOR — BÁO CÁO TƯ VẤN ĐẦU TƯ'), margin, 5.5);
      y = 15;
    }
  };

  // ================= BANNER HEADER =================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setFillColor(16, 185, 129); // emerald-500 accent bar
  doc.rect(0, 36.5, pageWidth, 1.5, 'F');

  doc.setFont(fontName, 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(txt('BÁO CÁO TƯ VẤN MÔ HÌNH KINH DOANH KHAI THÁC DÒNG TIỀN'), margin, 14);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(167, 243, 208);
  doc.text(
    txt('Phân tích Ma trận Tuổi × Nhu cầu Maslow × Định vị Bản đồ 0.2-2km × Ikigai & P&L'),
    margin,
    21
  );

  const dateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    txt(
      `Khách hàng: ${payload.user.fullName} | Email: ${payload.user.email} | SĐT: ${payload.user.phone || 'N/A'}`
    ),
    margin,
    28
  );
  doc.text(txt(`Ngày xuất báo cáo: ${dateStr}`), margin, 33);

  y = 45;

  // ================= SECTION 1: HỒ SƠ NHÀ ĐẦU TƯ & KHU VỰC =================
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'F');

  doc.setFont(fontName, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text(txt('1. TỔNG QUAN NGUỒN LỰC NHÀ ĐẦU TƯ & TỌA ĐỘ KINH DOANH'), margin + 4, y + 6.5);

  doc.setFont(fontName, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const capStr = `${payload.ikigai.capitalBudgetMilVND.toLocaleString('vi-VN')} Triệu VNĐ`;
  const locName = payload.areaRecord?.locationName || 'Chưa chọn điểm cụ thể (Đánh giá chung)';
  const radiusStr = payload.areaRecord ? `${payload.areaRecord.radiusKm} km` : '1.0 km';

  doc.text(txt(`• Vốn đầu tư dự kiến: ${capStr}`), margin + 4, y + 13);
  doc.text(
    txt(
      `• Mức chấp nhận rủi ro: ${
        payload.ikigai.riskTolerance === 'low'
          ? 'An toàn / Giữ vốn'
          : payload.ikigai.riskTolerance === 'medium'
          ? 'Cân bằng'
          : 'Tăng trưởng đột phá'
      } | Năng lực công nghệ: ${payload.ikigai.techCapability.toUpperCase()}`
    ),
    margin + 4,
    y + 18.5
  );
  doc.text(
    txt(`• Đam mê & Sở trường: ${[...payload.ikigai.passions.slice(0, 2), ...payload.ikigai.strongestSkills.slice(0, 2)].join(', ') || 'Tổng hợp'}`),
    margin + 4,
    y + 24
  );
  const locLines = doc.splitTextToSize(
    txt(`• Khu vực phân tích (${radiusStr}): ${locName}`),
    contentWidth - 8
  );
  doc.text(locLines[0] || '', margin + 4, y + 29.5);

  y += 40;

  // ================= SECTION 2: PHÂN TÍCH ĐỊA PHƯƠNG & KHÁCH HÀNG TIỀM NĂNG =================
  if (payload.areaRecord) {
    const area = payload.areaRecord;
    checkPageBreak(42);

    doc.setFont(fontName, 'bold');
    doc.setFontSize(11);
    doc.setTextColor(5, 150, 105); // emerald-600
    doc.text(
      txt(`2. PHÂN TÍCH ĐỊA ĐIỂM & NHÂN KHẨU HỌC BÁN KÍNH ${area.radiusKm}KM`),
      margin,
      y
    );
    y += 5;

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(30, 41, 59);

    const poiSummary = `Trường học: ${area.poiCounts?.school || 0} | Bệnh viện/Y tế: ${
      area.poiCounts?.hospital || 0
    } | Chung cư/KDC: ${area.poiCounts?.apartment || 0} | Chợ/TTTM: ${
      area.poiCounts?.market || 0
    } | Văn phòng: ${area.poiCounts?.office || 0} | Công viên: ${
      area.poiCounts?.park || 0
    } | Du lịch: ${area.poiCounts?.tourism || 0}`;

    doc.text(txt(`• Mật độ điểm thu hút (POI): ${poiSummary}`), margin, y);
    y += 5;

    doc.text(
      txt(
        `• Dân số ước tính trong bán kính: ${(
          area.demographics?.estimatedPopulationInRadius || 28000
        ).toLocaleString('vi-VN')} người (${area.demographics?.populationDensity || 'Mật độ cao'})`
      ),
      margin,
      y
    );
    y += 5;

    doc.text(
      txt(`• Thu nhập bình quân khu vực: ${area.demographics?.avgMonthlyIncomeVND || '12 - 22 triệu VNĐ/tháng'}`),
      margin,
      y
    );
    y += 5;

    const custLines = doc.splitTextToSize(
      txt(`• Chân dung khách hàng tiềm năng nhất: ${area.demographics?.topCustomerSummary || ''}`),
      contentWidth
    );
    doc.text(custLines, margin, y);
    y += custLines.length * 4.5 + 3;
  }

  // ================= SECTION 3: TOP MÔ HÌNH KINH DOANH ĐỀ XUẤT =================
  checkPageBreak(20);
  doc.setFont(fontName, 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(txt('3. TOP MÔ HÌNH KINH DOANH PHÙ HỢP NHẤT VỚI BẠN (CHẤM ĐIỂM ĐA CHIỀU)'), margin, y);
  y += 6;

  const topModels = payload.recommendations.slice(0, 5);

  topModels.forEach((rec, idx) => {
    const m = rec.model;
    checkPageBreak(58);

    // Box background
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(idx === 0 ? 236 : 248, idx === 0 ? 253 : 250, idx === 0 ? 245 : 252);
    doc.roundedRect(margin, y, contentWidth, 53, 2, 2, 'FD');

    // Title + Total Score
    doc.setFont(fontName, 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    const titleStr = txt(`#${idx + 1}. ${m.name} — Độ khớp: ${rec.totalScore}/100 điểm`);
    doc.text(titleStr, margin + 4, y + 6.5);

    // Sub-scores & Tier
    const tierInfo = PRICE_TIERS.find((t) => t.id === m.priceTier)?.label || m.priceTier;
    const ageLabels = m.ageSegments
      .map((a) => AGE_SEGMENTS.find((s) => s.id === a)?.label || a)
      .join(', ');
    const needLabels = m.maslowNeeds
      .map((n) => MASLOW_NEEDS.find((s) => s.id === n)?.label || n)
      .join(' + ');

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(71, 85, 105);
    doc.text(
      txt(
        `Phân khúc: ${tierInfo} | Tệp tuổi: ${ageLabels} | Nhu cầu Maslow: ${needLabels} (Điểm Vị trí: ${rec.locationScore} • Ikigai: ${rec.ikigaiScore} • Nguồn lực: ${rec.resourceScore})`
      ),
      margin + 4,
      y + 12
    );

    // P&L Core Metrics bar
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 4, y + 14.5, contentWidth - 8, 13, 1.5, 1.5, 'F');

    doc.setFont(fontName, 'bold');
    doc.setFontSize(8.3);
    doc.setTextColor(5, 150, 105);
    const netProfitMil = Math.round((m.pnl.avgMonthlyRevenueVND * m.pnl.netMarginPercent) / 100);
    doc.text(
      txt(
        `Vốn đầu tư (CAPEX): ${m.pnl.initialCapexMinVND}-${m.pnl.initialCapexMaxVND} Tr | Doanh thu TB: ${m.pnl.avgMonthlyRevenueVND} Tr/tháng | Lãi ròng (Net ${m.pnl.netMarginPercent}%): ~${netProfitMil} Tr/tháng | Hoàn vốn: ${m.pnl.paybackMonthsMin}-${m.pnl.paybackMonthsMax} tháng`
      ),
      margin + 6,
      y + 19.8
    );

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(
      txt(
        `Cấu trúc P&L: Giá vốn (COGS) ${m.pnl.cogsPercent}% • Lãi gộp ${m.pnl.grossMarginPercent}% • Thuê mặt bằng ${m.pnl.rentPercent}% • Nhân sự ${m.pnl.laborPercent}% • OPEX/MKT ${m.pnl.opexMarketingPercent}% • AOV ${m.pnl.averageOrderValueVND}k`
      ),
      margin + 6,
      y + 25
    );

    // Exemplars & Match Reasons
    const vnEx = (m.exemplarsVN || []).join(', ');
    const asiaEx = (m.exemplarsAsia || [])
      .map((a) => `${a.name} (${a.country} - ${a.tickerOrStatus})`)
      .join('; ');

    const exLine = doc.splitTextToSize(
      txt(`• Hình mẫu thành công: VN [${vnEx}] | Châu Á [${asiaEx}]`),
      contentWidth - 8
    );
    doc.text(exLine[0] || '', margin + 4, y + 32.5);

    const reasonText = (rec.matchReasons || []).slice(0, 2).join(' | ');
    const reasonLines = doc.splitTextToSize(
      txt(`• Lý do phù hợp: ${reasonText}`),
      contentWidth - 8
    );
    doc.text(reasonLines.slice(0, 2), margin + 4, y + 37.5);

    const actionText = (rec.actionPlan || []).slice(0, 2).join(' -> ');
    const actionLines = doc.splitTextToSize(
      txt(`• Hành động triển khai: ${actionText}`),
      contentWidth - 8
    );
    doc.setFont(fontName, 'bold');
    doc.setTextColor(30, 58, 138);
    doc.text(actionLines[0] || '', margin + 4, y + 48.5);

    y += 57;
  });

  // ================= SECTION 4: BẢNG MÔ PHỎNG P&L CHI TIẾT CHO MÔ HÌNH SỐ 1 =================
  if (topModels.length > 0) {
    const best = topModels[0].model;
    checkPageBreak(48);

    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'F');

    doc.setFont(fontName, 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(52, 211, 153);
    doc.text(
      txt(`4. BẢNG DỰ TOÁN DÒNG TIỀN (P&L) MÔ HÌNH ĐỀ XUẤT #1: ${best.name.toUpperCase()}`),
      margin + 4,
      y + 7
    );

    const rev = payload.customSimParams?.monthlyRevMil ?? best.pnl.avgMonthlyRevenueVND;
    const cap =
      payload.customSimParams?.capitalMil ??
      Math.round((best.pnl.initialCapexMinVND + best.pnl.initialCapexMaxVND) / 2);
    const cogsP = payload.customSimParams?.cogsPercent ?? best.pnl.cogsPercent;
    const rentP = payload.customSimParams?.rentPercent ?? best.pnl.rentPercent;
    const laborP = payload.customSimParams?.laborPercent ?? best.pnl.laborPercent;
    const opexP = best.pnl.opexMarketingPercent;
    const netP = Math.max(0, 100 - cogsP - rentP - laborP - opexP);
    const netProfit = Math.round((rev * netP) / 100);
    const payback = netProfit > 0 ? (cap / netProfit).toFixed(1) : 'N/A';

    doc.setFont(fontName, 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(241, 245, 249);
    doc.text(
      txt(
        `• Vốn đầu tư ban đầu (CAPEX): ${cap} Triệu VNĐ   |   Doanh thu kỳ vọng/tháng: ${rev} Triệu VNĐ`
      ),
      margin + 4,
      y + 14
    );
    doc.text(
      txt(
        `• Giá vốn hàng bán (${cogsP}%): -${Math.round((rev * cogsP) / 100)} Tr   |   Thuê mặt bằng (${rentP}%): -${Math.round((rev * rentP) / 100)} Tr   |   Nhân sự (${laborP}%): -${Math.round((rev * laborP) / 100)} Tr`
      ),
      margin + 4,
      y + 20
    );
    doc.text(
      txt(
        `• LỢI NHUẬN RÒNG BỎ TÚI (EBITDA ${netP}%): +${netProfit} Triệu VNĐ/tháng (~${(
          netProfit * 12
        ).toLocaleString('vi-VN')} Triệu VNĐ/năm) | Thời gian hoàn vốn: ~${payback} tháng`
      ),
      margin + 4,
      y + 26.5
    );

    const citeLines = doc.splitTextToSize(
      txt(`• Nguồn tham chiếu P&L: ${best.pnl.dataSourceCitation}`),
      contentWidth - 8
    );
    doc.setFontSize(7.8);
    doc.setTextColor(148, 163, 184);
    doc.text(citeLines.slice(0, 2), margin + 4, y + 33);
  }

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont(fontName, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      txt(
        `Cashflow Matrix & Ikigai Biz Advisor • Trang ${i}/${totalPages} • Báo cáo tạo tự động dành riêng cho ${payload.user.email}`
      ),
      margin,
      pageHeight - 6
    );
  }

  // Return pure base64 string (without data:application/pdf;base64, prefix)
  const dataUri = doc.output('datauristring');
  const commaIdx = dataUri.indexOf(',');
  return commaIdx !== -1 ? dataUri.slice(commaIdx + 1) : dataUri;
}
