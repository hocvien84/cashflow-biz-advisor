import {
  BusinessModel,
  AreaIntelligenceRecord,
  IkigaiUserInput,
  ScoredRecommendation,
  POICategory,
} from '@/types/business';
import { AGE_SEGMENTS, MASLOW_NEEDS, PRICE_TIERS, POI_CATEGORY_META } from '@/data/matrix-constants';

export function scoreBusinessModels(
  models: BusinessModel[],
  area: AreaIntelligenceRecord | null,
  ikigai: IkigaiUserInput
): ScoredRecommendation[] {
  const results: ScoredRecommendation[] = [];

  for (const model of models) {
    const matchReasons: string[] = [];
    const warnings: string[] = [];
    const actionPlan: string[] = [];

    // 1. LOCATION SCORE (0 - 100)
    let locationScore = 70; // Default baseline when no location is selected yet
    if (area) {
      // a) Age segment score in area (45% of location score)
      const ageScores = model.ageSegments.map((seg) => area.demographics.ageSegmentScores[seg] ?? 60);
      const avgAgeScore = ageScores.reduce((a, b) => a + b, 0) / Math.max(1, ageScores.length);

      // b) Price tier fit in area (25% of location score)
      const tierScore = area.demographics.priceTierFit[model.priceTier] ?? 65;

      // c) Maslow need demand in area (15% of location score)
      const needScores = model.maslowNeeds.map((n) => area.demographics.needDemandScores[n] ?? 65);
      const avgNeedScore = needScores.reduce((a, b) => a + b, 0) / Math.max(1, needScores.length);

      // d) POI presence bonus (15% of location score)
      let poiBonus = 50;
      const matchedPOIs: { cat: POICategory; count: number }[] = [];
      for (const reqPoi of model.locationRequirements.idealPOIs) {
        const count = area.poiCounts[reqPoi] || 0;
        if (count > 0) {
          matchedPOIs.push({ cat: reqPoi, count });
          poiBonus += Math.min(25, count * 6);
        }
      }
      poiBonus = Math.min(100, poiBonus);

      locationScore = Math.round(
        avgAgeScore * 0.45 + tierScore * 0.25 + avgNeedScore * 0.15 + poiBonus * 0.15
      );
      locationScore = Math.max(20, Math.min(99, locationScore));

      if (avgAgeScore >= 75) {
        const topSegLabels = model.ageSegments
          .map((id) => AGE_SEGMENTS.find((a) => a.id === id)?.label)
          .filter(Boolean)
          .join(', ');
        matchReasons.push(
          `Tệp khách hàng mục tiêu (${topSegLabels}) có mật độ rất cao (${Math.round(avgAgeScore)}/100 điểm) tại ${area.locationName}.`
        );
      }

      if (matchedPOIs.length > 0) {
        const poiSummary = matchedPOIs
          .map((p) => `${p.count} ${POI_CATEGORY_META[p.cat].label.split(' ')[0].toLowerCase()}`)
          .join(', ');
        matchReasons.push(
          `Bán kính ${area.radiusKm}km xung quanh có sẵn mỏ khách hàng tự nhiên (${poiSummary}) khớp với yêu cầu mặt bằng.`
        );
      }

      if (tierScore < 55) {
        const tierLabel = PRICE_TIERS.find((t) => t.id === model.priceTier)?.label;
        warnings.push(
          `Phân khúc ${tierLabel} có độ khớp thu nhập trung bình (${tierScore}/100) tại khu vực này — cần cân nhắc điều chỉnh giá bán hoặc combo.`
        );
      }
    }

    // 2. IKIGAI SCORE (0 - 100): Passion + Skill + Multi-need synergy
    let passionScore = 45;
    const matchedPassions = model.ikigaiProfile.passions.filter((p) => ikigai.passions.includes(p));
    if (matchedPassions.length > 0) {
      passionScore = Math.min(100, 68 + matchedPassions.length * 16);
      matchReasons.push(`Đúng lĩnh vực đam mê bạn đã chọn trong vòng tròn Ikigai.`);
    }

    let skillScore = 45;
    const matchedSkills = model.ikigaiProfile.skills.filter((s) => ikigai.strongestSkills.includes(s));
    if (matchedSkills.length > 0) {
      skillScore = Math.min(100, 68 + matchedSkills.length * 16);
      matchReasons.push(`Phát huy trực tiếp sở trường cốt lõi của bạn để tạo lợi thế cạnh tranh.`);
    }

    const ikigaiScore = Math.round(passionScore * 0.5 + skillScore * 0.5);

    // 3. RESOURCE & GOAL SCORE (0 - 100): Capital + Network + Tech + Goals
    let capitalScore = 70;
    const budget = ikigai.capitalBudgetMilVND;
    if (budget >= model.pnl.initialCapexMaxVND) {
      capitalScore = 98;
      matchReasons.push(
        `Nguồn vốn ${budget} triệu VNĐ dư dả so với mức CAPEX chuẩn (${model.pnl.initialCapexMinVND} - ${model.pnl.initialCapexMaxVND} triệu), đủ quỹ dự phòng vốn lưu động 6 tháng.`
      );
    } else if (budget >= model.pnl.initialCapexMinVND) {
      capitalScore = 85;
      matchReasons.push(
        `Ngân sách ${budget} triệu VNĐ vừa khớp ngưỡng đầu tư tiêu chuẩn (${model.pnl.initialCapexMinVND} - ${model.pnl.initialCapexMaxVND} triệu VNĐ).`
      );
    } else if (budget >= model.pnl.initialCapexMinVND * 0.7) {
      capitalScore = 58;
      warnings.push(
        `Vốn hiện tại (${budget} triệu) hơi sát so với mức tối thiểu ${model.pnl.initialCapexMinVND} triệu — nên khởi đầu tinh gọn (Kiosk/Cloud) hoặc tìm thêm cổ đông.`
      );
    } else {
      capitalScore = 25;
      warnings.push(
        `Mô hình cần tối thiểu ${model.pnl.initialCapexMinVND} triệu VNĐ, vượt quá ngân sách ${budget} triệu hiện tại của bạn.`
      );
    }

    let networkScore = 55;
    const matchedNetworks = model.ikigaiProfile.networkAdvantages.filter((n) =>
      ikigai.networks.includes(n)
    );
    if (matchedNetworks.length > 0) {
      networkScore = Math.min(100, 75 + matchedNetworks.length * 15);
      matchReasons.push(`Tận dụng được mối quan hệ/đối tác sẵn có để giảm chi phí mặt bằng hoặc giá vốn.`);
    }

    let goalScore = 60;
    const matchedGoals = model.ikigaiProfile.goalFit.filter((g) => ikigai.primaryGoals.includes(g));
    if (matchedGoals.length > 0) {
      goalScore = Math.min(100, 72 + matchedGoals.length * 14);
    }

    const resourceScore = Math.round(capitalScore * 0.5 + networkScore * 0.25 + goalScore * 0.25);

    // TOTAL WEIGHTED SCORE
    const totalScore = Math.round(locationScore * 0.4 + ikigaiScore * 0.3 + resourceScore * 0.3);

    // Action Plan generation
    const needNames = model.maslowNeeds
      .map((n) => MASLOW_NEEDS.find((m) => m.id === n)?.label.split(' ')[0])
      .join(' + ');
    actionPlan.push(
      `Bước 1 (Thẩm định điểm bán): Khảo sát lưu lượng người qua lại tại ${
        area ? area.locationName : 'vị trí dự kiến'
      } vào 2 khung giờ cao điểm (7h00-8h30 và 17h00-19h30), đảm bảo tiền thuê mặt bằng không vượt quá ${
        model.pnl.rentPercent
      }% doanh thu mục tiêu (~${Math.round(
        (model.pnl.avgMonthlyRevenueVND * model.pnl.rentPercent) / 100
      )} triệu/tháng).`
    );
    actionPlan.push(
      `Bước 2 (Thiết kế phễu dòng tiền ${needNames}): Áp dụng sản phẩm mồi AOV ~${model.pnl.averageOrderValueVND}.000đ để thu hút khách hàng trải nghiệm trong 14 ngày đầu, kết hợp bán thẻ trả trước/combo để thu hồi vốn lưu động.`
    );
    actionPlan.push(
      `Bước 3 (Kiểm soát P&L chuẩn Châu Á): Giữ tỷ lệ Giá vốn (COGS) quanh ngưỡng ${model.pnl.cogsPercent}% và Chi phí nhân sự ~${model.pnl.laborPercent}% để đạt biên lợi nhuận ròng ~${model.pnl.netMarginPercent}% (~${Math.round(
        (model.pnl.avgMonthlyRevenueVND * model.pnl.netMarginPercent) / 100
      )} triệu VNĐ/tháng).`
    );

    if (warnings.length === 0 && model.risks.length > 0) {
      warnings.push(model.risks[0]);
    }

    results.push({
      model,
      totalScore,
      locationScore,
      ikigaiScore,
      resourceScore,
      matchReasons,
      actionPlan,
      warnings,
    });
  }

  return results.sort((a, b) => b.totalScore - a.totalScore);
}
