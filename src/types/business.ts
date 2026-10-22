export type AgeSegmentId =
  | 'infant'       // Trẻ sơ sinh < 18 tháng
  | 'toddler'      // Trẻ em < 6 tuổi
  | 'school'       // Học sinh (6 - 18 tuổi)
  | 'student'      // Sinh viên (18 - 22 tuổi)
  | 'young_family' // Đi làm & Gia đình trẻ (22 - 35 tuổi)
  | 'middle_age'   // Trung niên (35 - 55 tuổi)
  | 'senior'       // Cao tuổi (> 55 tuổi)
  | 'pet';         // Thú cưng

export type MaslowNeedId =
  | 'eat'          // Ăn (Ẩm thực, Dinh dưỡng, Đồ uống)
  | 'live'         // Ở (Không gian sống, Lưu trú, Tiện ích nhà cửa)
  | 'wear'         // Mặc (Thời trang, Chăm sóc cơ thể, Phụ kiện)
  | 'play'         // Vui chơi giải trí (Trải nghiệm, Giải trí, Thể thao)
  | 'grow'         // Phát triển bản thân (Giáo dục, Kỹ năng, Y tế & Sức khỏe)
  | 'community';   // Cộng đồng (Kết nối, Hội nhóm, Tâm linh, Xã hội)

export type PriceTierId =
  | 'budget'       // Giá rẻ (Mass / Tiết kiệm)
  | 'mid'          // Bình dân (Trung cấp / Phổ thông)
  | 'premium';     // Cao cấp (High-end / Luxury)

export interface AsianBenchmark {
  name: string;
  country: string;
  tickerOrStatus: string;
  financialHighlight: string;
}

export interface PnLProfile {
  avgMonthlyRevenueVND: number; // Triệu VNĐ / tháng / điểm bán
  cogsPercent: number;          // % Giá vốn (COGS)
  grossMarginPercent: number;   // % Lợi nhuận gộp
  rentPercent: number;          // % Chi phí mặt bằng
  laborPercent: number;         // % Chi phí nhân sự
  opexMarketingPercent: number; // % Marketing, điện nước, vận hành
  netMarginPercent: number;     // % Lợi nhuận ròng (Net Margin / EBITDA)
  initialCapexMinVND: number;   // Vốn đầu tư ban đầu tối thiểu (Triệu VNĐ)
  initialCapexMaxVND: number;   // Vốn đầu tư ban đầu tối đa (Triệu VNĐ)
  paybackMonthsMin: number;     // Thời gian hoàn vốn tối thiểu (tháng)
  paybackMonthsMax: number;     // Thời gian hoàn vốn tối đa (tháng)
  averageOrderValueVND: number; // Giá trị đơn hàng trung bình - AOV (Nghìn VNĐ)
  repeatRatePercent: number;    // Tỷ lệ khách quay lại (%)
  cashflowCycle: string;        // Đặc điểm dòng tiền & vòng quay vốn
  dataSourceCitation: string;   // Nguồn trích dẫn (Báo chính thống, BCTC niêm yết Châu Á, Nội suy)
}

export type POICategory =
  | 'school'        // Trường học (Mầm non, Cấp 1-2-3, Đại học)
  | 'hospital'      // Bệnh viện, Phòng khám, Nhà thuốc
  | 'park'          // Công viên, Khu vui chơi, Thể thao
  | 'market'        // Chợ truyền thống, Siêu thị, TTTM
  | 'apartment'     // Chung cư, Khu đô thị, Khu dân cư
  | 'office'        // Tòa nhà văn phòng, Khu công nghiệp
  | 'tourism';      // Điểm du lịch, Khách sạn, Phố đi bộ

export interface BusinessModel {
  id: string;
  name: string;
  tagline: string;
  isMultiNeed: boolean;
  ageSegments: AgeSegmentId[];
  maslowNeeds: MaslowNeedId[];
  priceTier: PriceTierId;
  summary: string;
  productsAndServices: string[];
  exemplarsVN: string[];
  exemplarsAsia: AsianBenchmark[];
  pnl: PnLProfile;
  locationRequirements: {
    idealPOIs: POICategory[];
    minAreaM2: number;
    footTrafficNotes: string;
  };
  ikigaiProfile: {
    passions: string[];
    skills: string[];
    techLevel: 'basic' | 'moderate' | 'advanced';
    networkAdvantages: string[];
    goalFit: ('cashflow_fast' | 'high_margin' | 'scalable_chain' | 'semi_passive')[];
  };
  keySuccessFactors: string[];
  risks: string[];
  createdAt?: string;
  sourceType?: 'curated' | 'ai_researched';
}

export interface DiscoveredPOI {
  id: string;
  name: string;
  category: POICategory;
  subType: string;
  lat: number;
  lng: number;
  distanceMeters: number;
  estimatedCustomerNote: string;
}

export interface DemographicProfile {
  populationDensity: string;
  estimatedPopulationInRadius: number;
  avgMonthlyIncomeVND: string;
  dominantOccupations: string[];
  spendingBehavior: string;
  localNewsAndPotential: string[];
  ageSegmentScores: Record<AgeSegmentId, number>; // Điểm tiềm năng 0-100 cho 8 nhóm tuổi
  priceTierFit: Record<PriceTierId, number>;      // Điểm phù hợp 0-100 cho 3 phân khúc giá
  needDemandScores: Record<MaslowNeedId, number>; // Điểm nhu cầu 0-100 cho 6 nhu cầu Maslow
  topCustomerSummary: string;
  citations: { title: string; url: string }[];
}

export interface AreaIntelligenceRecord {
  cacheKey: string;
  locationName: string;
  lat: number;
  lng: number;
  radiusKm: number;
  pois: DiscoveredPOI[];
  poiCounts: Record<POICategory, number>;
  demographics: DemographicProfile;
  dataSource: 'osm_overpass' | 'google_places';
  cachedAt: string;
  fromCache?: boolean;
}

export interface IkigaiUserInput {
  passions: string[];         // Cái bạn yêu thích (Love)
  strongestSkills: string[];  // Cái bạn giỏi nhất (Good at)
  capitalBudgetMilVND: number;// Nguồn lực tài chính (Triệu VNĐ)
  riskTolerance: 'low' | 'medium' | 'high';
  techCapability: 'basic' | 'moderate' | 'advanced';
  networks: string[];         // Đối tác & mối quan hệ sẵn có
  primaryGoals: ('cashflow_fast' | 'high_margin' | 'scalable_chain' | 'semi_passive')[];
  personalNote: string;
}

export interface ScoredRecommendation {
  model: BusinessModel;
  totalScore: number;         // 0 - 100
  locationScore: number;      // 0 - 100 (Khớp với tệp KH và POI tại địa phương)
  ikigaiScore: number;        // 0 - 100 (Khớp với Đam mê & Sở trường)
  resourceScore: number;      // 0 - 100 (Khớp với Vốn, Công nghệ, Quan hệ, Mục tiêu)
  matchReasons: string[];
  actionPlan: string[];
  warnings: string[];
}

export interface LeadUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash?: string;
  capitalBudgetMilVND: number;
  targetArea: string;
  scannedLocations: string[];
  topRecommendedModels: string[];
  reportSentCount: number;
  lastReportSentAt?: string;
  lastActiveAt: string;
  createdAt: string;
}

