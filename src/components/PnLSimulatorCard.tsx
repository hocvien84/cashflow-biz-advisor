'use client';

import React, { useEffect, useState } from 'react';
import { BusinessModel } from '@/types/business';
import { AGE_SEGMENTS, MASLOW_NEEDS, PRICE_TIERS } from '@/data/matrix-constants';
import { computeVietnamInvestmentMetrics } from '@/lib/investment-metrics';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Building2,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Printer,
  Layers,
} from 'lucide-react';

interface PnLSimulatorCardProps {
  model: BusinessModel;
  onClose?: () => void;
}

export default function PnLSimulatorCard({ model, onClose }: PnLSimulatorCardProps) {
  const safeRev = Number(model?.pnl?.avgMonthlyRevenueVND) || 180;
  const safeAov = Number(model?.pnl?.averageOrderValueVND) || 120;
  const safeGrossPct = Number(model?.pnl?.grossMarginPercent) || 55;
  const safeCogsPct = Number(model?.pnl?.cogsPercent) || 100 - safeGrossPct;
  const safeRentPct = Number(model?.pnl?.rentPercent) || 13;
  const safeLaborPct = Number(model?.pnl?.laborPercent) || 16;
  const safeOpexPct = Number(model?.pnl?.opexMarketingPercent) || 10;
  const safeNetPct =
    Number(model?.pnl?.netMarginPercent) ||
    Math.max(8, safeGrossPct - safeRentPct - safeLaborPct - safeOpexPct);
  const safeCapexMin = Number(model?.pnl?.initialCapexMinVND) || 120;
  const safeCapexMax = Number(model?.pnl?.initialCapexMaxVND) || 280;
  const safePaybackMin = Number(model?.pnl?.paybackMonthsMin) || 6;
  const safePaybackMax = Number(model?.pnl?.paybackMonthsMax) || 12;
  const safeRepeatPct = Number(model?.pnl?.repeatRatePercent) || 75;

  const defaultDailyOrders = Math.max(10, Math.round((safeRev * 1000) / (30 * safeAov)));
  const defaultRentMil = Math.round((safeRev * safeRentPct) / 100);
  const defaultCapexMil = Math.round((safeCapexMin + safeCapexMax) / 2);

  const [dailyOrders, setDailyOrders] = useState<number>(defaultDailyOrders);
  const [aovThousand, setAovThousand] = useState<number>(safeAov);
  const [monthlyRentMil, setMonthlyRentMil] = useState<number>(defaultRentMil);
  const [customCapexMil, setCustomCapexMil] = useState<number>(defaultCapexMil);

  // Sync slider values when switching to a different model
  useEffect(() => {
    setDailyOrders(Math.max(10, Math.round((safeRev * 1000) / (30 * safeAov))));
    setAovThousand(safeAov);
    setMonthlyRentMil(Math.round((safeRev * safeRentPct) / 100));
    setCustomCapexMil(Math.round((safeCapexMin + safeCapexMax) / 2));
  }, [model?.id, safeRev, safeAov, safeRentPct, safeCapexMin, safeCapexMax]);

  const vnMetrics = computeVietnamInvestmentMetrics(
    model?.pnl,
    model?.maslowNeeds,
    model?.priceTier
  );

  // Calculations (Chuẩn thực tế thị trường Việt Nam: 11 tháng hiệu dụng/năm + Cọc mặt bằng 3 tháng & Vốn lưu động)
  const simMonthlyRevMil = Math.round((dailyOrders * aovThousand * 30) / 1000);
  const simGrossProfitMil = Math.round((simMonthlyRevMil * safeGrossPct) / 100);
  const simLaborMil = Math.round((simMonthlyRevMil * safeLaborPct) / 100);
  const simOpexMil = Math.round((simMonthlyRevMil * safeOpexPct) / 100);
  const simNetProfitMil = simGrossProfitMil - monthlyRentMil - simLaborMil - simOpexMil;
  const simNetMarginPct =
    simMonthlyRevMil > 0 ? Math.round((simNetProfitMil / simMonthlyRevMil) * 100) : 0;

  const simDepositAndWorkingCapMil = Math.max(
    15,
    monthlyRentMil * 3 + Math.round(simMonthlyRevMil * (safeCogsPct / 100) * 0.4)
  );
  const simTotalInvestedMil = customCapexMil + Math.round(simDepositAndWorkingCapMil * 0.6);
  const simTotalAssetsMil = Math.round(simTotalInvestedMil * 1.22);
  const simAnnualNetProfitMil = simNetProfitMil > 0 ? Math.round(simNetProfitMil * 11) : 0;

  const simPaybackMonths =
    simNetProfitMil > 0
      ? (simTotalInvestedMil / simNetProfitMil + 1.5).toFixed(1)
      : 'Chưa hoàn vốn';
  const simAnnualRoiPct =
    simTotalInvestedMil > 0 && simAnnualNetProfitMil > 0
      ? Math.round((simAnnualNetProfitMil / simTotalInvestedMil) * 100)
      : 0;
  const simAnnualRoaPct =
    simTotalAssetsMil > 0 && simAnnualNetProfitMil > 0
      ? Math.round((simAnnualNetProfitMil / simTotalAssetsMil) * 100)
      : 0;

  const fixedCostMil = monthlyRentMil + Math.round(simLaborMil * 0.7) + Math.round(simOpexMil * 0.5);
  const grossProfitPerOrderThousand = (aovThousand * safeGrossPct) / 100;
  const breakEvenDailyOrders =
    grossProfitPerOrderThousand > 0
      ? Math.ceil((fixedCostMil * 1000) / (30 * grossProfitPerOrderThousand))
      : 0;

  const tierMeta = PRICE_TIERS.find((t) => t.id === model?.priceTier);
  const safeProducts = Array.isArray(model?.productsAndServices) ? model.productsAndServices : [];
  const safeExemplarsVN = Array.isArray(model?.exemplarsVN) ? model.exemplarsVN : [];
  const safeExemplarsAsia = Array.isArray(model?.exemplarsAsia) ? model.exemplarsAsia : [];
  const safeKSF = Array.isArray(model?.keySuccessFactors) ? model.keySuccessFactors : [];
  const safeRisks = Array.isArray(model?.risks) ? model.risks : [];
  const safeAges = Array.isArray(model?.ageSegments) ? model.ageSegments : [];
  const safeNeeds = Array.isArray(model?.maslowNeeds) ? model.maslowNeeds : [];

  return (
    <div className="bg-slate-900 border-2 border-indigo-500/70 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {model?.isMultiNeed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                <Layers className="w-3.5 h-3.5" /> Mô hình Đa Nhu Cầu (One-Stop-Shop)
              </span>
            )}
            {tierMeta && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierMeta.badgeColor}`}
              >
                {tierMeta.label}
              </span>
            )}
            {safeAges.map((ag) => {
              const aMeta = AGE_SEGMENTS.find((a) => a.id === ag);
              return (
                <span
                  key={ag}
                  className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                >
                  👥 {aMeta?.label || ag} {aMeta?.subLabel ? `(${aMeta.subLabel})` : ''}
                </span>
              );
            })}
            {safeNeeds.map((nd) => {
              const nMeta = MASLOW_NEEDS.find((n) => n.id === nd);
              return (
                <span
                  key={nd}
                  className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30"
                >
                  🎯 {nMeta?.label || nd}
                </span>
              );
            })}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">{model?.name}</h3>
          <p className="text-sm text-indigo-300 font-medium">{model?.tagline}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5" /> In / Xuất PDF Báo Cáo
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition"
            >
              Đóng ✕
            </button>
          )}
        </div>
      </div>

      {/* Summary & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" /> Bản chất Mô hình & Cấu trúc Sản phẩm Dòng tiền
          </h4>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{model?.summary}</p>
          <div className="space-y-1.5 pt-1">
            {safeProducts.map((prod, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{prod}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmarks VN & Asia */}
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/60 space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" /> Thương hiệu Thành công tại VN & Công ty Niêm yết Châu Á
          </h4>
          <div>
            <div className="text-xs text-slate-400 mb-1.5">Chuỗi / Mô hình tiêu biểu tại Việt Nam:</div>
            <div className="flex flex-wrap gap-1.5">
              {safeExemplarsVN.map((ex, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-500/15 text-cyan-200 border border-cyan-500/30"
                >
                  🇻🇳 {ex}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <div className="text-xs text-slate-400">Tham chiếu BCTC Doanh nghiệp Châu Á:</div>
            {safeExemplarsAsia.map((asia, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-semibold text-amber-300">
                  <span>
                    🌏 {asia?.name} ({asia?.country})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[11px]">
                    {asia?.tickerOrStatus}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{asia?.financialHighlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Standard P&L Structure Bar */}
      <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Cấu trúc P&L Chuẩn Ngành (% trên Doanh thu)
          </h4>
          <span className="text-xs text-slate-400 italic">
            Nguồn: {model?.pnl?.dataSourceCitation || 'BCTC các chuỗi bán lẻ & dịch vụ Châu Á'}
          </span>
        </div>

        {/* Visual stacked bar */}
        <div className="w-full h-7 rounded-lg overflow-hidden flex text-[11px] font-bold">
          <div
            style={{ width: `${safeCogsPct}%` }}
            className="bg-rose-500/80 text-white flex items-center justify-center"
            title={`Giá vốn COGS: ${safeCogsPct}%`}
          >
            COGS {safeCogsPct}%
          </div>
          <div
            style={{ width: `${safeRentPct}%` }}
            className="bg-amber-500/80 text-slate-950 flex items-center justify-center"
            title={`Thuê mặt bằng: ${safeRentPct}%`}
          >
            MB {safeRentPct}%
          </div>
          <div
            style={{ width: `${safeLaborPct}%` }}
            className="bg-sky-500/80 text-slate-950 flex items-center justify-center"
            title={`Nhân sự: ${safeLaborPct}%`}
          >
            NS {safeLaborPct}%
          </div>
          <div
            style={{ width: `${safeOpexPct}%` }}
            className="bg-purple-500/80 text-white flex items-center justify-center"
            title={`Vận hành & MKT: ${safeOpexPct}%`}
          >
            OPEX {safeOpexPct}%
          </div>
          <div
            style={{ width: `${safeNetPct}%` }}
            className="bg-emerald-500 text-slate-950 flex items-center justify-center"
            title={`Lợi nhuận ròng: ${safeNetPct}%`}
          >
            Lãi {safeNetPct}%
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Hiệu suất ROI (Vốn ĐT)</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              ~{vnMetrics.roiPercentYear}% / năm
            </div>
            <div className="text-[11px] text-slate-300">
              Tổng vốn ĐT: ~{vnMetrics.totalInvestmentMil} Tr
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Hiệu suất ROA (Tài sản)</div>
            <div className="text-lg font-bold text-cyan-300 mt-0.5">
              ~{vnMetrics.roaPercentYear}% / năm
            </div>
            <div className="text-[11px] text-slate-300">
              Tổng tài sản: ~{vnMetrics.totalAssetsMil} Tr
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Thời gian hoàn vốn VN</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">
              ~{vnMetrics.paybackMonthsRealistic} tháng
            </div>
            <div className="text-[11px] text-slate-300">
              Biên độ: {vnMetrics.paybackRangeText}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Dòng tiền ròng / tháng</div>
            <div className="text-lg font-bold text-white mt-0.5">
              ~{vnMetrics.monthlyNetProfitMil} Triệu
            </div>
            <div className="text-[11px] text-emerald-400">
              Lãi ròng chuẩn VN: {safeNetPct}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400">CAPEX & Cọc MB (VN)</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">
              {safeCapexMin} - {safeCapexMax} Tr
            </div>
            <div className="text-[11px] text-slate-300">
              +Cọc 3th & VLĐ: ~{vnMetrics.depositAndWorkingCapMil} Tr
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong>Đặc thù Vòng quay Dòng tiền (Cashflow Cycle):</strong>{' '}
            {model?.pnl?.cashflowCycle || 'Thu tiền mặt/QR trực tiếp và qua gói thẻ thành viên trả trước.'}
          </div>
        </div>
      </div>

      {/* INTERACTIVE CASHFLOW & ROI SIMULATOR */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 rounded-xl p-5 border border-indigo-500/40 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Bộ Mô Phỏng Dòng Tiền & Điểm Hòa Vốn Thực Tế
          </h4>
          <span className="text-xs text-indigo-300">Kéo thanh trượt để ướm thử mặt bằng của bạn</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Số đơn hàng / lượt khách mỗi ngày:</span>
                <span className="font-bold text-indigo-300">{dailyOrders} đơn/ngày</span>
              </div>
              <input
                type="range"
                min={5}
                max={Math.max(300, Math.round(defaultDailyOrders * 2.5))}
                value={dailyOrders}
                onChange={(e) => setDailyOrders(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Giá trị đơn hàng trung bình (AOV):</span>
                <span className="font-bold text-cyan-300">
                  {Number(aovThousand || 0).toLocaleString('vi-VN')}.000 VNĐ
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={Math.max(2000, safeAov * 2)}
                step={5}
                value={aovThousand}
                onChange={(e) => setAovThousand(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Tiền thuê mặt bằng thực tế / tháng:</span>
                <span className="font-bold text-amber-300">{monthlyRentMil} Triệu VNĐ/tháng</span>
              </div>
              <input
                type="range"
                min={0}
                max={120}
                step={1}
                value={monthlyRentMil}
                onChange={(e) => setMonthlyRentMil(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Tổng vốn đầu tư ban đầu (CAPEX):</span>
                <span className="font-bold text-emerald-300">{customCapexMil} Triệu VNĐ</span>
              </div>
              <input
                type="range"
                min={30}
                max={2000}
                step={10}
                value={customCapexMil}
                onChange={(e) => setCustomCapexMil(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Live Simulated Results */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Doanh thu mô phỏng</div>
              <div className="text-xl font-bold text-white mt-1">{simMonthlyRevMil} Tr/tháng</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Lãi gộp ({safeGrossPct}%): {simGrossProfitMil} Tr
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Dòng tiền ròng bỏ túi</div>
              <div
                className={`text-xl font-bold mt-1 ${
                  simNetProfitMil >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simNetProfitMil >= 0 ? `+${simNetProfitMil}` : simNetProfitMil} Tr/tháng
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Biên ròng thực tế: {simNetMarginPct}%</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Hoàn vốn & Hiệu suất Vốn
              </div>
              <div className="text-lg font-bold text-amber-300 mt-1">
                {typeof simPaybackMonths === 'string' && simPaybackMonths !== 'Chưa hoàn vốn'
                  ? `${simPaybackMonths} tháng`
                  : simPaybackMonths}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5 font-semibold">
                ROI: ~{simAnnualRoiPct}%/năm • ROA: ~{simAnnualRoaPct}%/năm
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400">Điểm hòa vốn (Break-even)</div>
              <div className="text-lg font-bold text-cyan-300 mt-1">{breakEvenDailyOrders} đơn/ngày</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {dailyOrders >= breakEvenDailyOrders ? '✅ Vượt ngưỡng hòa vốn' : '⚠️ Chưa đạt ngưỡng hòa vốn'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Success Factors & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Bí quyết thành công & Tối ưu dòng tiền
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
            {safeKSF.map((ksf, i) => (
              <li key={i}>{ksf}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Rủi ro P&L cần kiểm soát chặt
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
            {safeRisks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
