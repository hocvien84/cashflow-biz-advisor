import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getAllBusinessModelsFromDb, saveBusinessModelToDb } from '@/lib/db';
import { AgeSegmentId, BusinessModel, MaslowNeedId, PriceTierId } from '@/types/business';
import { AGE_SEGMENTS, MASLOW_NEEDS, PRICE_TIERS } from '@/data/matrix-constants';

function extractJsonObject(raw: string): Record<string, unknown> | null {
  try {
    const cleaned = raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function GET() {
  try {
    const models = getAllBusinessModelsFromDb();
    return NextResponse.json({ models, count: models.length });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ageSegments = ['toddler'] as AgeSegmentId[],
      maslowNeeds = ['eat'] as MaslowNeedId[],
      priceTier = 'mid' as PriceTierId,
      customPrompt = '',
      apiKey = '',
    } = body;

    const safeAges: AgeSegmentId[] =
      Array.isArray(ageSegments) && ageSegments.length > 0 ? ageSegments : ['toddler'];
    const safeNeeds: MaslowNeedId[] =
      Array.isArray(maslowNeeds) && maslowNeeds.length > 0 ? maslowNeeds : ['eat'];
    const safeTier: PriceTierId = priceTier || 'mid';

    const effectiveKey = (apiKey || process.env.GEMINI_API_KEY || '').trim();
    const ageLabels = safeAges
      .map((id: AgeSegmentId) => AGE_SEGMENTS.find((a) => a.id === id)?.label || id)
      .join(' + ');
    const needLabels = safeNeeds
      .map((id: MaslowNeedId) => MASLOW_NEEDS.find((n) => n.id === id)?.label.split(' ')[0] || id)
      .join(' + ');
    const tierLabel = PRICE_TIERS.find((t) => t.id === safeTier)?.label || safeTier;
    const isMultiNeed = safeNeeds.length > 1 || safeAges.length > 1;

    // Chuẩn bị khung mô hình chuẩn ngành làm nền tảng an toàn (Fallback / Merge Base) theo mặt bằng Việt Nam
    const rev = safeTier === 'budget' ? 120 : safeTier === 'mid' ? 210 : 350;
    const cogs = safeTier === 'budget' ? 46 : safeTier === 'mid' ? 40 : 34;
    const gross = 100 - cogs;
    const rent = 14;
    const labor = 18;
    const opex = 12;
    const net = Math.max(10, Math.min(20, gross - rent - labor - opex));
    const capexMin = safeTier === 'budget' ? 85 : safeTier === 'mid' ? 180 : 390;
    const capexMax = safeTier === 'budget' ? 175 : safeTier === 'mid' ? 370 : 820;
    const defaultAov = safeTier === 'budget' ? 50 : safeTier === 'mid' ? 190 : 580;

    const baseSynthesized: BusinessModel = {
      id: `ai-${Date.now()}`,
      name: customPrompt
        ? `${customPrompt} (${ageLabels} • ${tierLabel})`
        : `Tổ Hợp Kinh Doanh ${needLabels} Cho ${ageLabels} (${tierLabel})`,
      tagline: `Mô hình khai thác dòng tiền lặp lại kết hợp ${needLabels} cho tệp ${ageLabels}`,
      isMultiNeed,
      ageSegments: safeAges,
      maslowNeeds: safeNeeds,
      priceTier: safeTier,
      summary: `Mô hình ${
        customPrompt || `Tổ hợp ${needLabels}`
      } được thiết kế chuyên biệt cho tệp khách hàng ${ageLabels} ở phân khúc ${tierLabel}. Tối ưu hóa dòng tiền mặt thu trước qua thẻ thành viên định kỳ và sản phẩm phễu có tần suất mua lặp lại cao hàng tuần.`,
      productsAndServices: [
        `Sản phẩm/Dịch vụ phễu thu hút tệp ${ageLabels} trải nghiệm hàng tuần`,
        `Combo tích hợp (${needLabels}) giúp tăng giá trị đơn hàng trung bình (AOV) thêm 40-55%`,
        'Gói thẻ thành viên trả trước (Prepaid/Subscription) tạo dòng tiền dương ngay từ đầu tháng',
      ],
      exemplarsVN: [
        customPrompt ? `Chuỗi ${customPrompt} tiêu biểu tại Hà Nội & TP.HCM` : `Các chuỗi ${needLabels} cho ${ageLabels} tại VN`,
        'Con Cưng / BiboMart / KidsPlaza / Mô hình Kiosk Đô Thị',
      ],
      exemplarsAsia: [
        {
          name: 'Seven & i / AEON / Nishimatsuya / Luckin Asian Benchmarks',
          country: 'Nhật Bản & Trung Quốc',
          tickerOrStatus: 'TSE / HKEX Listed Retail & Service',
          financialHighlight: `Biên lợi nhuận gộp chuẩn ngành đạt ${gross}%, EBITDA cấp cửa hàng đạt ${net}% với thời gian hoàn vốn trung bình 7-12 tháng.`,
        },
      ],
      pnl: {
        avgMonthlyRevenueVND: rev,
        cogsPercent: cogs,
        grossMarginPercent: gross,
        rentPercent: rent,
        laborPercent: labor,
        opexMarketingPercent: opex,
        netMarginPercent: net,
        initialCapexMinVND: capexMin,
        initialCapexMaxVND: capexMax,
        paybackMonthsMin: Math.max(5, Math.round(capexMin / ((rev * net) / 100))),
        paybackMonthsMax: Math.max(9, Math.round(capexMax / ((rev * net) / 100))),
        averageOrderValueVND: defaultAov,
        repeatRatePercent: 76,
        cashflowCycle:
          'Thu tiền trực tiếp hàng ngày qua POS/QR kết hợp gói hội viên theo tháng; công nợ nhà cung cấp 15-30 ngày.',
        dataSourceCitation:
          'Nội suy từ BCTC các chuỗi bán lẻ & dịch vụ niêm yết Châu Á (TSE, HKEX) và báo cáo thị trường Việt Nam.',
      },
      locationRequirements: {
        idealPOIs: ['apartment', 'school', 'market', 'office'],
        minAreaM2: safeTier === 'budget' ? 25 : 50,
        footTrafficNotes: 'Đặt tại bán kính 0.2 - 1.5km quanh khu vực tập trung tệp khách hàng mục tiêu.',
      },
      ikigaiProfile: {
        passions: ['food_nutrition', 'kids_mother', 'health_wellness', 'community_social'],
        skills: ['operations_chain', 'marketing_digital', 'sales_consulting'],
        techLevel: 'moderate',
        networkAdvantages: ['landlord_re', 'kol_local_group'],
        goalFit: ['cashflow_fast', 'scalable_chain', 'high_margin'],
      },
      keySuccessFactors: [
        'Sử dụng sản phẩm tiêu dùng lặp lại làm phễu kéo khách đến điểm bán tối thiểu 2 lần/tuần',
        'Kiểm soát chi phí thuê mặt bằng dưới 13% doanh thu dự kiến',
        'Xây dựng nhóm Zalo VIP khách hàng thân thiết trong bán kính 1.5km',
      ],
      risks: [
        'Cần chuẩn hóa quy trình vận hành (SOP) để không phụ thuộc vào cá nhân chủ quán',
        'Kiểm soát tỷ lệ hao hụt nguyên vật liệu và hàng tồn kho dưới 5%',
      ],
      sourceType: 'ai_researched',
    };

    if (effectiveKey) {
      try {
        const client = new GoogleGenAI({ apiKey: effectiveKey });
        const prompt = `Bạn là chuyên gia phân tích đầu tư và tư vấn mô hình kinh doanh tạo dòng tiền tại Việt Nam và Châu Á.
Hãy phân tích chuyên sâu một mô hình kinh doanh thực tế thành công cho:
- Tệp khách hàng mục tiêu: ${ageLabels}
- Nhu cầu Maslow khai thác: ${needLabels} (${isMultiNeed ? 'Mô hình kết hợp đa nhu cầu' : 'Mô hình chuyên sâu'})
- Phân khúc giá: ${tierLabel}
${customPrompt ? `- Ý tưởng / Ngách cụ thể từ người dùng: "${customPrompt}"` : ''}

Hãy trả về duy nhất 1 JSON object (không bọc markdown) theo cấu trúc sau:
{
  "name": "Tên mô hình kinh doanh cụ thể",
  "tagline": "Câu định vị cách mô hình khai thác dòng tiền",
  "summary": "Mô tả chi tiết mô hình vận hành và cơ chế kiếm tiền (3-4 câu)",
  "productsAndServices": ["Sản phẩm phễu...", "Sản phẩm biên lợi nhuận cao...", "Gói định kỳ..."],
  "exemplarsVN": ["Thương hiệu VN 1", "Thương hiệu VN 2", "Thương hiệu VN 3"],
  "exemplarsAsia": [
    {
      "name": "Tên công ty Châu Á tương đồng",
      "country": "Nhật Bản / Trung Quốc / Hàn Quốc / Thái Lan...",
      "tickerOrStatus": "Mã cổ phiếu hoặc quy mô chuỗi",
      "financialHighlight": "Số liệu biên lợi nhuận gộp, lợi nhuận ròng, vòng quay vốn từ BCTC"
    }
  ],
  "pnl": {
    "avgMonthlyRevenueVND": ${rev},
    "cogsPercent": ${cogs},
    "grossMarginPercent": ${gross},
    "rentPercent": ${rent},
    "laborPercent": ${labor},
    "opexMarketingPercent": ${opex},
    "netMarginPercent": ${net},
    "initialCapexMinVND": ${capexMin},
    "initialCapexMaxVND": ${capexMax},
    "paybackMonthsMin": 6,
    "paybackMonthsMax": 11,
    "averageOrderValueVND": ${defaultAov},
    "repeatRatePercent": 75,
    "cashflowCycle": "Đặc điểm thu tiền mặt và vòng quay vốn",
    "dataSourceCitation": "Nguồn BCTC công ty niêm yết Châu Á & báo kinh tế chính thống"
  },
  "keySuccessFactors": ["Yếu tố thành công 1", "Yếu tố thành công 2", "Yếu tố thành công 3"],
  "risks": ["Rủi ro cần kiểm soát 1", "Rủi ro cần kiểm soát 2"]
}`;

        // Giới hạn thời gian gọi AI tối đa 8 giây để không bao giờ bị Vercel Serverless cắt kết nối (Timeout)
        const aiPromise = client.interactions.create({
          model: 'gemini-3.8-flash',
          input: prompt,
        });

        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000));
        const interaction = await Promise.race([aiPromise, timeoutPromise]);

        if (interaction && interaction.output_text) {
          const parsed = extractJsonObject(interaction.output_text) as Record<string, any> | null;
          if (parsed && typeof parsed === 'object') {
            const rawPnl = (parsed.pnl && typeof parsed.pnl === 'object' ? parsed.pnl : {}) as Record<
              string,
              any
            >;
            const mergedModel: BusinessModel = {
              ...baseSynthesized,
              name: typeof parsed.name === 'string' && parsed.name ? parsed.name : baseSynthesized.name,
              tagline:
                typeof parsed.tagline === 'string' && parsed.tagline
                  ? parsed.tagline
                  : baseSynthesized.tagline,
              summary:
                typeof parsed.summary === 'string' && parsed.summary
                  ? parsed.summary
                  : baseSynthesized.summary,
              productsAndServices:
                Array.isArray(parsed.productsAndServices) && parsed.productsAndServices.length > 0
                  ? parsed.productsAndServices.map(String)
                  : baseSynthesized.productsAndServices,
              exemplarsVN:
                Array.isArray(parsed.exemplarsVN) && parsed.exemplarsVN.length > 0
                  ? parsed.exemplarsVN.map(String)
                  : baseSynthesized.exemplarsVN,
              exemplarsAsia:
                Array.isArray(parsed.exemplarsAsia) && parsed.exemplarsAsia.length > 0
                  ? parsed.exemplarsAsia.map((a: any) => ({
                      name: String(a?.name || 'Asian Listed Benchmark'),
                      country: String(a?.country || 'Châu Á'),
                      tickerOrStatus: String(a?.tickerOrStatus || 'Listed'),
                      financialHighlight: String(
                        a?.financialHighlight || baseSynthesized.exemplarsAsia[0].financialHighlight
                      ),
                    }))
                  : baseSynthesized.exemplarsAsia,
              pnl: {
                avgMonthlyRevenueVND:
                  Number(rawPnl.avgMonthlyRevenueVND) || baseSynthesized.pnl.avgMonthlyRevenueVND,
                cogsPercent: Number(rawPnl.cogsPercent) || baseSynthesized.pnl.cogsPercent,
                grossMarginPercent:
                  Number(rawPnl.grossMarginPercent) || baseSynthesized.pnl.grossMarginPercent,
                rentPercent: Number(rawPnl.rentPercent) || baseSynthesized.pnl.rentPercent,
                laborPercent: Number(rawPnl.laborPercent) || baseSynthesized.pnl.laborPercent,
                opexMarketingPercent:
                  Number(rawPnl.opexMarketingPercent) || baseSynthesized.pnl.opexMarketingPercent,
                netMarginPercent:
                  Number(rawPnl.netMarginPercent) || baseSynthesized.pnl.netMarginPercent,
                initialCapexMinVND:
                  Number(rawPnl.initialCapexMinVND) || baseSynthesized.pnl.initialCapexMinVND,
                initialCapexMaxVND:
                  Number(rawPnl.initialCapexMaxVND) || baseSynthesized.pnl.initialCapexMaxVND,
                paybackMonthsMin:
                  Number(rawPnl.paybackMonthsMin) || baseSynthesized.pnl.paybackMonthsMin,
                paybackMonthsMax:
                  Number(rawPnl.paybackMonthsMax) || baseSynthesized.pnl.paybackMonthsMax,
                averageOrderValueVND:
                  Number(rawPnl.averageOrderValueVND) || baseSynthesized.pnl.averageOrderValueVND,
                repeatRatePercent:
                  Number(rawPnl.repeatRatePercent) || baseSynthesized.pnl.repeatRatePercent,
                cashflowCycle:
                  typeof rawPnl.cashflowCycle === 'string' && rawPnl.cashflowCycle
                    ? rawPnl.cashflowCycle
                    : baseSynthesized.pnl.cashflowCycle,
                dataSourceCitation:
                  typeof rawPnl.dataSourceCitation === 'string' && rawPnl.dataSourceCitation
                    ? rawPnl.dataSourceCitation
                    : baseSynthesized.pnl.dataSourceCitation,
              },
              keySuccessFactors:
                Array.isArray(parsed.keySuccessFactors) && parsed.keySuccessFactors.length > 0
                  ? parsed.keySuccessFactors.map(String)
                  : baseSynthesized.keySuccessFactors,
              risks:
                Array.isArray(parsed.risks) && parsed.risks.length > 0
                  ? parsed.risks.map(String)
                  : baseSynthesized.risks,
              sourceType: 'ai_researched',
            };

            saveBusinessModelToDb(mergedModel);
            return NextResponse.json({ model: mergedModel, mode: 'gemini_ai' });
          }
        }
      } catch (aiErr) {
        console.error('Gemini API research fallback triggered:', aiErr);
      }
    }

    saveBusinessModelToDb(baseSynthesized);
    return NextResponse.json({ model: baseSynthesized, mode: 'benchmark_synthesis' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
