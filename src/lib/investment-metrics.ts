import { PnLProfile, MaslowNeedId, PriceTierId } from '@/types/business';

export interface VietnamInvestmentMetrics {
  /** Biên lợi nhuận ròng thực tế sau khấu hao tại VN (%) */
  netMarginVNPercent: number;
  /** Lợi nhuận ròng bỏ túi trung bình mỗi tháng (Triệu VNĐ) */
  monthlyNetProfitMil: number;
  /** Lợi nhuận ròng thực tế 1 năm (Tính 11 tháng hiệu dụng sau trừ mùa thấp điểm Tết/Hè tại VN) */
  annualNetProfitMil: number;
  /** Vốn đầu tư tài sản ban đầu trung bình - CAPEX (Triệu VNĐ) */
  avgCapexMil: number;
  /** Vốn đặt cọc mặt bằng (3-6 tháng) + Vốn lưu động/Tồn kho ban đầu chuẩn VN (Triệu VNĐ) */
  depositAndWorkingCapMil: number;
  /** Tổng vốn đầu tư thực tế nhà đầu tư phải bỏ ra (CAPEX + Cọc MB + Vốn lưu động) */
  totalInvestmentMil: number;
  /** Tổng giá trị Tài sản vận hành (Tài sản cố định + Thiết bị + Tồn kho + Cọc) dùng tính ROA */
  totalAssetsMil: number;
  /** ROI (Return on Investment - Tỷ suất sinh lời trên Tổng vốn đầu tư thực tế %/năm) */
  roiPercentYear: number;
  /** ROA (Return on Assets - Hiệu suất sinh lời trên Tổng tài sản vận hành %/năm) */
  roaPercentYear: number;
  /** Thời gian hoàn vốn thực tế tại VN (tháng) - Đã cộng 2 tháng chạy đà (Ramp-up) */
  paybackMonthsRealistic: number;
  /** Khoảng thời gian hoàn vốn thực tế (Min - Max tháng) */
  paybackRangeText: string;
  /** Phân loại hiệu quả vốn đầu tư */
  capitalEfficiencyLabel: string;
}

/**
 * Tính toán bộ chỉ số Hiệu quả Đầu tư (ROI, ROA, Thời gian hoàn vốn thực tế, Dòng tiền ròng)
 * chuẩn hóa theo mặt bằng chung thị trường Việt Nam:
 * - Đặt cọc mặt bằng 3 tháng + thanh toán đầu kỳ
 * - Dự phòng vốn lưu động & hàng tồn kho ban đầu
 * - Hệ số 11 tháng kinh doanh hiệu dụng/năm (trừ tháng Tết âm lịch / giao mùa)
 * - Giai đoạn chạy đà (Ramp-up) 2 tháng đầu khi mới mở điểm bán
 */
export function computeVietnamInvestmentMetrics(
  pnl: PnLProfile,
  maslowNeeds?: MaslowNeedId[],
  priceTier?: PriceTierId
): VietnamInvestmentMetrics {
  const rev = Number(pnl?.avgMonthlyRevenueVND) || 150;
  const rentPct = Number(pnl?.rentPercent) || 14;
  const cogsPct = Number(pnl?.cogsPercent) || 40;
  const netPct = Number(pnl?.netMarginPercent) || 14;

  const capexMin = Number(pnl?.initialCapexMinVND) || 120;
  const capexMax = Number(pnl?.initialCapexMaxVND) || 280;
  const avgCapexMil = Math.round((capexMin + capexMax) / 2);

  // Lợi nhuận ròng hàng tháng & hàng năm (11 tháng hiệu dụng chuẩn VN)
  const monthlyNetProfitMil = Math.max(5, Math.round((rev * netPct) / 100));
  const annualNetProfitMil = Math.round(monthlyNetProfitMil * 11);

  // Chi phí cọc mặt bằng tại VN (thường cọc 3 tháng tiền thuê) + Vốn lưu động 1 tháng vận hành
  const monthlyRentMil = Math.round((rev * rentPct) / 100);
  const depositMil = monthlyRentMil * 3;
  const workingCapMil = Math.round(rev * (cogsPct / 100) * 0.45);
  const depositAndWorkingCapMil = Math.max(15, depositMil + workingCapMil);

  // Tổng vốn đầu tư thực tế (Total Cash Outlay)
  const totalInvestmentMil = avgCapexMil + Math.round(depositAndWorkingCapMil * 0.6);

  // Tổng tài sản vận hành (Total Assets = CAPEX thiết bị/xây dựng + Cọc mặt bằng + Hàng tồn kho/Tài sản lưu động)
  // Với ngànhỞ (live), Vui chơi (play), Bán lẻ Mặc/Ăn cao cấp thì tài sản cố định & tồn kho lớn hơn
  const isAssetHeavy =
    maslowNeeds?.includes('live') ||
    maslowNeeds?.includes('play') ||
    priceTier === 'premium';
  const assetMultiplier = isAssetHeavy ? 1.28 : 1.18;
  const totalAssetsMil = Math.round(totalInvestmentMil * assetMultiplier);

  // ROI (%/năm) = Lợi nhuận ròng năm / Tổng vốn đầu tư thực tế
  const roiPercentYear =
    totalInvestmentMil > 0
      ? Math.min(145, Math.max(18, Math.round((annualNetProfitMil / totalInvestmentMil) * 100)))
      : 45;

  // ROA (%/năm) = Lợi nhuận ròng năm / Tổng tài sản vận hành
  const roaPercentYear =
    totalAssetsMil > 0
      ? Math.min(115, Math.max(14, Math.round((annualNetProfitMil / totalAssetsMil) * 100)))
      : 35;

  // Thời gian hoàn vốn thực tế tại VN (tháng) = (Tổng vốn đầu tư / Lãi ròng tháng) + 1.5 tháng chạy đà (Ramp-up)
  const rawPayback =
    monthlyNetProfitMil > 0 ? totalInvestmentMil / monthlyNetProfitMil + 1.5 : 18;
  const paybackMonthsRealistic = Math.max(5, Math.min(36, Math.round(rawPayback)));

  const pbMin = Math.max(
    4,
    Math.round((capexMin + depositMil) / Math.max(1, monthlyNetProfitMil) + 1)
  );
  const pbMax = Math.max(
    pbMin + 3,
    Math.round((capexMax + depositAndWorkingCapMil) / Math.max(1, monthlyNetProfitMil) + 2)
  );

  let capitalEfficiencyLabel = 'Hiệu suất vốn Cân bằng (Chuẩn ngành VN)';
  if (roiPercentYear >= 75) {
    capitalEfficiencyLabel = 'Quay vòng vốn nhanh • ROI cao (Asset-Light)';
  } else if (roiPercentYear <= 45) {
    capitalEfficiencyLabel = 'Thâm dụng vốn/tài sản • Bền vững dài hạn';
  }

  return {
    netMarginVNPercent: netPct,
    monthlyNetProfitMil,
    annualNetProfitMil,
    avgCapexMil,
    depositAndWorkingCapMil,
    totalInvestmentMil,
    totalAssetsMil,
    roiPercentYear,
    roaPercentYear,
    paybackMonthsRealistic,
    paybackRangeText: `${pbMin}–${pbMax} tháng`,
    capitalEfficiencyLabel,
  };
}
