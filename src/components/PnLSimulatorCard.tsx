'use client';

import React, { useState } from 'react';
import { BusinessModel } from '@/types/business';
import { AGE_SEGMENTS, MASLOW_NEEDS, PRICE_TIERS } from '@/data/matrix-constants';
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
  const defaultDailyOrders = Math.max(
    10,
    Math.round((model.pnl.avgMonthlyRevenueVND * 1000) / (30 * model.pnl.averageOrderValueVND))
  );
  const defaultRentMil = Math.round((model.pnl.avgMonthlyRevenueVND * model.pnl.rentPercent) / 100);
  const defaultCapexMil = Math.round((model.pnl.initialCapexMinVND + model.pnl.initialCapexMaxVND) / 2);

  const [dailyOrders, setDailyOrders] = useState<number>(defaultDailyOrders);
  const [aovThousand, setAovThousand] = useState<number>(model.pnl.averageOrderValueVND);
  const [monthlyRentMil, setMonthlyRentMil] = useState<number>(defaultRentMil);
  const [customCapexMil, setCustomCapexMil] = useState<number>(defaultCapexMil);

  // Calculations
  const simMonthlyRevMil = Math.round((dailyOrders * aovThousand * 30) / 1000);
  const simGrossProfitMil = Math.round((simMonthlyRevMil * model.pnl.grossMarginPercent) / 100);
  const simLaborMil = Math.round((simMonthlyRevMil * model.pnl.laborPercent) / 100);
  const simOpexMil = Math.round((simMonthlyRevMil * model.pnl.opexMarketingPercent) / 100);
  const simNetProfitMil = simGrossProfitMil - monthlyRentMil - simLaborMil - simOpexMil;
  const simNetMarginPct =
    simMonthlyRevMil > 0 ? Math.round((simNetProfitMil / simMonthlyRevMil) * 100) : 0;
  const simPaybackMonths =
    simNetProfitMil > 0 ? (customCapexMil / simNetProfitMil).toFixed(1) : 'Chưa hoàn vốn';
  const simAnnualRoiPct =
    customCapexMil > 0 && simNetProfitMil > 0
      ? Math.round(((simNetProfitMil * 12) / customCapexMil) * 100)
      : 0;

  // Điểm hòa vốn (số đơn/ngày để lợi nhuận gộp bù đắp chi phí cố định)
  const fixedCostMil = monthlyRentMil + Math.round(simLaborMil * 0.7) + Math.round(simOpexMil * 0.5);
  const grossProfitPerOrderThousand = (aovThousand * model.pnl.grossMarginPercent) / 100;
  const breakEvenDailyOrders =
    grossProfitPerOrderThousand > 0
      ? Math.ceil((fixedCostMil * 1000) / (30 * grossProfitPerOrderThousand))
      : 0;

  const tierMeta = PRICE_TIERS.find((t) => t.id === model.priceTier);

  return (
    <div className="bg-slate-900 border border-slate-700/90 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {model.isMultiNeed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                <Layers className="w-3.5 h-3.5" /> Mô hình Đa Nhu Cầu (One-Stop-Shop)
              </span>
            )}
            {tierMeta && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierMeta.badgeColor}`}>
                {tierMeta.label}
              </span>
            )}
            {model.ageSegments.map((ag) => {
              const aMeta = AGE_SEGMENTS.find((a) => a.id === ag);
              return (
                <span
                  key={ag}
                  className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                >
                  👥 {aMeta?.label} ({aMeta?.subLabel})
                </span>
              );
            })}
            {model.maslowNeeds.map((nd) => {
              const nMeta = MASLOW_NEEDS.find((n) => n.id === nd);
              return (
                <span
                  key={nd}
                  className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30"
                >
                  🎯 {nMeta?.label}
                </span>
              );
            })}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white">{model.name}</h3>
          <p className="text-sm text-indigo-300 font-medium">{model.tagline}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5" /> In / Xuất PDF Báo Cáo
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition"
            >
              Đóng
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
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{model.summary}</p>
          <div className="space-y-1.5 pt-1">
            {model.productsAndServices.map((prod, idx) => (
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
              {model.exemplarsVN.map((ex, i) => (
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
            {model.exemplarsAsia.map((asia, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-amber-300">
                  <span>🌏 {asia.name} ({asia.country})</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 text-[11px]">
                    {asia.tickerOrStatus}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{asia.financialHighlight}</p>
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
          <span className="text-xs text-slate-400 italic">Nguồn: {model.pnl.dataSourceCitation}</span>
        </div>

        {/* Visual stacked bar */}
        <div className="w-full h-7 rounded-lg overflow-hidden flex text-[11px] font-bold">
          <div
            style={{ width: `${model.pnl.cogsPercent}%` }}
            className="bg-rose-500/80 text-white flex items-center justify-center"
            title={`Giá vốn COGS: ${model.pnl.cogsPercent}%`}
          >
            COGS {model.pnl.cogsPercent}%
          </div>
          <div
            style={{ width: `${model.pnl.rentPercent}%` }}
            className="bg-amber-500/80 text-slate-950 flex items-center justify-center"
            title={`Thuê mặt bằng: ${model.pnl.rentPercent}%`}
          >
            Mặt bằng {model.pnl.rentPercent}%
          </div>
          <div
            style={{ width: `${model.pnl.laborPercent}%` }}
            className="bg-sky-500/80 text-slate-950 flex items-center justify-center"
            title={`Nhân sự: ${model.pnl.laborPercent}%`}
          >
            Nhân sự {model.pnl.laborPercent}%
          </div>
          <div
            style={{ width: `${model.pnl.opexMarketingPercent}%` }}
            className="bg-purple-500/80 text-white flex items-center justify-center"
            title={`Vận hành & MKT: ${model.pnl.opexMarketingPercent}%`}
          >
            OPEX {model.pnl.opexMarketingPercent}%
          </div>
          <div
            style={{ width: `${model.pnl.netMarginPercent}%` }}
            className="bg-emerald-500 text-slate-950 flex items-center justify-center"
            title={`Lợi nhuận ròng: ${model.pnl.netMarginPercent}%`}
          >
            Lãi ròng {model.pnl.netMarginPercent}%
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Doanh thu chuẩn / tháng</div>
            <div className="text-lg font-bold text-white mt-0.5">{model.pnl.avgMonthlyRevenueVND} Triệu</div>
            <div className="text-[11px] text-emerald-400">Biên gộp: {model.pnl.grossMarginPercent}%</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Lợi nhuận ròng / tháng</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">
              ~{Math.round((model.pnl.avgMonthlyRevenueVND * model.pnl.netMarginPercent) / 100)} Triệu
            </div>
            <div className="text-[11px] text-slate-300">Net Margin: {model.pnl.netMarginPercent}%</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Vốn đầu tư (CAPEX)</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">
              {model.pnl.initialCapexMinVND} - {model.pnl.initialCapexMaxVND} Tr
            </div>
            <div className="text-[11px] text-slate-300">
              Hoàn vốn: {model.pnl.paybackMonthsMin}-{model.pnl.paybackMonthsMax} tháng
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <div className="text-xs text-slate-400">Đơn trung bình (AOV) & Lặp lại</div>
            <div className="text-lg font-bold text-cyan-300 mt-0.5">{model.pnl.averageOrderValueVND}.000đ</div>
            <div className="text-[11px] text-slate-300">Khách quay lại: {model.pnl.repeatRatePercent}%</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-2">
          <DollarSign className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong>Đặc thù Vòng quay Dòng tiền (Cashflow Cycle):</strong> {model.pnl.cashflowCycle}
          </div>
        </div>
      </div>

      {/* INTERACTIVE CASHFLOW & ROI SIMULATOR */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-900 rounded-xl p-5 border border-indigo-500/40 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" /> Bộ Mô Phỏng Dòng Tiền & Điểm Hòa Vốn Thực Tế (Interactive ROI Simulator)
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
                max={Math.max(300, defaultDailyOrders * 2.5)}
                value={dailyOrders}
                onChange={(e) => setDailyOrders(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Giá trị đơn hàng trung bình (AOV):</span>
                <span className="font-bold text-cyan-300">{aovThousand.toLocaleString('vi-VN')}.000 VNĐ</span>
              </div>
              <input
                type="range"
                min={15}
                max={Math.max(2000, model.pnl.averageOrderValueVND * 2)}
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
                Lãi gộp ({model.pnl.grossMarginPercent}%): {simGrossProfitMil} Tr
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
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Thời gian hoàn vốn
              </div>
              <div className="text-lg font-bold text-amber-300 mt-1">
                {typeof simPaybackMonths === 'string' && simPaybackMonths !== 'Chưa hoàn vốn'
                  ? `${simPaybackMonths} tháng`
                  : simPaybackMonths}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5">ROI: ~{simAnnualRoiPct}% / năm</div>
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
            {model.keySuccessFactors.map((ksf, i) => (
              <li key={i}>{ksf}</li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Rủi ro P&L cần kiểm soát chặt
          </div>
          <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside">
            {model.risks.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
