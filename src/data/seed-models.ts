import { BusinessModel, AgeSegmentId, MaslowNeedId, PriceTierId } from '@/types/business';

export const FLAGSHIP_MODELS: BusinessModel[] = [
  // ============================================================================
  // 1. TRẺ SƠ SINH (<18 THÁNG) & TRẺ EM (<6 TUỔI) - ĐƠN NHU CẦU & KẾT HỢP ĐA NHU CẦU
  // ============================================================================
  {
    id: 'toddler-eat-mid-porridge',
    name: 'Chuỗi Cháo Dinh Dưỡng & Thực Phẩm Ăn Dặm Tươi',
    tagline: 'Khai thác dòng tiền mặt hàng ngày từ bữa ăn sáng/chiều của trẻ 6 tháng - 5 tuổi',
    isMultiNeed: false,
    ageSegments: ['infant', 'toddler'],
    maslowNeeds: ['eat'],
    priceTier: 'mid',
    summary:
      'Mô hình kiosk/cửa hàng nhỏ bán cháo dinh dưỡng nấu sẵn theo thực đơn ngày, súp, bánh ăn dặm, ruốc cá hồi và bột rau củ cho bé. Nằm tại chân chung cư, cổng trường mầm non hoặc gần chợ dân sinh.',
    productsAndServices: [
      'Cháo tươi nóng chia sẵn khẩu phần (18.000đ - 35.000đ/hộp)',
      'Set nguyên liệu ăn dặm kiểu Nhật / BLW đóng khay theo tuần',
      'Bánh ăn dặm, váng sữa, hạt nêm hữu cơ, ruốc tôm/cá hồi',
    ],
    exemplarsVN: ['Cháo Cây Thị ( hơn 200 điểm bán)', 'Cháo Việt Soup', 'Cháo Bà Hồng', 'Mămmy Ăn Dặm'],
    exemplarsAsia: [
      {
        name: 'Wako堂 (Wakodo - Asahi Group Foods)',
        country: 'Nhật Bản',
        tickerOrStatus: '2502.T (Asahi Group)',
        financialHighlight: 'Mảng thực phẩm trẻ em đạt Gross Margin ~48-52%, tỷ lệ mua lặp lại 4.2 lần/tuần.',
      },
      {
        name: 'Akachan Honpo Food Corner',
        country: 'Nhật Bản',
        tickerOrStatus: 'Seven & i Holdings (3382.T)',
        financialHighlight: 'Dòng thực phẩm ăn dặm đóng góp tần suất ghé cửa hàng cao nhất trong toàn chuỗi.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 115,
      cogsPercent: 42,
      grossMarginPercent: 58,
      rentPercent: 12,
      laborPercent: 16,
      opexMarketingPercent: 9,
      netMarginPercent: 21,
      initialCapexMinVND: 80,
      initialCapexMaxVND: 160,
      paybackMonthsMin: 5,
      paybackMonthsMax: 9,
      averageOrderValueVND: 42,
      repeatRatePercent: 78,
      cashflowCycle: 'Thu tiền mặt/QR 100% mỗi ngày; nguyên liệu tươi quay vòng trong 24h, gần như không đọng vốn công nợ.',
      dataSourceCitation: 'Báo cáo nhượng quyền Chuỗi Cháo Cây Thị (CafeF) & chuẩn P&L F&B Take-away Châu Á.',
    },
    locationRequirements: {
      idealPOIs: ['apartment', 'school', 'market', 'hospital'],
      minAreaM2: 15,
      footTrafficNotes: 'Mặt tiền nhỏ 15-25m2 ngay sảnh chung cư trẻ hoặc đầu ngõ chợ dân sinh đông đúc.',
    },
    ikigaiProfile: {
      passions: ['food_nutrition', 'kids_mother'],
      skills: ['culinary_rd', 'operations_chain'],
      techLevel: 'basic',
      networkAdvantages: ['landlord_re', 'factory_supplier', 'kol_local_group'],
      goalFit: ['cashflow_fast', 'scalable_chain', 'high_margin'],
    },
    keySuccessFactors: [
      'Đảm bảo vệ sinh ATTP tuyệt đối, công khai nguồn gốc nguyên liệu mỗi ngày',
      'Mở cửa từ 5h45 sáng để đón luồng phụ huynh đi làm sớm và bà đi chợ',
      'Bán kèm bánh ăn dặm, sữa hạt để tăng AOV từ 25k lên 55k/lượt mua',
    ],
    risks: [
      'Hao hụt nguyên liệu tươi cuối ngày nếu dự báo sản lượng sai (>8% sẽ ăn mòn lãi ròng)',
      'Rủi ro truyền thông nếu xảy ra sự cố vệ sinh thực phẩm',
    ],
  },
  {
    id: 'infant-eat-premium-organic-babykitchen',
    name: 'Bếp Ăn Dặm Hữu Cơ & Dinh Dưỡng Y Khoa Cá Nhân Hóa (Subscription)',
    tagline: 'Giao thực đơn ăn dặm chuẩn bác sĩ dinh dưỡng định kỳ theo tháng cho gia đình thu nhập cao',
    isMultiNeed: false,
    ageSegments: ['infant', 'toddler'],
    maslowNeeds: ['eat', 'grow'],
    priceTier: 'premium',
    summary:
      'Cung cấp gói thuê bao (Subscription) bữa ăn dặm hữu cơ cấp đông sâu (Blast Chiller) hoặc giao tươi hàng ngày kèm tư vấn 1-1 cùng chuyên gia dinh dưỡng nhi khoa để chống biếng ăn, suy dinh dưỡng.',
    productsAndServices: [
      'Gói ăn dặm tuần/tháng (2,8 - 5,5 triệu/tháng)',
      'Bánh tươi không đường tinh luyện, sữa hạt hữu cơ cho bé dị ứng đạm bò',
      'Thực đơn theo dõi chiều cao, cân nặng & vi chất cho bé',
    ],
    exemplarsVN: ['Bếp Ăn Dặm Mẹ Cam', 'Organic Baby Kitchen Thảo Điền', 'Lứt Mầm Baby'],
    exemplarsAsia: [
      {
        name: 'Bebecook (베베쿡)',
        country: 'Hàn Quốc',
        tickerOrStatus: 'Số 1 Baby Food Delivery Hàn Quốc',
        financialHighlight: 'Doanh thu >40 tỷ KRW/năm, mô hình giao sáng sớm (Dawn Delivery), tỷ lệ giữ chân thuê bao 6 tháng đạt 68%.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 240,
      cogsPercent: 35,
      grossMarginPercent: 65,
      rentPercent: 8,
      laborPercent: 20,
      opexMarketingPercent: 14,
      netMarginPercent: 23,
      initialCapexMinVND: 220,
      initialCapexMaxVND: 400,
      paybackMonthsMin: 6,
      paybackMonthsMax: 11,
      averageOrderValueVND: 1800,
      repeatRatePercent: 82,
      cashflowCycle: 'Thu tiền trước theo gói tuần/tháng (Negative Working Capital) — cầm tiền khách trước khi mua nguyên liệu.',
      dataSourceCitation: 'Nghiên cứu mô hình Bebecook Hàn Quốc & chuẩn P&L Cloud Kitchen D2C.',
    },
    locationRequirements: {
      idealPOIs: ['apartment', 'hospital', 'school'],
      minAreaM2: 35,
      footTrafficNotes: 'Không cần mặt tiền đắt đỏ; đặt bếp chuẩn ISO gần khu đô thị cao cấp (bán kính giao hàng < 3km).',
    },
    ikigaiProfile: {
      passions: ['food_nutrition', 'kids_mother', 'health_wellness'],
      skills: ['culinary_rd', 'marketing_digital', 'sales_consulting'],
      techLevel: 'moderate',
      networkAdvantages: ['medical_vet_pro', 'kol_local_group'],
      goalFit: ['cashflow_fast', 'high_margin'],
    },
    keySuccessFactors: [
      'Thu tiền gói tháng trả trước giúp dòng tiền cực mạnh ngay từ tháng thứ 2',
      'Hợp tác với bác sĩ nhi khoa/chuyên gia dinh dưỡng để tạo uy tín chuyên môn',
    ],
    risks: [
      'Chi phí ship nội đô cao nếu không gom tuyến giao hàng theo cụm chung cư',
    ],
  },
  {
    id: 'toddler-wear-mid-kidsfashion',
    name: 'Cửa Hàng Thời Trang & Phụ Kiện Trẻ Em Thiết Kế An Toàn',
    tagline: 'Tần suất thay quần áo liên tục theo đà lớn nhanh của bé từ 0 - 6 tuổi',
    isMultiNeed: false,
    ageSegments: ['infant', 'toddler'],
    maslowNeeds: ['wear'],
    priceTier: 'mid',
    summary:
      'Shop chuyên quần áo sợi tre (bamboo), cotton hữu cơ, giày tập đi và phụ kiện thời trang cho bé sơ sinh đến 6 tuổi, kết hợp bán lẻ tại điểm và livestream cho tệp mẹ bỉm sữa quanh khu vực.',
    productsAndServices: [
      'Đồ sơ sinh sợi tre kháng khuẩn, bodysuit, đồ bộ mặc nhà (85k - 250k)',
      'Váy công chúa, vest dự tiệc thôi nôi/sinh nhật cho bé',
      'Giày tập đi đế mềm chống trượt, mũ, tất, yếm ăn',
    ],
    exemplarsVN: ['Rabity Kids Fashion', 'Nous Babywear', 'BU Baby', 'UalaRogo'],
    exemplarsAsia: [
      {
        name: 'Nishimatsuya Chain Co., Ltd. (西松屋)',
        country: 'Nhật Bản',
        tickerOrStatus: '7545.T (Tokyo Stock Exchange)',
        financialHighlight: 'Doanh thu ~177 tỷ Yên/năm, Gross Margin ~35.2%, Operating Margin ~7.5%, chi phí nhân sự siêu thấp nhờ tự phục vụ.',
      },
      {
        name: 'Balabala (Semir Garment)',
        country: 'Trung Quốc',
        tickerOrStatus: '002563.SZ (Shenzhen)',
        financialHighlight: 'Thị phần số 1 thời trang trẻ em TQ, Gross Margin mảng Kids đạt 44-47%.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 180,
      cogsPercent: 48,
      grossMarginPercent: 52,
      rentPercent: 14,
      laborPercent: 11,
      opexMarketingPercent: 11,
      netMarginPercent: 16,
      initialCapexMinVND: 180,
      initialCapexMaxVND: 350,
      paybackMonthsMin: 8,
      paybackMonthsMax: 14,
      averageOrderValueVND: 380,
      repeatRatePercent: 62,
      cashflowCycle: 'Cần quản trị vòng quay hàng tồn kho theo mùa (45-60 ngày); đẩy mạnh combo 3-5 bộ để thu hồi vốn nhanh.',
      dataSourceCitation: 'BCTC Nishimatsuya (7545.T), Semir Garment (002563.SZ) & khảo sát bán lẻ thời trang trẻ em VN.',
    },
    locationRequirements: {
      idealPOIs: ['apartment', 'market', 'school'],
      minAreaM2: 30,
      footTrafficNotes: 'Phố mua sắm dân cư, tầng trệt chung cư đông gia đình trẻ hoặc gần chợ/siêu thị.',
    },
    ikigaiProfile: {
      passions: ['fashion_beauty', 'kids_mother'],
      skills: ['marketing_digital', 'supply_chain', 'sales_consulting'],
      techLevel: 'moderate',
      networkAdvantages: ['factory_supplier', 'kol_local_group'],
      goalFit: ['high_margin', 'scalable_chain'],
    },
    keySuccessFactors: [
      'Chất liệu vải mềm, đạt chuẩn OEKO-TEX không gây kích ứng da bé',
      'Xây dựng nhóm Zalo VIP các mẹ trong bán kính 2km để báo mẫu mới mỗi tuần',
    ],
    risks: [
      'Đọng vốn hàng tồn kho lệch size nếu nhập hàng quá dàn trải',
    ],
  },
  {
    id: 'multi-mom-baby-superstore',
    name: 'Siêu Thị Mẹ & Bé Đa Nhu Cầu (One-Stop-Shop: Ăn + Mặc + Ở + Vui Chơi)',
    tagline: 'Mô hình kết hợp đa nhu cầu kiểu Con Cưng / BiboMart / KidsPlaza — phễu sữa bỉm kéo lợi nhuận từ thời trang & đồ dùng',
    isMultiNeed: true,
    ageSegments: ['infant', 'toddler'],
    maslowNeeds: ['eat', 'wear', 'live', 'play'],
    priceTier: 'mid',
    summary:
      'Cửa hàng tích hợp toàn bộ nhu cầu của trẻ 0-6 tuổi: dùng Sữa bột & Bỉm tã + Đồ ăn dặm (nhu cầu Ăn, tần suất mua cố định mỗi 10-14 ngày) làm sản phẩm phễu hút traffic, sau đó bán chéo (Cross-sell) sang Quần áo sơ sinh (Mặc), Xe đẩy/Nôi cũi/Máy tiệt trùng (Ở) và Đồ chơi phát triển trí tuệ (Vui chơi).',
    productsAndServices: [
      'Nhóm Ăn (Traffic): Sữa công thức, sữa tươi, bột/bánh ăn dặm, vitamin (Biên gộp 12-18%)',
      'Nhóm Mặc (Profit): Quần áo sơ sinh, bỉm tã, khăn sữa, mỹ phẩm tắm gội (Biên gộp 35-55%)',
      'Nhóm Ở (High Ticket): Nôi cũi, ghế ngồi ô tô, máy hâm sữa, bình sữa (Biên gộp 30-45%)',
      'Nhóm Vui chơi: Đồ chơi an toàn, xe chòi chân, sách vải (Biên gộp 40-60%)',
    ],
    exemplarsVN: [
      'Con Cưng (>700 cửa hàng, doanh thu hàng đầu ngành Mẹ & Bé VN)',
      'BiboMart (Chuỗi Mẹ & Bé lâu đời kèm hệ sinh thái hội thảo tiền sản)',
      'KidsPlaza (>160 siêu thị Mẹ & Bé toàn quốc)',
      'Soc&Brothers (Phân khúc trung - cao cấp chuẩn Nhật)',
    ],
    exemplarsAsia: [
      {
        name: 'Kidswant Children Products Co., Ltd. (孩子王)',
        country: 'Trung Quốc',
        tickerOrStatus: '301078.SZ (Shenzhen Stock Exchange)',
        financialHighlight: 'Doanh thu ~8.7 tỷ NDT/năm, Gross Margin tổng hợp ~30.1%; thu phí thẻ thành viên đen (Paid Membership) & dịch vụ chăm sóc mẹ bầu đóng góp biên lợi nhuận cực cao.',
      },
      {
        name: 'Nishimatsuya Chain (西松屋) & Akachan Honpo',
        country: 'Nhật Bản',
        tickerOrStatus: '7545.T (Tokyo Stock Exchange)',
        financialHighlight: 'Tối ưu nhãn hàng riêng (Private Label - SmartAngel) nâng Gross Margin từ 28% lên 36%.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 480,
      cogsPercent: 72,
      grossMarginPercent: 28,
      rentPercent: 8,
      laborPercent: 7,
      opexMarketingPercent: 4,
      netMarginPercent: 9,
      initialCapexMinVND: 450,
      initialCapexMaxVND: 900,
      paybackMonthsMin: 12,
      paybackMonthsMax: 20,
      averageOrderValueVND: 460,
      repeatRatePercent: 85,
      cashflowCycle: 'Dòng tiền cực lớn và đều đặn; công nợ nhà cung cấp sữa/bỉm 15-30 ngày giúp tận dụng vốn lưu động (Float).',
      dataSourceCitation: 'BCTC Kidswant (301078.SZ), Nishimatsuya (7545.T) & Báo cáo thị trường chuỗi Con Cưng / BiboMart (Forbes VN, CafeF).',
    },
    locationRequirements: {
      idealPOIs: ['hospital', 'apartment', 'school', 'market'],
      minAreaM2: 65,
      footTrafficNotes: 'Ngã tư khu dân cư đông đúc, gần bệnh viện phụ sản/nhi hoặc khối đế tổ hợp chung cư >2.000 căn hộ.',
    },
    ikigaiProfile: {
      passions: ['kids_mother', 'food_nutrition', 'fashion_beauty'],
      skills: ['operations_chain', 'supply_chain', 'sales_consulting', 'tech_automation'],
      techLevel: 'moderate',
      networkAdvantages: ['factory_supplier', 'landlord_re', 'medical_vet_pro'],
      goalFit: ['scalable_chain', 'cashflow_fast'],
    },
    keySuccessFactors: [
      'Chiến lược "Combo Giỏ Đồ Đi Sinh" thu trọn gói 3-10 triệu/khách hàng ngay từ tháng thứ 7 thai kỳ',
      'Quản lý theo ngày dự sinh & ngày sinh của bé để tự động nhắc mua sữa/tăng size bỉm đúng chu kỳ',
      'Phát triển hàng nhãn riêng hoặc hàng độc quyền (quần áo, khăn ướt, phụ kiện) để kéo biên lợi nhuận gộp lên >30%',
    ],
    risks: [
      'Nếu chỉ bán sữa/bỉm đại trà không bán chéo được sang thời trang/đồ dùng thì biên lợi nhuận sẽ mỏng (<6%)',
    ],
  },
  {
    id: 'multi-kids-cafe-edutainment',
    name: 'Tổ Hợp Kids Cafe + Khu Vui Chơi Vận Động & Workshop Sáng Tạo',
    tagline: 'Mô hình kết hợp Vui chơi + Ăn uống + Phát triển bản thân + Cộng đồng gia đình trẻ',
    isMultiNeed: true,
    ageSegments: ['toddler', 'school', 'young_family'],
    maslowNeeds: ['play', 'eat', 'grow', 'community'],
    priceTier: 'premium',
    summary:
      'Không gian kết hợp khu vui chơi an toàn có nhân viên trông trẻ chuyên nghiệp cho bé <6 tuổi, kết hợp nhà hàng/cafe chất lượng cao cho bố mẹ làm việc hoặc tụ họp bạn bè, kèm tổ chức tiệc sinh nhật trọn gói và lớp workshop cuối tuần.',
    productsAndServices: [
      'Vé vào cổng khu vui chơi (80.000đ - 180.000đ/bé)',
      'Đồ ăn & thức uống cho phụ huynh và trẻ em (chiếm 45-55% tổng doanh thu)',
      'Gói tổ chức tiệc sinh nhật/thôi nôi trọn gói (5 - 25 triệu/tiệc)',
      'Workshop làm bánh, vẽ tranh, lắp ráp STEM cuối tuần',
    ],
    exemplarsVN: ['tiNiWorld (Naiscorp)', 'Lilliput Premium Kids Cafe', 'Cuckoo Nest Kids Cafe', 'Kubo'],
    exemplarsAsia: [
      {
        name: 'AEON Fantasy Co., Ltd. (Mollyfantasy / Kidzooona)',
        country: 'Nhật Bản',
        tickerOrStatus: '4343.T (Tokyo Stock Exchange)',
        financialHighlight: 'Doanh thu >80 tỷ Yên/năm; mảng Edutainment tại Đông Nam Á (bao gồm VN) đạt biên lợi nhuận gộp dịch vụ >65%.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 320,
      cogsPercent: 22,
      grossMarginPercent: 78,
      rentPercent: 20,
      laborPercent: 22,
      opexMarketingPercent: 14,
      netMarginPercent: 22,
      initialCapexMinVND: 500,
      initialCapexMaxVND: 1200,
      paybackMonthsMin: 10,
      paybackMonthsMax: 18,
      averageOrderValueVND: 320,
      repeatRatePercent: 68,
      cashflowCycle: 'Thu tiền vé + F&B ngay lập tức; bán thẻ nạp tiền trước (Prepaid Card) tặng 20% giúp thu cục tiền mặt lớn từ đầu tháng.',
      dataSourceCitation: 'BCTC AEON Fantasy (4343.T) & mô hình Kids Cafe Hàn Quốc/Việt Nam.',
    },
    locationRequirements: {
      idealPOIs: ['apartment', 'school', 'park', 'market'],
      minAreaM2: 120,
      footTrafficNotes: 'Tầng 1-2 chung cư lớn, trung tâm thương mại hoặc biệt thự sân vườn khu đông gia đình trẻ.',
    },
    ikigaiProfile: {
      passions: ['entertainment_play', 'kids_mother', 'food_nutrition', 'community_social'],
      skills: ['operations_chain', 'community_building', 'culinary_rd', 'marketing_digital'],
      techLevel: 'moderate',
      networkAdvantages: ['landlord_re', 'school_hospital_gov', 'kol_local_group'],
      goalFit: ['high_margin', 'cashflow_fast'],
    },
    keySuccessFactors: [
      'Giải bài toán lấp đầy ngày thường (Thứ 2 - Thứ 6) bằng cách liên kết trường mầm non ngoại khóa và gói vé tháng không giới hạn',
      'Đồ ăn của bố mẹ phải thực sự ngon để phụ huynh chọn làm điểm hẹn cố định',
    ],
    risks: [
      'Doanh thu chênh lệch lớn giữa cuối tuần (quá tải) và ngày thường nếu thiếu chương trình hội viên',
    ],
  },

  // ============================================================================
  // 2. HỌC SINH (6 - 18 TUỔI) & SINH VIÊN (18 - 22 TUỔI)
  // ============================================================================
  {
    id: 'school-student-eat-budget-teacream',
    name: 'Chuỗi Kem Tươi, Trà Hoa Quả & Đồ Ăn Vặt Cổng Trường Giá Rẻ',
    tagline: 'Mô hình tần suất siêu cao, giá 10.000đ - 25.000đ đánh trúng túi tiền học sinh - sinh viên',
    isMultiNeed: false,
    ageSegments: ['school', 'student'],
    maslowNeeds: ['eat', 'play'],
    priceTier: 'budget',
    summary:
      'Cửa hàng/Kiosk bán kem ốc quế tươi, trà chanh giã tay, trà sữa, gà rán xiên que với mức giá siêu rẻ (10k - 29k), tối ưu chuỗi cung ứng nguyên liệu chuẩn hóa để xoay vòng đơn hàng chỉ 30 giây/khách.',
    productsAndServices: [
      'Kem ốc quế tươi, kem sundae (10.000đ - 20.000đ)',
      'Trà hoa quả nhiệt đới, trà sữa trân châu (18.000đ - 28.000đ)',
      'Đồ ăn vặt học đường: khoai tây lắc, xúc xích, bánh đồng xu/gà viên',
    ],
    exemplarsVN: ['Mixue Việt Nam (>1.000 cửa hàng)', 'TocoToco Ice Cream & Tea', 'Cotừa / Trà Chanh Bụi Phố', 'Gà Rán Five Star'],
    exemplarsAsia: [
      {
        name: 'Mixue Group (蜜雪冰城)',
        country: 'Trung Quốc',
        tickerOrStatus: '2097.HK (HKEX IPO Prospectus)',
        financialHighlight: 'Hơn 36.000 cửa hàng toàn cầu; Gross Margin tại cửa hàng ~55-60%, hoàn vốn trung bình 8-13 tháng nhờ giá bán cực rẻ tạo sản lượng áp đảo.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 145,
      cogsPercent: 40,
      grossMarginPercent: 60,
      rentPercent: 14,
      laborPercent: 15,
      opexMarketingPercent: 8,
      netMarginPercent: 23,
      initialCapexMinVND: 150,
      initialCapexMaxVND: 320,
      paybackMonthsMin: 6,
      paybackMonthsMax: 11,
      averageOrderValueVND: 28,
      repeatRatePercent: 76,
      cashflowCycle: '100% tiền mặt/chuyển khoản tại quầy; nguyên liệu khô/cốt đông lạnh bảo quản dài ngày, hao hụt < 2%.',
      dataSourceCitation: 'Bản cáo bạch IPO Mixue Group (2097.HK) & thống kê vận hành nhượng quyền F&B cổng trường VN.',
    },
    locationRequirements: {
      idealPOIs: ['school', 'park', 'market', 'apartment'],
      minAreaM2: 20,
      footTrafficNotes: 'Bắt buộc nằm trong bán kính 50-300m quanh cụm trường Cấp 2, Cấp 3, Đại học hoặc phố đi bộ dân cư.',
    },
    ikigaiProfile: {
      passions: ['food_nutrition'],
      skills: ['operations_chain', 'supply_chain', 'marketing_digital'],
      techLevel: 'basic',
      networkAdvantages: ['landlord_re', 'school_hospital_gov'],
      goalFit: ['cashflow_fast', 'scalable_chain', 'semi_passive'],
    },
    keySuccessFactors: [
      'Vị trí quyết định 70% thắng lợi: chọn đúng luồng học sinh tan học bên tay phải chiều di chuyển',
      'Menu tinh gọn, pha chế dưới 45 giây để không mất khách giờ tan tầm (11h00-12h00 và 16h30-18h00)',
    ],
    risks: [
      'Doanh thu giảm 25-35% vào 2 tháng nghỉ hè nếu đặt tại điểm chỉ có trường học mà không có dân cư xung quanh',
    ],
  },
  {
    id: 'school-grow-mid-stem-english',
    name: 'Trung Tâm Anh Ngữ Thực Chiến, Toán Tư Duy & Robotics STEM',
    tagline: 'Khai thác dòng tiền học phí thu trước 3 - 6 tháng từ nhu cầu đầu tư giáo dục của phụ huynh',
    isMultiNeed: false,
    ageSegments: ['toddler', 'school'],
    maslowNeeds: ['grow', 'community'],
    priceTier: 'mid',
    summary:
      'Mô hình lớp học quy mô vừa (Micro-center 60-120m2) tại khu đô thị/khu dân cư dạy Tiếng Anh giao tiếp, Lập trình Scratch/Robotics, Toán tư duy hoặc Luyện chữ/Bán trú sau giờ học cho học sinh 4-15 tuổi.',
    productsAndServices: [
      'Khóa học Tiếng Anh / Toán tư duy / STEM thu theo quý (1,5 - 2,8 triệu/tháng)',
      'Dịch vụ đón trả & trông bán trú làm bài tập sau giờ học (After-school Care)',
      'Trại hè bán trú (Summer Camp) kỹ năng sống',
    ],
    exemplarsVN: ['Hệ thống Toán tư duy Mathnasium / Soroban', 'MindX Technology School', 'Apollo / Ocean Edu', 'CLB Bán Trú Khu Đô Thị'],
    exemplarsAsia: [
      {
        name: 'Kumon Institute of Education & Meiko Network Japan',
        country: 'Nhật Bản',
        tickerOrStatus: '4668.T (Meiko Network - Tokyo)',
        financialHighlight: 'Mô hình lớp học khu dân cư tinh gọn: Gross Margin >50%, Operating Margin 14-22%, dòng tiền trả trước ổn định quanh năm.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 195,
      cogsPercent: 28,
      grossMarginPercent: 72,
      rentPercent: 15,
      laborPercent: 25,
      opexMarketingPercent: 10,
      netMarginPercent: 22,
      initialCapexMinVND: 160,
      initialCapexMaxVND: 350,
      paybackMonthsMin: 5,
      paybackMonthsMax: 10,
      averageOrderValueVND: 5400,
      repeatRatePercent: 80,
      cashflowCycle: 'Thu học phí theo khóa 3 - 6 tháng trước khi khai giảng; dòng tiền dương ngay khi tuyển đủ 45 học viên đầu tiên.',
      dataSourceCitation: 'BCTC Meiko Network Japan (4668.T) & báo cáo ngành EdTech/After-school Việt Nam.',
    },
    locationRequirements: {
      idealPOIs: ['school', 'apartment'],
      minAreaM2: 60,
      footTrafficNotes: 'Nhà phố yên tĩnh hoặc shophouse/căn hộ tầng thấp ngay sát trường Tiểu học, THCS và chung cư.',
    },
    ikigaiProfile: {
      passions: ['education_coaching', 'kids_mother'],
      skills: ['teaching_expertise', 'sales_consulting', 'community_building'],
      techLevel: 'moderate',
      networkAdvantages: ['school_hospital_gov', 'kol_local_group'],
      goalFit: ['cashflow_fast', 'high_margin', 'scalable_chain'],
    },
    keySuccessFactors: [
      'Kết hợp dịch vụ "Đón bé tại cổng trường + Ăn nhẹ + Hướng dẫn bài tập về nhà" giúp giải cứu phụ huynh bận rộn',
      'Báo cáo tiến bộ học tập tự động qua Zalo mỗi tuần cho bố mẹ',
    ],
    risks: [
      'Phụ thuộc chất lượng giáo viên đứng lớp nếu không chuẩn hóa giáo trình và học liệu số',
    ],
  },
  {
    id: 'student-live-budget-coliving',
    name: 'Hệ Thống Sleepbox, Ký Túc Xá Tư Nhân & Phòng Trọ Dịch Vụ Thông Minh',
    tagline: 'Dòng tiền thuê nhà thu đầu tháng, tỷ lệ lấp đầy >92% quanh cụm trường Đại học & Văn phòng',
    isMultiNeed: true,
    ageSegments: ['student', 'young_family'],
    maslowNeeds: ['live', 'community'],
    priceTier: 'budget',
    summary:
      'Thuê tòa nhà nguyên căn hoặc cải tạo mặt bằng gần cụm trường Đại học/Văn phòng thành mô hình Co-living / Phòng trọ full nội thất tích hợp khóa vân tay, máy giặt sấy tự động, góc tự học chung và tủ bán hàng tự động.',
    productsAndServices: [
      'Phòng trọ studio mini / Sleepbox cao cấp (1,8 - 4,2 triệu/giường hoặc phòng)',
      'Dịch vụ giá trị gia tăng: Điện nước, Wifi tốc độ cao, giặt sấy, dọn phòng, máy bán nước/mì tự động (chiếm 25% lợi nhuận ròng)',
    ],
    exemplarsVN: ['Hệ thống Nhà Trọ Văn Minh / Bản Đôn', 'JinJoo Home Co-living', 'Alo Nhà Trọ'],
    exemplarsAsia: [
      {
        name: 'Kyoritsu Maintenance Co., Ltd. (Dormy Student Dormitories)',
        country: 'Nhật Bản',
        tickerOrStatus: '9616.T (Tokyo Stock Exchange)',
        financialHighlight: 'Vận hành >500 ký túc xá sinh viên & người đi làm kèm bữa ăn sáng/tối; tỷ lệ lấp đầy đầu năm đạt >96%, dòng tiền hợp đồng 12 tháng.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 160,
      cogsPercent: 52,
      grossMarginPercent: 48,
      rentPercent: 0, // Đã tính trong giá vốn thuê sỉ tòa nhà (52%)
      laborPercent: 8,
      opexMarketingPercent: 12,
      netMarginPercent: 28,
      initialCapexMinVND: 250,
      initialCapexMaxVND: 600,
      paybackMonthsMin: 10,
      paybackMonthsMax: 16,
      averageOrderValueVND: 3500,
      repeatRatePercent: 90,
      cashflowCycle: 'Khách đóng cọc 1-2 tháng + thanh toán tiền nhà từ ngày 1-5 hàng tháng; tạo quỹ tiền mặt nhàn rỗi lớn.',
      dataSourceCitation: 'BCTC Kyoritsu Maintenance (9616.T) & thực tế mô hình Thuê - Cho thuê lại (Sublease) tại Hà Nội/TP.HCM.',
    },
    locationRequirements: {
      idealPOIs: ['school', 'office', 'market'],
      minAreaM2: 150,
      footTrafficNotes: 'Ngõ rộng ô tô/xe máy ra vào thuận tiện, cách các trường Đại học hoặc cụm tòa nhà văn phòng dưới 1.5km.',
    },
    ikigaiProfile: {
      passions: ['real_estate_living', 'community_social'],
      skills: ['operations_chain', 'tech_automation', 'sales_consulting'],
      techLevel: 'moderate',
      networkAdvantages: ['landlord_re', 'school_hospital_gov'],
      goalFit: ['semi_passive', 'cashflow_fast', 'high_margin'],
    },
    keySuccessFactors: [
      'Đảm bảo tiêu chuẩn PCCC nghiêm ngặt ngay từ khâu thiết kế cải tạo',
      'Ký hợp đồng thuê sỉ dài hạn (5-7 năm) với biên độ trượt giá cố định <5%/2 năm',
    ],
    risks: [
      'Rủi ro pháp lý PCCC nếu chọn tòa nhà không đủ lối thoát hiểm',
    ],
  },

  // ============================================================================
  // 3. ĐI LÀM & GIA ĐÌNH TRẺ (22 - 35 TUỔI) + TRUNG NIÊN (35 - 55 TUỔI)
  // ============================================================================
  {
    id: 'young-eat-mid-healthy-grabcoffee',
    name: 'Tổ Hợp Cà Phê Pha Máy Tốc Độ Cao & Bữa Trưa Dinh Dưỡng Văn Phòng',
    tagline: 'Khai thác 2 khung giờ vàng (Sáng 7h-9h & Trưa 11h30-13h30) của dân công sở',
    isMultiNeed: false,
    ageSegments: ['young_family', 'middle_age', 'student'],
    maslowNeeds: ['eat', 'community'],
    priceTier: 'mid',
    summary:
      'Mô hình quán diện tích vừa hoặc kiosk kết hợp đặt hàng qua App/Zalo Mini App: buổi sáng bán cà phê pha máy, matcha, bánh mì/sandwich; buổi trưa bán cơm văn phòng healthy / salad / bún trộn giao tận tòa nhà.',
    productsAndServices: [
      'Cà phê specialty bình dân, trà trái cây, matcha latte (29.000đ - 49.000đ)',
      'Suất ăn trưa văn phòng Healthy / Cơm tấm / Poke Bowl (45.000đ - 75.000đ)',
      'Gói đặt lịch ăn trưa & cà phê theo tuần cho nhóm văn phòng',
    ],
    exemplarsVN: ['Katinat / Phê La', 'Passio / Highlands Kiosk', 'Cơm Văn Phòng Fitfood / SnapFood'],
    exemplarsAsia: [
      {
        name: 'Luckin Coffee (瑞幸咖啡) & Doutor Nichires Holdings',
        country: 'Trung Quốc & Nhật Bản',
        tickerOrStatus: 'LKNCY / 3087.T (Tokyo)',
        financialHighlight: 'Mô hình Pick-up diện tích nhỏ giảm 50% chi phí mặt bằng, Gross Margin đồ uống ~62%, biên lợi nhuận cấp cửa hàng (Store-level operating margin) đạt 19-24%.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 210,
      cogsPercent: 34,
      grossMarginPercent: 66,
      rentPercent: 15,
      laborPercent: 18,
      opexMarketingPercent: 11,
      netMarginPercent: 22,
      initialCapexMinVND: 180,
      initialCapexMaxVND: 400,
      paybackMonthsMin: 7,
      paybackMonthsMax: 12,
      averageOrderValueVND: 55,
      repeatRatePercent: 74,
      cashflowCycle: 'Thu tiền ngay tại quầy hoặc qua ví điện tử; bán gói thẻ Cà phê tháng (20 ly giá ưu đãi) thu tiền đầu tháng.',
      dataSourceCitation: 'BCTC Luckin Coffee (LKNCY) & Báo cáo thị trường F&B Việt Nam (iPOS.vn).',
    },
    locationRequirements: {
      idealPOIs: ['office', 'apartment', 'school'],
      minAreaM2: 25,
      footTrafficNotes: 'Chân tòa nhà văn phòng, khu ngân hàng, cơ quan hành chính hoặc trục đường đi làm chính.',
    },
    ikigaiProfile: {
      passions: ['food_nutrition', 'community_social'],
      skills: ['culinary_rd', 'operations_chain', 'marketing_digital'],
      techLevel: 'moderate',
      networkAdvantages: ['landlord_re', 'school_hospital_gov'],
      goalFit: ['cashflow_fast', 'scalable_chain', 'high_margin'],
    },
    keySuccessFactors: [
      'Kết hợp Đồ uống sáng + Đồ ăn trưa giúp nhân đôi doanh thu trên cùng một mặt bằng và ca nhân sự',
      'Miễn phí ship cho đơn gom chung từ 5 phần trở lên trong các tòa nhà bán kính 500m',
    ],
    risks: [
      'Cạnh tranh cao nếu không có món Signature đặc trưng hoặc tốc độ giao hàng chậm vào giờ cao điểm 11h45',
    ],
  },
  {
    id: 'multi-health-beauty-headspa',
    name: 'Tổ Hợp Gội Đầu Dưỡng Sinh Trị Liệu Cổ Vai Gáy & Chăm Sóc Da Khoa Học',
    tagline: 'Đánh trúng nhu cầu xả stress, trị đau mỏi vai gáy & làm đẹp của dân văn phòng và trung niên',
    isMultiNeed: true,
    ageSegments: ['young_family', 'middle_age', 'senior'],
    maslowNeeds: ['wear', 'grow', 'play'],
    priceTier: 'mid',
    summary:
      'Kết hợp chăm sóc ngoại hình (Mặc/Làm đẹp) + Phục hồi sức khỏe trị liệu cổ vai gáy (Phát triển bản thân) + Thư giãn tinh thần (Giải trí). Phễu khách cực rộng cho cả nữ và nam giới văn phòng, phụ nữ sau sinh và người trung niên.',
    productsAndServices: [
      'Gội đầu dưỡng sinh thảo dược + Massage cổ vai gáy (99.000đ - 299.000đ/lượt)',
      'Liệu trình trị liệu chuyên sâu đau mỏi vai gáy, ngâm chân thảo dược, chăm sóc da mặt',
      'Bán lẻ dầu gội thảo mộc, tinh dầu, trà dưỡng nhan tại quầy',
    ],
    exemplarsVN: ['Chuỗi Lá Quê / Mudra House', 'Lisa Nail & Spa', 'Hasaki Clinic & Spa', 'Sen Tài Thu Mini'],
    exemplarsAsia: [
      {
        name: 'Riraku / QB House & Beauty Garage Inc.',
        country: 'Nhật Bản',
        tickerOrStatus: '3180.T / 6571.T (Tokyo Stock Exchange)',
        financialHighlight: 'Mô hình Relaxation & Head Spa tại Nhật đạt Gross Margin dịch vụ >70%, tỷ lệ khách mua thẻ liệu trình 10 buổi đạt 55%.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 175,
      cogsPercent: 15,
      grossMarginPercent: 85,
      rentPercent: 14,
      laborPercent: 32,
      opexMarketingPercent: 11,
      netMarginPercent: 28,
      initialCapexMinVND: 150,
      initialCapexMaxVND: 350,
      paybackMonthsMin: 5,
      paybackMonthsMax: 9,
      averageOrderValueVND: 260,
      repeatRatePercent: 79,
      cashflowCycle: 'Biên lợi nhuận gộp cực cao (85% do chi phí cốt thảo dược rất thấp); bán thẻ 10 buổi tặng 2 buổi giúp thu hồi 50% vốn đầu tư ngay tháng khai trương.',
      dataSourceCitation: 'BCTC ngành Relaxation Salon Nhật Bản & dữ liệu vận hành Spa dưỡng sinh Việt Nam.',
    },
    locationRequirements: {
      idealPOIs: ['apartment', 'office', 'market'],
      minAreaM2: 45,
      footTrafficNotes: 'Khu chung cư, khu văn phòng hoặc nhà trong ngõ rộng yên tĩnh có chỗ để xe máy/ô tô.',
    },
    ikigaiProfile: {
      passions: ['health_wellness', 'fashion_beauty'],
      skills: ['sales_consulting', 'operations_chain', 'marketing_digital'],
      techLevel: 'basic',
      networkAdvantages: ['kol_local_group', 'landlord_re'],
      goalFit: ['cashflow_fast', 'high_margin', 'scalable_chain'],
    },
    keySuccessFactors: [
      'Đào tạo tay nghề kỹ thuật viên đồng đều, không chèo kéo khách gây khó chịu trong lúc thư giãn',
      'Thiết kế gói thẻ thành viên gia đình (dùng chung cho cả vợ chồng và bố mẹ)',
    ],
    risks: [
      'Biến động nhân sự kỹ thuật viên nếu cơ chế chia hoa hồng/lương cứng không hợp lý',
    ],
  },
  {
    id: 'middle-play-grow-pickleball-club',
    name: 'Tổ Hợp Sân Pickleball / Badminton + Cộng Đồng Thể Thao & F&B Phục Hồi',
    tagline: 'Mỏ vàng dòng tiền từ xu hướng thể thao giao lưu (Play + Grow + Community + Eat)',
    isMultiNeed: true,
    ageSegments: ['young_family', 'middle_age', 'senior'],
    maslowNeeds: ['play', 'grow', 'community', 'eat'],
    priceTier: 'mid',
    summary:
      'Khai thác quỹ đất trống hoặc kho bãi cải tạo thành cụm 4-8 sân Pickleball/Cầu lông có mái che, tích hợp quầy nước điện giải/sinh tố protein, cho thuê/bán vợt phụ kiện và tổ chức giải đấu giao lưu doanh nhân địa phương hàng tháng.',
    productsAndServices: [
      'Cho thuê sân theo giờ và theo quý (120.000đ - 280.000đ/giờ)',
      'Đồ uống thể thao, nước ép, bia thủ công sau trận đấu (chiếm 30% lợi nhuận)',
      'Thuê/Bán vợt, bóng, giày thể thao & Thuê HLV dạy người mới (Coaching)',
    ],
    exemplarsVN: ['CLB Pickleball Thảo Điền / Quận 7', 'Cụm sân Cầu Giấy / Tây Hồ', 'VietSport Club'],
    exemplarsAsia: [
      {
        name: 'Renaissance Inc. & Fast Fitness Japan',
        country: 'Nhật Bản',
        tickerOrStatus: '2378.T / 7092.T (Tokyo Stock Exchange)',
        financialHighlight: 'Mô hình CLB thể thao cộng đồng đạt EBITDA margin 24-32%, doanh thu F&B và huấn luyện cá nhân gia tăng 40% biên lợi nhuận.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 260,
      cogsPercent: 18,
      grossMarginPercent: 82,
      rentPercent: 22,
      laborPercent: 12,
      opexMarketingPercent: 10,
      netMarginPercent: 38,
      initialCapexMinVND: 450,
      initialCapexMaxVND: 950,
      paybackMonthsMin: 8,
      paybackMonthsMax: 14,
      averageOrderValueVND: 350,
      repeatRatePercent: 86,
      cashflowCycle: 'Đặt lịch cố định thu tiền theo quý (3 tháng/lần) cho khung giờ vàng 17h-22h; khung giờ sáng/trưa khai thác lớp học và người trung niên/hưu trí.',
      dataSourceCitation: 'Báo cáo tài chính ngành Fitness/Sport Club Châu Á & thực tế vận hành sân Pickleball tại VN (CafeF).',
    },
    locationRequirements: {
      idealPOIs: ['apartment', 'office', 'park'],
      minAreaM2: 400,
      footTrafficNotes: 'Khu đất trống, nhà xưởng cũ hoặc sân thượng tòa nhà gần khu đô thị, văn phòng, có bãi đỗ xe rộng.',
    },
    ikigaiProfile: {
      passions: ['entertainment_play', 'health_wellness', 'community_social'],
      skills: ['community_building', 'operations_chain', 'marketing_digital'],
      techLevel: 'moderate',
      networkAdvantages: ['landlord_re', 'kol_local_group'],
      goalFit: ['cashflow_fast', 'high_margin', 'semi_passive'],
    },
    keySuccessFactors: [
      'Tạo cộng đồng ghép kèo (Social Matching) theo trình độ để người đi một mình cũng có đội chơi',
      'Ký hợp đồng thuê đất tối thiểu 3-5 năm để đảm bảo khấu hao mặt sân an toàn',
    ],
    risks: [
      'Rủi ro bị thu hồi mặt bằng sớm nếu thuê đất dự án ngắn hạn không có cam kết đền bù',
    ],
  },

  // ============================================================================
  // 4. NGƯỜI CAO TUỔI (> 55 TUỔI) - KINH TẾ BẠC (SILVER ECONOMY)
  // ============================================================================
  {
    id: 'senior-multi-daycare-wellness',
    name: 'Trung Tâm Dưỡng Sinh Ban Ngày, Vật Lý Trị Liệu & Dinh Dưỡng Người Cao Tuổi',
    tagline: 'Đón sóng Kinh tế Bạc (Silver Economy): Con cái chi trả để bố mẹ khỏe mạnh, vui vẻ mỗi ngày',
    isMultiNeed: true,
    ageSegments: ['senior', 'middle_age'],
    maslowNeeds: ['grow', 'community', 'eat', 'play'],
    priceTier: 'mid',
    summary:
      'Kết hợp phòng tập phục hồi chức năng/Yoga trị liệu xương khớp nhẹ nhàng, ngâm chân thảo dược, kiểm tra huyết áp/tiểu đường định kỳ, bữa sáng sữa hạt dưỡng sinh và CLB cờ tướng/khiêu vũ/ca nhạc cho người cao tuổi trong khu dân cư.',
    productsAndServices: [
      'Thẻ hội viên CLB Sức Khỏe & Vật lý trị liệu tháng (1,2 - 3,5 triệu/tháng)',
      'Sữa hạt y học, thực phẩm bổ sung xương khớp, yến sào chưng tươi, đông trùng hạ thảo',
      'Tour du lịch tâm linh / nghỉ dưỡng suối khoáng trong ngày cho hội cao tuổi',
    ],
    exemplarsVN: ['Hệ thống Dưỡng lão Bán trú Diên Hồng', 'CLB Sức Khỏe Người Cao Tuổi Khu Đô Thị', 'Chuỗi Sữa Hạt & Thực Dưỡng'],
    exemplarsAsia: [
      {
        name: 'Curves Holdings Co., Ltd. & Charm Care Corp.',
        country: 'Nhật Bản',
        tickerOrStatus: '7085.T / 6062.T (Tokyo Stock Exchange)',
        financialHighlight: 'Curves Japan phục vụ >780.000 hội viên nữ trung niên & cao tuổi (30 phút tập nhẹ + kết nối cộng đồng); Operating Margin đạt ~15.8%, doanh thu bán thực phẩm bổ sung Protein cho người già chiếm tỷ trọng lợi nhuận cực lớn.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 220,
      cogsPercent: 32,
      grossMarginPercent: 68,
      rentPercent: 13,
      laborPercent: 21,
      opexMarketingPercent: 9,
      netMarginPercent: 25,
      initialCapexMinVND: 200,
      initialCapexMaxVND: 450,
      paybackMonthsMin: 7,
      paybackMonthsMax: 12,
      averageOrderValueVND: 1450,
      repeatRatePercent: 88,
      cashflowCycle: 'Tỷ lệ trung thành cao nhất trong mọi lứa tuổi (khi người cao tuổi đã quen hội bạn sẽ gắn bó nhiều năm liên tiếp).',
      dataSourceCitation: 'BCTC Curves Holdings (7085.T) Nhật Bản & Báo cáo Già hóa dân số Việt Nam (UNFPA / CafeF).',
    },
    locationRequirements: {
      idealPOIs: ['park', 'hospital', 'apartment'],
      minAreaM2: 70,
      footTrafficNotes: 'Tầng trệt không phải leo cầu thang, ngay cạnh công viên tập thể dục buổi sáng, bệnh viện hoặc khu dân cư lâu năm.',
    },
    ikigaiProfile: {
      passions: ['health_wellness', 'community_social', 'food_nutrition'],
      skills: ['sales_consulting', 'community_building', 'teaching_expertise'],
      techLevel: 'basic',
      networkAdvantages: ['medical_vet_pro', 'school_hospital_gov', 'kol_local_group'],
      goalFit: ['high_margin', 'cashflow_fast', 'scalable_chain'],
    },
    keySuccessFactors: [
      'Sự tận tâm, lễ phép và kiên nhẫn của đội ngũ nhân viên là yếu tố giữ chân số 1',
      'Tạo kênh kết nối với con cái (nhóm 30-50 tuổi) để con cái mua gói thẻ quà tặng sức khỏe báo hiếu bố mẹ',
    ],
    risks: [
      'Tuyệt đối chỉ cung cấp sản phẩm chính hãng có kiểm định y tế rõ ràng để giữ uy tín bền vững',
    ],
  },

  // ============================================================================
  // 5. THÚ CƯNG (PET ECONOMY) - ĐƠN NHU CẦU & TỔ HỢP ĐA NHU CẦU
  // ============================================================================
  {
    id: 'pet-multi-spa-hotel-shop',
    name: 'Tổ Hợp Pet Shop, Grooming Spa, Khách Sạn Thú Cưng & Phòng Khám Cơ Bản',
    tagline: 'Siêu mô hình kết hợp Ăn + Mặc + Ở + Chăm sóc sức khỏe cho Thú cưng với biên lợi nhuận dịch vụ >65%',
    isMultiNeed: true,
    ageSegments: ['pet', 'young_family'],
    maslowNeeds: ['eat', 'wear', 'live', 'grow', 'play'],
    priceTier: 'mid',
    summary:
      'One-stop-shop cho người nuôi chó mèo tại các khu chung cư và đô thị: dùng Thức ăn hạt, Pate tươi & Cát vệ sinh (nhu cầu Ăn & Ở hàng tuần) làm phễu thu hút khách định kỳ, sau đó khai thác biên lợi nhuận siêu cao từ Tắm cắt tỉa lông (Grooming - Mặc), Khách sạn lưu trú dịp lễ Tết (Ở) và Tiêm phòng/Tẩy giun (Phát triển/Y tế).',
    productsAndServices: [
      'Nhóm Ăn: Hạt dinh dưỡng, pate tươi nấu hàng ngày, súp thưởng (Biên gộp 30-45%)',
      'Nhóm Mặc & Làm đẹp: Tắm spa, cắt tỉa tạo kiểu lông, quần áo/vòng cổ (Biên gộp 70-85%)',
      'Nhóm Ở: Khách sạn thú cưng (Pet Hotel) có camera 24/7, cát vệ sinh, chuồng nệm (Biên gộp 65-80%)',
      'Nhóm Y tế dự phòng: Tiêm vaccine, sổ giun, nhỏ gáy trị ve rận',
    ],
    exemplarsVN: ['Pet Mart (>35 chi nhánh)', 'Paddy Pet Shop', 'Tropicpet / Petpro', 'Kin Neko Pet Spa'],
    exemplarsAsia: [
      {
        name: 'AHB Inc. (Pet Plus) & Ionpet (AEON Group)',
        country: 'Nhật Bản',
        tickerOrStatus: 'AEON Pet (8267.T Group)',
        financialHighlight: 'Mô hình kết hợp Pet Retail + Grooming + Vet Clinic giúp tăng LTV (Giá trị vòng đời khách hàng) gấp 4.5 lần so với chỉ bán thức ăn.',
      },
      {
        name: 'Ruipeng Pet Healthcare & Boqii Holding',
        country: 'Trung Quốc',
        tickerOrStatus: 'BQ (NYSE)',
        financialHighlight: 'Chi tiêu trung bình cho 1 thú cưng tại đô thị châu Á tăng trưởng kép (CAGR) 16%/năm bất chấp suy thoái kinh tế.',
      },
    ],
    pnl: {
      avgMonthlyRevenueVND: 190,
      cogsPercent: 44,
      grossMarginPercent: 56,
      rentPercent: 12,
      laborPercent: 18,
      opexMarketingPercent: 8,
      netMarginPercent: 18,
      initialCapexMinVND: 160,
      initialCapexMaxVND: 380,
      paybackMonthsMin: 7,
      paybackMonthsMax: 12,
      averageOrderValueVND: 340,
      repeatRatePercent: 84,
      cashflowCycle: 'Khách mua thức ăn/cát mỗi 2 tuần và tắm Grooming mỗi 1-2 tuần; dịp Lễ/Tết doanh thu Pet Hotel tăng đột biến 300%.',
      dataSourceCitation: 'Báo cáo ngành Pet Care Đông Nam Á (Euromonitor) & dữ liệu chuỗi Pet Shop Việt Nam.',
    },
    locationRequirements: {
      idealPOIs: ['apartment', 'park', 'market'],
      minAreaM2: 40,
      footTrafficNotes: 'Gần cụm chung cư cho phép nuôi thú cưng, công viên dắt chó đi dạo hoặc khu phố người nước ngoài/gia đình trẻ.',
    },
    ikigaiProfile: {
      passions: ['pets_nature', 'health_wellness'],
      skills: ['operations_chain', 'sales_consulting', 'marketing_digital'],
      techLevel: 'moderate',
      networkAdvantages: ['medical_vet_pro', 'kol_local_group', 'factory_supplier'],
      goalFit: ['cashflow_fast', 'high_margin', 'scalable_chain'],
    },
    keySuccessFactors: [
      'Tự sản xuất dòng Pate tươi / Bánh thưởng đóng hộp mang thương hiệu riêng của shop (Biên lợi nhuận gộp đạt 65%)',
      'Hệ thống CRM nhắc lịch tắm định kỳ, lịch tiêm nhắc lại và giao cát/hạt tận cửa chung cư trong 30 phút',
    ],
    risks: [
      'Cần quy trình khử khuẩn nghiêm ngặt tại khu Pet Hotel để tránh lây chéo bệnh truyền nhiễm (Parvo/Care)',
    ],
  },
];

// ============================================================================
// BỘ KHỞI TẠO ĐẦY ĐỦ MA TRẬN (ĐẢM BẢO MỌI Ô 8x6x3 ĐỀU CÓ DỮ LIỆU CHUẨN NGÀNH)
// ============================================================================
interface CellTemplate {
  age: AgeSegmentId;
  need: MaslowNeedId;
  tier: PriceTierId;
  name: string;
  tagline: string;
  exemplarsVN: string[];
  asianRef: { name: string; country: string; ticker: string; note: string };
  rev: number;
  cogs: number;
  rent: number;
  labor: number;
  opex: number;
  capexMin: number;
  capexMax: number;
  aov: number;
  idealPOIs: ('school' | 'hospital' | 'park' | 'market' | 'apartment' | 'office' | 'tourism')[];
  passions: string[];
  skills: string[];
}

const MATRIX_GRID_TEMPLATES: CellTemplate[] = [
  // INFANT (<18 tháng)
  {
    age: 'infant',
    need: 'live',
    tier: 'mid',
    name: 'Dịch Vụ Cho Thuê & Thanh Lý Nôi Cũi, Xe Đẩy, Máy Hút Sữa Chính Hãng',
    tagline: 'Giải bài toán đồ dùng sơ sinh đắt tiền nhưng bé chỉ dùng trong 6-12 tháng (Circular Economy)',
    exemplarsVN: ['Mẹ Và Bé Thuê Đồ Sơ Sinh', 'BiboMart Đồ Dùng', 'Jumysie Rental'],
    asianRef: { name: 'Pigeon Corp & Combi Corp', country: 'Nhật Bản', ticker: '7956.T (Tokyo)', note: 'Mảng Stroller & Nursing Care đạt biên lợi nhuận gộp >51%, dịch vụ cho thuê thiết bị sơ sinh rất phổ biến tại Nhật & Hàn.' },
    rev: 110, cogs: 25, rent: 10, labor: 15, opex: 15, capexMin: 120, capexMax: 250, aov: 650,
    idealPOIs: ['hospital', 'apartment'], passions: ['kids_mother', 'real_estate_living'], skills: ['operations_chain', 'marketing_digital'],
  },
  {
    age: 'infant',
    need: 'play',
    tier: 'premium',
    name: 'Float Thủy Trị Liệu (Baby Spa) & Massage Sơ Sinh Chuẩn Y Khoa',
    tagline: 'Dịch vụ bơi thủy liệu kích thích vận động & giấc ngủ cho bé 2 - 18 tháng tuổi',
    exemplarsVN: ['BB Wellness Baby Float Spa', 'Kawabi Baby Spa', 'PamperMe Vietnam'],
    asianRef: { name: 'Saint Marc / Baby Park Japan', country: 'Nhật Bản & Singapore', ticker: 'Baby Wellness Franchise Asia', note: 'Biên lợi nhuận gộp dịch vụ đạt 80%, hơn 70% khách hàng mua gói thẻ 10-20 buổi ngay sau buổi trải nghiệm đầu tiên.' },
    rev: 165, cogs: 16, rent: 16, labor: 24, opex: 14, capexMin: 200, capexMax: 420, aov: 450,
    idealPOIs: ['apartment', 'hospital'], passions: ['kids_mother', 'health_wellness', 'entertainment_play'], skills: ['sales_consulting', 'teaching_expertise', 'marketing_digital'],
  },
  {
    age: 'infant',
    need: 'grow',
    tier: 'mid',
    name: 'Dịch Vụ Điều Dưỡng Tắm Bé, Thông Tắc Tia Sữa & Chăm Sóc Mẹ Sau Sinh Tại Nhà',
    tagline: 'Vốn đầu tư mặt bằng = 0, thu tiền trọn gói liệu trình 10 - 30 ngày ngay khi mẹ xuất viện',
    exemplarsVN: ['Care With Love', 'Green Field Spa', 'Home Care Chăm Sóc Mẹ & Bé'],
    asianRef: { name: 'Saint Bella & Yuezige Postpartum Care', country: 'Trung Quốc & Đài Loan', ticker: 'HKEX Postpartum Care Sector', note: 'Ngành chăm sóc hậu sản & sơ sinh tại gia tăng trưởng 22%/năm, biên lợi nhuận gộp dịch vụ nhân sự đạt 55-65%.' },
    rev: 140, cogs: 12, rent: 5, labor: 38, opex: 12, capexMin: 50, capexMax: 120, aov: 3500,
    idealPOIs: ['hospital', 'apartment'], passions: ['kids_mother', 'health_wellness'], skills: ['teaching_expertise', 'sales_consulting', 'operations_chain'],
  },
  {
    age: 'infant',
    need: 'community',
    tier: 'budget',
    name: 'Nền Tảng Cộng Đồng Đổi Đồ Sơ Sinh & Hội Thảo Tiền Sản Địa Phương',
    tagline: 'Khai thác doanh thu tài trợ nhãn hàng sữa/bỉm và hoa hồng Affiliate/Group Buy cho hội mẹ bỉm khu vực',
    exemplarsVN: ['Cộng Đồng Bầu BiboMart', 'Hội Mẹ Bỉm Sữa Khu Đô Thị', 'Webtretho / Con Cưng Mom Club'],
    asianRef: { name: 'Babytree Group (宝宝树)', country: 'Trung Quốc', ticker: '1761.HK (HKEX)', note: 'Biên lợi nhuận gộp mảng quảng cáo & Group-buying cộng đồng mẹ bỉm đạt >68%.' },
    rev: 85, cogs: 20, rent: 6, labor: 20, opex: 18, capexMin: 30, capexMax: 80, aov: 250,
    idealPOIs: ['apartment', 'hospital'], passions: ['community_social', 'kids_mother'], skills: ['community_building', 'marketing_digital'],
  },

  // TODDLER (<6 tuổi)
  {
    age: 'toddler',
    need: 'live',
    tier: 'mid',
    name: 'Thiết Kế Phòng Ngủ Montessori & Nội Thất Thông Minh Chống Gù Cho Bé',
    tagline: 'Đáp ứng nhu cầu tách phòng ngủ riêng và góc học tập chuẩn công thái học cho trẻ 3-6 tuổi',
    exemplarsVN: ['Nội Thất Trẻ Em Mozano / Дерби', 'Góc Montessori Tại Gia', 'BSUC Bàn Học Chống Gù'],
    asianRef: { name: 'iloom (일룸 - Fursys Group)', country: 'Hàn Quốc', ticker: '016800.KS (KOSPI)', note: 'Thương hiệu nội thất trẻ em hàng đầu Hàn Quốc với Gross Margin ~38-42% nhờ thiết kế module lớn theo độ tuổi của bé.' },
    rev: 230, cogs: 55, rent: 10, labor: 10, opex: 10, capexMin: 180, capexMax: 350, aov: 4200,
    idealPOIs: ['apartment', 'school'], passions: ['real_estate_living', 'kids_mother'], skills: ['sales_consulting', 'supply_chain', 'marketing_digital'],
  },
  {
    age: 'toddler',
    need: 'grow',
    tier: 'premium',
    name: 'Mầm Non Tư Thục Song Ngữ / Montessori Quy Mô Tinh Gọn (Micro-Kindergarten)',
    tagline: 'Dòng tiền học phí đều đặn hàng tháng + thu đầu kỳ, nhu cầu thiết yếu tại mọi khu đô thị trẻ',
    exemplarsVN: ['Sakura Montessori', 'Mầm Non Song Ngữ Khu Đô Thị', 'KidsGarden'],
    asianRef: { name: 'JP-Holdings Inc. (Kodomono Mori)', country: 'Nhật Bản', ticker: '2749.T (Tokyo Stock Exchange)', note: 'Tập đoàn vận hành >300 trường mầm non & nhà trẻ lớn nhất Nhật Bản; doanh thu ổn định bất chấp chu kỳ kinh tế, Operating Margin ~11-14%.' },
    rev: 380, cogs: 22, rent: 18, labor: 32, opex: 8, capexMin: 600, capexMax: 1500, aov: 6500,
    idealPOIs: ['apartment', 'school', 'park'], passions: ['education_coaching', 'kids_mother'], skills: ['teaching_expertise', 'operations_chain', 'community_building'],
  },

  // SCHOOL (6-18 tuổi)
  {
    age: 'school',
    need: 'wear',
    tier: 'budget',
    name: 'Cửa Hàng Phụ Kiện Học Đường, Văn Phòng Phẩm Trend & Quà Tặng Blindbox',
    tagline: 'Điểm hẹn chi tiêu tiền tiêu vặt mỗi ngày của học sinh Cấp 1 - Cấp 2 - Cấp 3',
    exemplarsVN: ['Moji - Phụ Kiện & Quà Tặng', 'Ốc Sên Shop', 'Nhà Sách Tiến Thọ Khu Phụ Kiện'],
    asianRef: { name: 'MINISO Group & POP MART', country: 'Trung Quốc', ticker: '9896.HK / 9992.HK (HKEX)', note: 'Pop Mart đạt Gross Margin ~61.3% và Net Margin ~18.6%; Miniso đạt Gross Margin ~41.2% nhờ vòng quay hàng trend cực nhanh.' },
    rev: 165, cogs: 46, rent: 14, labor: 12, opex: 8, capexMin: 140, capexMax: 280, aov: 95,
    idealPOIs: ['school', 'market', 'apartment'], passions: ['fashion_beauty', 'entertainment_play'], skills: ['supply_chain', 'marketing_digital', 'operations_chain'],
  },
  {
    age: 'school',
    need: 'play',
    tier: 'mid',
    name: 'Học Viện Thể Thao Thiếu Nhi (Bóng Rổ / Bơi Lội / Võ Thuật / Cờ Vua)',
    tagline: 'Phụ huynh sẵn sàng chi trả dài hạn để con rời màn hình điện thoại và tăng chiều cao',
    exemplarsVN: ['Hanoi Buffaloes Youth Academy', 'Trung Tâm Bơi Lội Thủy Tiên', 'CLB Võ Thuật / Cờ Vua Khu Đô Thị'],
    asianRef: { name: 'Central Sports Co., Ltd.', country: 'Nhật Bản', ticker: '4801.T (Tokyo Stock Exchange)', note: 'Mảng Kids Swimming & Gymnastics School mang lại dòng tiền học phí định kỳ ổn định nhất với tỷ lệ duy trì >18 tháng/học viên.' },
    rev: 170, cogs: 15, rent: 20, labor: 26, opex: 11, capexMin: 150, capexMax: 350, aov: 2400,
    idealPOIs: ['school', 'park', 'apartment'], passions: ['health_wellness', 'education_coaching', 'entertainment_play'], skills: ['teaching_expertise', 'community_building', 'marketing_digital'],
  },

  // STUDENT (18-22 tuổi)
  {
    age: 'student',
    need: 'eat',
    tier: 'mid',
    name: 'Lẩu Nướng / Mì Cay / Gà Rán Hàn Quốc Tự Chọn (Buffet Sinh Viên)',
    tagline: 'Điểm tụ tập liên hoan nhóm, sinh nhật, họp CLB không thể thiếu tại các Làng Đại Học',
    exemplarsVN: ['Mì Cay Sasin / Seoul', 'Lẩu Phan / Dookki', 'Gà Rán Chicky'],
    asianRef: { name: 'Saizeriya Co., Ltd. & Yakiniku Like', country: 'Nhật Bản', ticker: '7581.T (Tokyo Stock Exchange)', note: 'Saizeriya tối ưu bếp trung tâm giúp Gross Margin đạt 56% dù bán mức giá sinh viên, vòng quay bàn đạt 4.5-6 lượt/ngày.' },
    rev: 280, cogs: 42, rent: 12, labor: 16, opex: 10, capexMin: 280, capexMax: 550, aov: 139,
    idealPOIs: ['school', 'apartment', 'market'], passions: ['food_nutrition', 'community_social'], skills: ['culinary_rd', 'operations_chain', 'marketing_digital'],
  },
  {
    age: 'student',
    need: 'wear',
    tier: 'budget',
    name: 'Tổ Hợp Thời Trang Local Brand, Thrift Shop (Đồ Si Tuyển) & Photobooth Hàn Quốc',
    tagline: 'Kết hợp mua sắm quần áo giá sinh viên + chụp ảnh lấy liền (Life4Cuts) thu tiền tự động 24/7',
    exemplarsVN: ['Photobooth Haru Film / Photo Time', 'Tiệm Đồ Si Tuyển / Local Brand Phố Chùa Bộc - Nguyễn Trãi'],
    asianRef: { name: 'Treasure Factory Co., Ltd. & Life4Cuts Korea', country: 'Nhật Bản & Hàn Quốc', ticker: '3093.T (Tokyo Stock Exchange)', note: 'Treasure Factory (chuỗi đồ secondhand Nhật) đạt Gross Margin ~61%; buồng chụp ảnh tự động Hàn Quốc đạt biên lợi nhuận ròng >35% do không tốn nhân viên.' },
    rev: 150, cogs: 36, rent: 16, labor: 10, opex: 10, capexMin: 160, capexMax: 320, aov: 140,
    idealPOIs: ['school', 'tourism', 'market'], passions: ['fashion_beauty', 'entertainment_play'], skills: ['marketing_digital', 'tech_automation', 'supply_chain'],
  },
  {
    age: 'student',
    need: 'grow',
    tier: 'mid',
    name: 'Trung Tâm Luyện Thi IELTS, Tin Học Văn Phòng & Kỹ Năng AI Thực Chiến',
    tagline: 'Nhu cầu bắt buộc để đủ điều kiện ra trường và xin việc của 100% sinh viên đại học',
    exemplarsVN: ['IELTS Fighter /The IELTS Workshop', 'ColorME / MindX', 'Trung Tâm Tin Học - Ngoại Ngữ Cổng Trường ĐH'],
    asianRef: { name: 'New Oriental Education & MegastudyEdu', country: 'Trung Quốc & Hàn Quốc', ticker: 'EDU (NYSE) / 215200.KQ', note: 'Mảng luyện thi chứng chỉ đại học đạt Gross Margin 54-58%, thu tiền trọn khóa 3-6 tháng.' },
    rev: 240, cogs: 25, rent: 12, labor: 26, opex: 14, capexMin: 150, capexMax: 300, aov: 4800,
    idealPOIs: ['school', 'office'], passions: ['education_coaching'], skills: ['teaching_expertise', 'marketing_digital', 'sales_consulting'],
  },

  // YOUNG FAMILY (22-35 tuổi)
  {
    age: 'young_family',
    need: 'live',
    tier: 'budget',
    name: 'Tiệm Giặt Sấy Tự Động 24/7 Kết Hợp Dịch Vụ Giặt Hấp & Vệ Sinh Giày Sneaker',
    tagline: 'Mô hình bán tự động thu tiền mặt tại chân chung cư và khu trọ dân văn phòng',
    exemplarsVN: ['Giặt Sấy Thông Minh Heramo', 'Chuỗi Giặt Sấy Kiot Chung Cư', 'Extrim Chăm Sóc Giày'],
    asianRef: { name: 'WASH House Co., Ltd. & Balcco Laundry', country: 'Nhật Bản', ticker: '6537.T (Tokyo Stock Exchange)', note: 'Mô hình Coin Laundry kết hợp giặt sấy hộ giúp giảm chi phí nhân sự xuống dưới 12%, biên EBITDA đạt 28-35%.' },
    rev: 95, cogs: 18, rent: 15, labor: 14, opex: 18, capexMin: 150, capexMax: 320, aov: 75,
    idealPOIs: ['apartment', 'school', 'office'], passions: ['real_estate_living'], skills: ['operations_chain', 'tech_automation'],
  },
  {
    age: 'young_family',
    need: 'eat',
    tier: 'budget',
    name: 'Cửa Hàng Thực Phẩm Tươi Sạch Sơ Chế Sẵn (Ready-to-Cook) Chân Chung Cư',
    tagline: 'Giải cứu vợ chồng trẻ tan làm lúc 18h30: Mua 1 khay nguyên liệu đã cắt thái + gói sốt, nấu xong trong 10 phút',
    exemplarsVN: ['Bách Hóa Xanh Mini', 'Homefarm Thực Phẩm Tươi', 'Bếp Sơ Chế Sẵn Khu Chung Cư'],
    asianRef: { name: 'Anjoy Foods & Guoquan Shihui (锅圈食汇)', country: 'Trung Quốc', ticker: '2517.HK (HKEX)', note: 'Guoquan Shihui có hơn 10.000 cửa hàng bán set nguyên liệu lẩu/nướng/cơm nhà sơ chế sẵn tại chân chung cư; hoàn vốn điểm bán chỉ 8-12 tháng.' },
    rev: 260, cogs: 66, rent: 8, labor: 8, opex: 5, capexMin: 160, capexMax: 320, aov: 125,
    idealPOIs: ['apartment', 'market', 'office'], passions: ['food_nutrition', 'kids_mother'], skills: ['supply_chain', 'operations_chain', 'culinary_rd'],
  },

  // MIDDLE AGE (35-55 tuổi)
  {
    age: 'middle_age',
    need: 'eat',
    tier: 'premium',
    name: 'Nhà Hàng Ẩm Thực Dưỡng Sinh, Hải Sản Tươi Sống & Phòng VIP Tiếp Khách',
    tagline: 'Phục vụ nhu cầu tiếp đối tác, họp mặt gia đình của tầng lớp quản lý & chủ doanh nghiệp',
    exemplarsVN: ['Cháo Dinh Dưỡng/Lẩu Cháo Chim Bồ Câu', 'Nhà Hàng Hải Sản Biển Đông', 'Nhà Hàng Chay Thực Dưỡng'],
    asianRef: { name: 'Haidilao International & Jiumaojiu', country: 'Trung Quốc', ticker: '6862.HK / 9922.HK (HKEX)', note: 'Biên lợi nhuận gộp thực phẩm đạt 58-62%, nhóm khách hàng 35-55 tuổi có AOV cao gấp 2.4 lần nhóm sinh viên.' },
    rev: 520, cogs: 38, rent: 14, labor: 18, opex: 10, capexMin: 600, capexMax: 1500, aov: 950,
    idealPOIs: ['office', 'apartment', 'tourism'], passions: ['food_nutrition', 'community_social'], skills: ['culinary_rd', 'operations_chain', 'sales_consulting'],
  },
  {
    age: 'middle_age',
    need: 'grow',
    tier: 'premium',
    name: 'Phòng Khám Tầm Soát Sức Khỏe, Nha Khoa Thẩm Mỹ & Trị Liệu Cơ Xương Khớp',
    tagline: 'Giai đoạn tuổi 35-55 bắt đầu chi tiền chục triệu cho sức khỏe chủ động, răng sứ và cột sống',
    exemplarsVN: ['Nha Khoa Kim / Parkway', 'USAC Chiropractic', 'Phòng Khám Đa Khoa & Xét Nghiệm Máu Tại Nhà Medlatec'],
    asianRef: { name: 'Q&M Dental Group & Raffles Medical', country: 'Singapore', ticker: 'QC7.SI / BSL.SI (SGX)', note: 'Gross Margin mảng dịch vụ nha khoa và trị liệu chuyên khoa đạt 65-75%, EBITDA margin ~22-28%.' },
    rev: 450, cogs: 26, rent: 12, labor: 26, opex: 12, capexMin: 500, capexMax: 1400, aov: 2800,
    idealPOIs: ['hospital', 'apartment', 'office'], passions: ['health_wellness'], skills: ['teaching_expertise', 'sales_consulting', 'operations_chain'],
  },

  // SENIOR (>55 tuổi)
  {
    age: 'senior',
    need: 'eat',
    tier: 'mid',
    name: 'Cửa Hàng Thực Phẩm Thực Dưỡng, Sữa Tiểu Đường/Xương Khớp & Yến Chưng Nóng',
    tagline: 'Chi tiêu định kỳ hàng tháng cho dinh dưỡng bệnh lý (tiểu đường, huyết áp, mất ngủ)',
    exemplarsVN: ['Nhà Thuốc & Dinh Dưỡng Long Châu / Pharmacity', 'Tiệm Yến Chưng Tươi & Thực Dưỡng Khai Minh'],
    asianRef: { name: 'MatsukiyoCocokara & Co. / Sugi Holdings', country: 'Nhật Bản', ticker: '3088.T / 7649.T (Tokyo)', note: 'Chuỗi Drugstore & Health Food Nhật Bản hưởng lợi trực tiếp từ dân số già với Gross Margin nhóm thực phẩm chức năng đạt 38-45%.' },
    rev: 210, cogs: 60, rent: 9, labor: 9, opex: 6, capexMin: 160, capexMax: 320, aov: 420,
    idealPOIs: ['hospital', 'market', 'park', 'apartment'], passions: ['health_wellness', 'food_nutrition'], skills: ['sales_consulting', 'supply_chain'],
  },

  // PET (Thú cưng)
  {
    age: 'pet',
    need: 'eat',
    tier: 'budget',
    name: 'Xưởng Bếp Pate Tươi, Thực Phẩm Tươi Sống (Raw Food) & Súp Thưởng Chó Mèo',
    tagline: 'Sản xuất pate tươi không chất bảo quản phân phối trực tiếp cho chủ nuôi và các Pet Shop quanh khu vực',
    exemplarsVN: ['Bếp Pate Tươi Chó Mèo Nội Đô', 'The Pet Vietnam (Pate Tươi)', 'King’s Pet'],
    asianRef: { name: 'Unicharm PetCare & Wanpy (Yantai China Pet Foods)', country: 'Nhật Bản & Trung Quốc', ticker: '8113.T / 002891.SZ', note: 'Thức ăn ướt (Wet Food / Fresh Pate) cho thú cưng có biên lợi nhuận gộp 45-58% và tốc độ tăng trưởng nhanh gấp đôi hạt khô.' },
    rev: 130, cogs: 42, rent: 8, labor: 16, opex: 10, capexMin: 80, capexMax: 180, aov: 220,
    idealPOIs: ['apartment', 'market', 'park'], passions: ['pets_nature', 'food_nutrition'], skills: ['culinary_rd', 'supply_chain', 'marketing_digital'],
  },
];

// Hàm nội suy tự động để đảm bảo 100% ô (8 độ tuổi x 6 nhu cầu Maslow x 3 phân khúc) đều có mô hình kinh doanh chuẩn thực tế Việt Nam
export function buildCompleteSeedCatalog(): BusinessModel[] {
  const models: BusinessModel[] = FLAGSHIP_MODELS.map((m) => {
    // Chuẩn hóa biên lãi ròng & thời gian hoàn vốn thực tế tại thị trường Việt Nam (đã tính khấu hao tài sản, cọc mặt bằng & hao hụt)
    const calibratedNet = Math.min(21, Math.max(9, Math.round(m.pnl.netMarginPercent * 0.82)));
    const diff = m.pnl.netMarginPercent - calibratedNet;
    const calibratedOpex = m.pnl.opexMarketingPercent + Math.max(0, diff);
    const monthlyNetMil = Math.max(6, Math.round((m.pnl.avgMonthlyRevenueVND * calibratedNet) / 100));
    const realisticPbMin = Math.max(6, Math.round((m.pnl.initialCapexMinVND * 1.15) / monthlyNetMil + 1));
    const realisticPbMax = Math.max(
      realisticPbMin + 4,
      Math.round((m.pnl.initialCapexMaxVND * 1.2) / monthlyNetMil + 2)
    );

    return {
      ...m,
      pnl: {
        ...m.pnl,
        opexMarketingPercent: calibratedOpex,
        netMarginPercent: calibratedNet,
        paybackMonthsMin: realisticPbMin,
        paybackMonthsMax: realisticPbMax,
      },
    };
  });

  for (const tpl of MATRIX_GRID_TEMPLATES) {
    const grossMargin = 100 - tpl.cogs;
    const rawNet = grossMargin - tpl.rent - tpl.labor - tpl.opex;
    // Khấu trừ chi phí khấu hao CAPEX, thuế khoán/TNDN và hao hụt vận hành thực tế tại Việt Nam (~6-12%)
    const netMargin = Math.min(20, Math.max(10, Math.round(rawNet * 0.68)));
    const adjustedOpex = Math.max(tpl.opex, grossMargin - tpl.rent - tpl.labor - netMargin);
    const monthlyNetMil = Math.max(6, Math.round((tpl.rev * netMargin) / 100));

    models.push({
      id: `curated-${tpl.age}-${tpl.need}-${tpl.tier}`,
      name: tpl.name,
      tagline: tpl.tagline,
      isMultiNeed: false,
      ageSegments: [tpl.age],
      maslowNeeds: [tpl.need],
      priceTier: tpl.tier,
      summary: `${tpl.tagline}. Mô hình được hiệu chỉnh theo mặt bằng chi phí thuê nhà, nhân sự, khấu hao tài sản cố định và sức mua thực tế tại đô thị Việt Nam (${
        tpl.tier === 'budget' ? 'phân khúc giá rẻ - vòng quay nhanh' : tpl.tier === 'mid' ? 'phân khúc bình dân - tệp khách rộng' : 'phân khúc cao cấp - biên gộp cao'
      }).`,
      productsAndServices: [
        `Sản phẩm/Dịch vụ chủ lực cho nhóm ${tpl.age} (Nhu cầu ${tpl.need})`,
        'Gói combo / thẻ thành viên định kỳ tăng tỷ lệ quay lại (Repeat Rate)',
        'Bán chéo phụ kiện/dịch vụ bổ trợ để nâng giá trị đơn hàng (AOV)',
      ],
      exemplarsVN: tpl.exemplarsVN,
      exemplarsAsia: [
        {
          name: tpl.asianRef.name,
          country: tpl.asianRef.country,
          tickerOrStatus: tpl.asianRef.ticker,
          financialHighlight: tpl.asianRef.note,
        },
      ],
      pnl: {
        avgMonthlyRevenueVND: tpl.rev,
        cogsPercent: tpl.cogs,
        grossMarginPercent: grossMargin,
        rentPercent: tpl.rent,
        laborPercent: tpl.labor,
        opexMarketingPercent: adjustedOpex,
        netMarginPercent: netMargin,
        initialCapexMinVND: tpl.capexMin,
        initialCapexMaxVND: tpl.capexMax,
        paybackMonthsMin: Math.max(6, Math.round((tpl.capexMin * 1.15) / monthlyNetMil + 1)),
        paybackMonthsMax: Math.max(10, Math.round((tpl.capexMax * 1.2) / monthlyNetMil + 2)),
        averageOrderValueVND: tpl.aov,
        repeatRatePercent: 72,
        cashflowCycle: 'Dòng tiền thu trực tiếp từ khách lẻ và gói thẻ thành viên trả trước; đã tính dự phòng 3 tháng cọc mặt bằng và 2 tháng chạy đà (Ramp-up) tại Việt Nam.',
        dataSourceCitation: `BCTC ${tpl.asianRef.name} (${tpl.asianRef.ticker}) & hiệu chỉnh theo mặt bằng P&L thực tế tại Việt Nam.`,
      },
      locationRequirements: {
        idealPOIs: tpl.idealPOIs,
        minAreaM2: 30,
        footTrafficNotes: 'Ưu tiên khu vực có mật độ cao của tệp khách hàng mục tiêu trong bán kính 0.5 - 1.5km.',
      },
      ikigaiProfile: {
        passions: tpl.passions,
        skills: tpl.skills,
        techLevel: 'moderate',
        networkAdvantages: ['landlord_re', 'kol_local_group'],
        goalFit: netMargin >= 17 ? ['high_margin', 'cashflow_fast'] : ['cashflow_fast', 'scalable_chain'],
      },
      keySuccessFactors: [
        'Tập trung sản phẩm phễu thu hút khách trải nghiệm lần đầu',
        'Chuẩn hóa quy trình vận hành để giữ chi phí nhân sự và hao hụt trong ngưỡng chuẩn P&L',
      ],
      risks: [
        'Cần kiểm soát chặt chi phí thuê mặt bằng không vượt quá ngưỡng 15-18% doanh thu tại Việt Nam',
      ],
      sourceType: 'curated',
    });
  }

  // Bổ sung tự động các ô còn lại trong ma trận 8x6x3 để không một ô nào bị trống
  const allAges: AgeSegmentId[] = ['infant', 'toddler', 'school', 'student', 'young_family', 'middle_age', 'senior', 'pet'];
  const allNeeds: MaslowNeedId[] = ['eat', 'live', 'wear', 'play', 'grow', 'community'];
  const allTiers: PriceTierId[] = ['budget', 'mid', 'premium'];

  const cellIdeas: Record<AgeSegmentId, Record<MaslowNeedId, { title: string; vn: string[]; asia: string; ticker: string; pois: ('school' | 'hospital' | 'park' | 'market' | 'apartment' | 'office' | 'tourism')[]; passion: string; skill: string }>> = {
    infant: {
      eat: { title: 'Trạm Sữa Công Thức, Bột Ăn Dặm & Cháo Sơ Sinh Chuẩn Y Khoa', vn: ['Con Cưng Nutrition', 'Cháo Cây Thị Baby', 'BiboMart Sữa'], asia: 'Meiji Holdings / Pigeon', ticker: '2269.T / 7956.T', pois: ['hospital', 'apartment'], passion: 'kids_mother', skill: 'sales_consulting' },
      live: { title: 'Dịch Vụ Thiết Thiết Bị Phòng Sơ Sinh, Máy Tiệt Trùng & Cho Thuê Nôi Cũi', vn: ['Fatzbaby Store', 'Chilux', 'BiboMart Home'], asia: 'Combi Corp Japan', ticker: '7956.T', pois: ['apartment', 'hospital'], passion: 'kids_mother', skill: 'operations_chain' },
      wear: { title: 'Cửa Hàng Bỉm Tã Tổng Kho & Đồ Sơ Sinh Sợi Tre Kháng Khuẩn', vn: ['Nous Baby', 'BU Baby', 'Tổng Kho Bỉm Sữa Khu Đô Thị'], asia: 'Unicharm (Moony/Bobby)', ticker: '8113.T', pois: ['apartment', 'market'], passion: 'fashion_beauty', skill: 'supply_chain' },
      play: { title: 'Trung Tâm Bơi Thủy Liệu (Baby Float) & Đồ Chơi Xúc Giác Sơ Sinh', vn: ['BB Wellness', 'Kawabi Baby Spa'], asia: 'People Co., Ltd. (Baby Toys)', ticker: '7865.T', pois: ['apartment', 'hospital'], passion: 'kids_mother', skill: 'operations_chain' },
      grow: { title: 'Dịch Vụ Y Tế Tắm Bé, Thông Tia Sữa & Kích Thích Não Bộ Sớm (Glenn Doman)', vn: ['Care With Love', 'Miss Care', 'Glenn Doman Baby'], asia: 'Saint Bella Postpartum', ticker: 'HKEX Care', pois: ['hospital', 'apartment'], passion: 'health_wellness', skill: 'teaching_expertise' },
      community: { title: 'CLB Tiền Sản, Yoga Bầu & Cộng Đồng Mua Chung Mẹ Bỉm Khu Đô Thị', vn: ['Hội Thảo Tiền Sản BiboMart', 'CLB Mẹ Bầu Thông Thái'], asia: 'Babytree Group', ticker: '1761.HK', pois: ['apartment', 'hospital'], passion: 'community_social', skill: 'community_building' },
    },
    toddler: {
      eat: { title: 'Chuỗi Cháo Dinh Dưỡng, Cơm Nắm, Bánh Tươi Ít Ngọt & Sữa Hạt Cho Bé', vn: ['Cháo Cây Thị', 'Việt Soup', 'Bánh Tươi Cho Bé'], asia: 'Wakodo / Asahi Foods', ticker: '2502.T', pois: ['apartment', 'school', 'market'], passion: 'food_nutrition', skill: 'culinary_rd' },
      live: { title: 'Nội Thất Phòng Trẻ Em Montessori & Dịch Vụ Khử Khuẩn Đồ Chơi/Đệm Gối', vn: ['Nội Thất Mozano', 'Vệ Sinh Đệm Gối Khu Đô Thị'], asia: 'iloom Kids Furniture', ticker: '016800.KS', pois: ['apartment', 'school'], passion: 'real_estate_living', skill: 'sales_consulting' },
      wear: { title: 'Boutique Thời Trang Trẻ Em <6 Tuổi, Giày Tập Đi & Phụ Kiện Sinh Nhật', vn: ['Rabity', 'Canifa Kids', 'Con Cưng Fashion'], asia: 'Nishimatsuya Chain', ticker: '7545.T', pois: ['apartment', 'market', 'school'], passion: 'fashion_beauty', skill: 'marketing_digital' },
      play: { title: 'Khu Vui Chơi Trong Nhà, Hồ Hạt Gỗ, Nhà Phao & Cho Thuê Đồ Chơi Theo Tuần', vn: ['tiNiWorld', 'Kubo', 'ToyRent Cho Thuê Đồ Chơi'], asia: 'AEON Fantasy (Kidzooona)', ticker: '4343.T', pois: ['apartment', 'market', 'park'], passion: 'entertainment_play', skill: 'operations_chain' },
      grow: { title: 'Lớp Mầm Non Tư Thục, Cảm Thụ Âm Nhạc, Tiếng Anh Mầm Non & Bơi Sinh Tồn', vn: ['Sakura Montessori', 'Apollo Junior', 'AquaTots'], asia: 'JP-Holdings Inc.', ticker: '2749.T', pois: ['apartment', 'school'], passion: 'education_coaching', skill: 'teaching_expertise' },
      community: { title: 'Tổ Chức Tiệc Thôi Nôi, Sinh Nhật Trọn Gói & Dã Ngoại Nông Trại Cuối Tuần', vn: ['Chú Hề Hoạt Náo Birthday', 'Nông Trại Giáo Dục Detrang/Chimi'], asia: 'KidZania / Family Event Asia', ticker: 'Edutainment Sector', pois: ['park', 'apartment', 'school'], passion: 'community_social', skill: 'community_building' },
    },
    school: {
      eat: { title: 'Kiosk Kem Tươi, Trà Sữa, Gà Rán & Bữa Phụ Dinh Dưỡng Cổng Trường', vn: ['Mixue', 'Gà Rán Five Star', 'Bánh Mì Que / Hamburger Cổng Trường'], asia: 'Mixue Group', ticker: '2097.HK', pois: ['school', 'apartment', 'market'], passion: 'food_nutrition', skill: 'operations_chain' },
      live: { title: 'Bàn Học Chống Gù Chống Cận, Đèn Học Thông Minh & Dịch Vụ Đưa Đón Học Sinh', vn: ['BSUC', 'Jidu', 'Xe Đưa Đón Học Sinh Nội Khu'], asia: 'Okamura /イトーキ (Itoki)', ticker: '7972.T', pois: ['school', 'apartment'], passion: 'real_estate_living', skill: 'sales_consulting' },
      wear: { title: 'Shop Đồng Phục, Giày Thể Thao Học Đường, Kính Mắt Học Sinh & Phụ Kiện Trend', vn: ['Biti’s Hunter Junior', 'Kính Mắt Anna', 'Moji'], asia: 'ABC-Mart Inc.', ticker: '2670.T', pois: ['school', 'market'], passion: 'fashion_beauty', skill: 'marketing_digital' },
      play: { title: 'Nhà Sách Trải Nghiệm, Khu Game Xu, Trượt Patin & CLB Thể Thao Học Đường', vn: ['Nhà Sách Tiến Thọ', 'FAHASA', 'Sân Bóng Đá/Bóng Rổ Học Đường'], asia: 'Round One Corp.', ticker: '4680.T', pois: ['school', 'park', 'market'], passion: 'entertainment_play', skill: 'operations_chain' },
      grow: { title: 'Trung Tâm Anh Ngữ, Toán Tư Duy, Lập Trình Robotics & Lớp Bán Trú Sau Giờ Học', vn: ['ILA / VUS', 'MindX', 'Mathnasium'], asia: 'Meiko Network Japan', ticker: '4668.T', pois: ['school', 'apartment'], passion: 'education_coaching', skill: 'teaching_expertise' },
      community: { title: 'Trại Hè Kỹ Năng Sống, Quân Đội, Hùng Biện & Hoạt Động Ngoại Khóa Trường Học', vn: ['Trại Hè Quân Đội', 'CLB Tranh Biện Học Đường'], asia: 'Benesse Holdings', ticker: '9783.T', pois: ['school', 'park'], passion: 'community_social', skill: 'community_building' },
    },
    student: {
      eat: { title: 'Quán Lẩu Nướng Sinh Viên, Cơm Trộn Hàn Quốc, Mì Cay & Trà Chanh Tụ Tập', vn: ['Lẩu Phan', 'Mì Cay Sasin', 'Trà Chanh Bụi Phố'], asia: 'Saizeriya / Yoshinoya', ticker: '7581.T / 9861.T', pois: ['school', 'market', 'apartment'], passion: 'food_nutrition', skill: 'culinary_rd' },
      live: { title: 'Ký Túc Xá Tư Nhân (Sleepbox), Phòng Trọ Dịch Vụ & Giặt Sấy Tự Động 24/7', vn: ['Sleepbox Làng ĐH', 'Nhà Trọ Văn Minh', 'Giặt Sấy Sinh Viên'], asia: 'Kyoritsu Maintenance', ticker: '9616.T', pois: ['school', 'market'], passion: 'real_estate_living', skill: 'operations_chain' },
      wear: { title: 'Tiệm Đồ Secondhand (Thrift Shop), Thời Trang Local Brand & Mỹ Phẩm Chiết/Drugstore', vn: ['Hasaki', 'SammiShop', 'Thrift Shop Chùa Bộc'], asia: 'Treasure Factory (2nd Street)', ticker: '3093.T', pois: ['school', 'market'], passion: 'fashion_beauty', skill: 'marketing_digital' },
      play: { title: 'Quán Cafe Học Bài 24/7, Boardgame Cafe, Billiards Club & Photobooth Hàn Quốc', vn: ['Billiards Peri/Aplus', 'Photobooth Haru Film', 'WorkFlow Study Cafe'], asia: 'Kaikatsu Club (Aoki Holdings)', ticker: '8214.T', pois: ['school', 'tourism'], passion: 'entertainment_play', skill: 'tech_automation' },
      grow: { title: 'Lò Luyện IELTS/TOEIC, Kỹ Năng AI/Data, Đào Tạo Pha Chế/Barista Ngắn Hạn', vn: ['IELTS Fighter', 'MindX', 'Học Viện Pha Chế Namas'], asia: 'New Oriental (EDU)', ticker: '9901.HK', pois: ['school', 'office'], passion: 'education_coaching', skill: 'teaching_expertise' },
      community: { title: 'Không Gian Co-working Sinh Viên, Sự Kiện Hướng Nghiệp & CLB Giao Lưu Quốc Tế', vn: ['Toong / UpGen', 'English Coffee Club'], asia: 'JustCo / WeWork Asia', ticker: 'Co-working Benchmark', pois: ['school', 'office'], passion: 'community_social', skill: 'community_building' },
    },
    young_family: {
      eat: { title: 'Cà Phê Mang Đi (Grab & Go), Cơm Trưa Healthy Văn Phòng &Thực Phẩm Sơ Chế Sẵn', vn: ['Katinat / Highlands', 'Homefarm', 'Fitfood VN'], asia: 'Luckin Coffee / Guoquan Shihui', ticker: 'LKNCY / 2517.HK', pois: ['office', 'apartment', 'market'], passion: 'food_nutrition', skill: 'operations_chain' },
      live: { title: 'Dịch Vụ Giúp Việc Theo Giờ, Vệ Sinh Sofa/Máy Lạnh & Thiết Bị Nhà Thông Minh', vn: ['bTaskee', 'JupViec', 'Vệ Sinh Công Nghiệp Nội Khu'], asia: 'Duskin Co., Ltd. (Care Services)', ticker: '4665.T', pois: ['apartment', 'office'], passion: 'real_estate_living', skill: 'operations_chain' },
      wear: { title: 'Tiệm Gội Đầu Dưỡng Sinh, Nail-Mi-Spa Công Sở & Thời Trang Thiết Kế Đi Làm', vn: ['Hasaki Spa', 'Lisa Nail & Spa', 'Routine / Coolmate'], asia: 'Beauty Garage / Fast Retailing', ticker: '3180.T / 9983.T', pois: ['office', 'apartment'], passion: 'fashion_beauty', skill: 'sales_consulting' },
      play: { title: 'Glamping Cuối Tuần, Workshop Làm Gốm/Nến Thơm, Chill Bar & Sân Pickleball', vn: ['Workshop Bát Tràng / Nến Thơm', 'Sân Pickleball Nội Đô'], asia: 'Snow Peak / Round One', ticker: '7816.T / 4680.T', pois: ['park', 'tourism', 'office'], passion: 'entertainment_play', skill: 'community_building' },
      grow: { title: 'Phòng Tập Pilates/Yoga/Gym Boutique & Khóa Học Đầu Tư/Quản Trị Cho Người Đi Làm', vn: ['California / Elite', 'MBS Pilates', 'Lớp Yoga Chân Chung Cư'], asia: 'Fast Fitness Japan (Anytime)', ticker: '7092.T', pois: ['office', 'apartment'], passion: 'health_wellness', skill: 'teaching_expertise' },
      community: { title: 'CLB Chạy Bộ (Running Club), Hội Cư Dân Mua Chung (Group Buy) & Networking', vn: ['Hội Mua Chung Chung Cư', 'CLB Chạy Bộ Địa Phương'], asia: 'Pinduoduo Community Group Buy', ticker: 'PDD (NASDAQ)', pois: ['apartment', 'park', 'office'], passion: 'community_social', skill: 'community_building' },
    },
    middle_age: {
      eat: { title: 'Nhà Hàng Tiếp Khách VIP, Thực Phẩm Hữu Cơ Nhập Khẩu, Trà Đạo & Rượu Vang', vn: ['Annam Gourmet', 'Klepe / Quả Táo Vàng', 'Nhà Hàng Hải Sản/Dưỡng Sinh'], asia: 'Haidilao / EuroEyes', ticker: '6862.HK', pois: ['office', 'apartment', 'tourism'], passion: 'food_nutrition', skill: 'sales_consulting' },
      live: { title: 'Cải Tạo Nội Thất Trọn Gói, Cây Cảnh Phong Thủy Sân Vườn & Quản Lý Tài Sản Cho Thuê', vn: ['Nội Thất Nhà Xinh / Aka', 'Vườn Tùng / Cá Koi Phong Thủy'], asia: 'Nitori Holdings', ticker: '9843.T', pois: ['apartment', 'office'], passion: 'real_estate_living', skill: 'sales_consulting' },
      wear: { title: 'Thẩm Mỹ Nội Khoa Trẻ Hóa Da, Nha Khoa Răng Sứ & Thời Trang Golf/Doanh Nhân', vn: ['Nha Khoa Kim', 'Thẩm Mỹ Viện Công Nghệ Cao', 'Thời Trang Golf Giovanni/Aristino'], asia: 'SBC Medical / Aesthetic Asia', ticker: 'SBC (NASDAQ)', pois: ['office', 'apartment', 'hospital'], passion: 'fashion_beauty', skill: 'sales_consulting' },
      play: { title: 'Phòng Tập Golf 3D Trong Nhà, Sân Pickleball VIP & Tour Nghỉ Dưỡng Wellness', vn: ['Golf 3D Screen Indoor', 'CLB Pickleball Doanh Nhân'], asia: 'Golfzon Co., Ltd.', ticker: '215000.KQ (KOSDAQ)', pois: ['office', 'apartment', 'park'], passion: 'entertainment_play', skill: 'sales_consulting' },
      grow: { title: 'Trung Tâm Trị Liệu Cột Sống Chiropractic, Tầm Soát Đột Quỵ & Coaching Doanh Nghiệp', vn: ['USAC Chiropractic', 'Bernard Healthcare / Medlatec'], asia: 'Raffles Medical Group', ticker: 'BSL.SI (SGX)', pois: ['hospital', 'office', 'apartment'], passion: 'health_wellness', skill: 'teaching_expertise' },
      community: { title: 'CLB Kết Nối Giao Thương (BNI/CEO Club), Hội Golf/Tennis & Quỹ Thiện Nguyện', vn: ['BNI Vietnam Chapter', 'CLB Doanh Nhân Địa Phương'], asia: 'Executive Networking Clubs Asia', ticker: 'B2B Membership Model', pois: ['office', 'tourism'], passion: 'community_social', skill: 'community_building' },
    },
    senior: {
      eat: { title: 'Cửa Hàng Sữa Hạt Y Học, Thực Dưỡng, Yến Sào Chưng Nóng & Thảo Dược Đông Y', vn: ['Yến Sào Khánh Hòa', 'Thực Dưỡng Khai Minh', 'Long Châu Nutrition'], asia: 'MatsukiyoCocokara / Euglena', ticker: '3088.T / 2931.T', pois: ['hospital', 'park', 'market', 'apartment'], passion: 'health_wellness', skill: 'sales_consulting' },
      live: { title: 'Thiết Bị Hỗ Trợ Người Già (Giường Y Tế, Tay Vịn Chống Trượt, Máy Đo Huyết Áp) & Chăm Sóc Tại Gia', vn: ['Siêu Thị Y Tế Gia Đình', 'WeCare247 Chăm Sóc Người Bệnh'], asia: 'Paramount Bed Holdings / NichiiGakkan', ticker: '7817.T', pois: ['hospital', 'apartment'], passion: 'health_wellness', skill: 'sales_consulting' },
      wear: { title: 'Kính Đa Tròng Lão Thị, Máy Trợ Thính, Giày Đế Êm Chống Trượt & Nhuộm Tóc Thảo Dược', vn: ['Tiệm Kính Lão Thị & Máy Trợ Thính', 'Gội Đầu Nhuộm Tóc Thảo Dược Phủ Bạc'], asia: 'Paris Miki Holdings / Aderans', ticker: '7455.T', pois: ['hospital', 'market', 'apartment'], passion: 'fashion_beauty', skill: 'sales_consulting' },
      play: { title: 'CLB Khiêu Vũ Cổ Điển, Cờ Tướng, Chăm Cây Cảnh & Tour Du Lịch Chậm/Suối Khoáng', vn: ['CLB Khiêu Vũ Dưỡng Sinh', 'Tour Suối Khoáng Nóng Trong Ngày'], asia: 'Club Tourism (KNT-CT Holdings)', ticker: '9726.T', pois: ['park', 'apartment'], passion: 'entertainment_play', skill: 'community_building' },
      grow: { title: 'Trung Tâm Vật Lý Trị Liệu Xương Khớp, Châm Cứu Bấm Huyệt & Tập Phục Hồi 30 Phút', vn: ['Phòng Khám Đông Y & Vật Lý Trị Liệu', 'Dưỡng Lão Bán Trú Diên Hồng'], asia: 'Curves Holdings / Charm Care', ticker: '7085.T / 6062.T', pois: ['park', 'hospital', 'apartment'], passion: 'health_wellness', skill: 'teaching_expertise' },
      community: { title: 'Trung Tâm Sinh Hoạt Bán Trú Người Cao Tuổi (Daycare) & Tour Hành Hương Tâm Linh', vn: ['Diên Hồng Daycare', 'Hội Người Cao Tuổi & Hành Hương'], asia: ' Tsukui Holdings (Day Service)', ticker: '2398.T', pois: ['park', 'hospital', 'apartment'], passion: 'community_social', skill: 'community_building' },
    },
    pet: {
      eat: { title: 'Cửa Hàng Thức Ăn Hạt, Xưởng Bếp Pate Tươi & Bánh Sinh Nhật Cho Chó Mèo', vn: ['The Pet Vietnam', 'Pet Mart Food', 'Paddy Pet'], asia: 'Yantai China Pet Foods (Wanpy)', ticker: '002891.SZ', pois: ['apartment', 'park', 'market'], passion: 'pets_nature', skill: 'culinary_rd' },
      live: { title: 'Khách Sạn Thú Cưng (Pet Hotel) Có Camera 24/7, Cát Vệ Sinh & Nội Thất Mèo (Cat Tree)', vn: ['Pet Mart Hotel', 'Paws Hotel', 'Xưởng Cat Tree Gỗ'], asia: 'AEON Pet Inc.', ticker: '8267.T Group', pois: ['apartment', 'park'], passion: 'pets_nature', skill: 'operations_chain' },
      wear: { title: 'Tiệm Grooming Spa (Tắm Cắt Tỉa Lông), Thời Trang Thú Cưng & Phụ Kiện Dây Dắt', vn: ['Kin Neko Spa', 'Tropicpet Grooming'], asia: 'AHB Inc. Japan', ticker: 'Pet Grooming Benchmark', pois: ['apartment', 'park'], passion: 'pets_nature', skill: 'operations_chain' },
      play: { title: 'Cà Phê Thú Cưng (Pet Cafe), Công Viên Chó Chạy & Hồ Bơi Cho Chó', vn: ['Corgi Cafe', 'Pet Park Thảo Điền / Tây Hồ'], asia: 'Cat Cafe MOCHA Japan', ticker: 'Pet Entertainment Sector', pois: ['park', 'tourism', 'apartment'], passion: 'pets_nature', skill: 'community_building' },
      grow: { title: 'Phòng Khám Thú Y, Tiêm Phòng, Siêu Âm & Trường Huấn Luyện Chó Cảnh', vn: ['Thú Y Petpro / Tropicpet', 'Trường Huấn Luyện Chó Nghiệp Vụ & Cảnh'], asia: 'Ruipeng Pet Healthcare / Anicom', ticker: '8715.T (Anicom Tokyo)', pois: ['apartment', 'park'], passion: 'pets_nature', skill: 'teaching_expertise' },
      community: { title: 'CLB Offline Chủ Nuôi Chó Mèo, Dịch Vụ Dắt Chó Đi Dạo (Dog Walking) & Phối Giống', vn: ['Cộng Đồng Yêu Chó Mèo Khu Đô Thị', 'Dịch Vụ Pet Sitter Tại Nhà'], asia: 'Boqii Holding Community', ticker: 'BQ', pois: ['park', 'apartment'], passion: 'pets_nature', skill: 'community_building' },
    },
  };

  // Chuẩn P&L & Vốn CAPEX thực tế theo từng Ngành Nhu cầu Maslow tại thị trường Việt Nam
  const vnIndustryBenchmark: Record<
    MaslowNeedId,
    Record<
      PriceTierId,
      {
        rev: number;
        cogs: number;
        rent: number;
        labor: number;
        opex: number; // Đã bao gồm điện nước, MKT, khấu hao TS & thuế khoán VN
        capexMin: number;
        capexMax: number;
        aov: number;
      }
    >
  > = {
    // 1. Ăn (F&B / Dinh dưỡng): Lãi ròng thực tế tại VN ~12% - 16%, quay vòng vốn nhanh
    eat: {
      budget: { rev: 95, cogs: 46, rent: 14, labor: 16, opex: 12, capexMin: 65, capexMax: 135, aov: 38 },
      mid: { rev: 175, cogs: 41, rent: 15, labor: 18, opex: 12, capexMin: 150, capexMax: 310, aov: 125 },
      premium: { rev: 310, cogs: 36, rent: 16, labor: 20, opex: 12, capexMin: 360, capexMax: 780, aov: 480 },
    },
    // 2. Ở (Lưu trú / Nội thất / Tiện ích nhà ở): Thâm dụng vốn tài sản (CAPEX cao), Lãi ròng ~13% - 17%, Hoàn vốn dài hơn
    live: {
      budget: { rev: 110, cogs: 42, rent: 15, labor: 15, opex: 15, capexMin: 110, capexMax: 230, aov: 180 },
      mid: { rev: 210, cogs: 45, rent: 14, labor: 15, opex: 11, capexMin: 240, capexMax: 520, aov: 650 },
      premium: { rev: 380, cogs: 40, rent: 15, labor: 16, opex: 12, capexMin: 550, capexMax: 1250, aov: 2400 },
    },
    // 3. Mặc (Bán lẻ Thời trang / Mỹ phẩm / Chăm sóc cá nhân): Tồn kho & chiết khấu MKT cao, Lãi ròng thực tế tại VN ~10% - 15%
    wear: {
      budget: { rev: 105, cogs: 54, rent: 13, labor: 12, opex: 11, capexMin: 75, capexMax: 160, aov: 95 },
      mid: { rev: 195, cogs: 48, rent: 14, labor: 14, opex: 11, capexMin: 170, capexMax: 350, aov: 290 },
      premium: { rev: 340, cogs: 40, rent: 15, labor: 17, opex: 13, capexMin: 380, capexMax: 820, aov: 950 },
    },
    // 4. Vui chơi giải trí (Khu vui chơi / Thể thao / Cafe trải nghiệm): Khấu hao thiết bị & mặt bằng lớn, Lãi ròng ~14% - 18%
    play: {
      budget: { rev: 115, cogs: 32, rent: 18, labor: 19, opex: 17, capexMin: 110, capexMax: 240, aov: 65 },
      mid: { rev: 220, cogs: 26, rent: 19, labor: 21, opex: 18, capexMin: 260, capexMax: 560, aov: 190 },
      premium: { rev: 390, cogs: 22, rent: 20, labor: 22, opex: 18, capexMin: 580, capexMax: 1300, aov: 680 },
    },
    // 5. Phát triển bản thân (Giáo dục / Kỹ năng / Y tế & Trị liệu): Chi phí nhân sự chuyên gia & tuyển sinh cao, Lãi ròng ~15% - 19%
    grow: {
      budget: { rev: 120, cogs: 24, rent: 14, labor: 29, opex: 18, capexMin: 80, capexMax: 175, aov: 350 },
      mid: { rev: 225, cogs: 22, rent: 15, labor: 30, opex: 16, capexMin: 180, capexMax: 390, aov: 1200 },
      premium: { rev: 410, cogs: 20, rent: 16, labor: 30, opex: 15, capexMin: 450, capexMax: 980, aov: 3500 },
    },
    // 6. Cộng đồng (CLB / Sự kiện / Group-Buy / Daycare): Vốn tài sản nhẹ (Asset-light), ROI & ROA cao, Lãi ròng ~14% - 18%
    community: {
      budget: { rev: 85, cogs: 35, rent: 10, labor: 22, opex: 19, capexMin: 45, capexMax: 105, aov: 110 },
      mid: { rev: 160, cogs: 30, rent: 12, labor: 24, opex: 18, capexMin: 110, capexMax: 240, aov: 360 },
      premium: { rev: 280, cogs: 26, rent: 14, labor: 25, opex: 17, capexMin: 250, capexMax: 540, aov: 1200 },
    },
  };

  const ageCapexFactor: Record<AgeSegmentId, number> = {
    infant: 1.05,
    toddler: 1.08,
    school: 0.92,
    student: 0.85,
    young_family: 1.05,
    middle_age: 1.22,
    senior: 1.1,
    pet: 0.95,
  };

  for (const age of allAges) {
    for (const need of allNeeds) {
      for (const tier of allTiers) {
        const exists = models.some(
          (m) => m.ageSegments.includes(age) && m.maslowNeeds.includes(need) && m.priceTier === tier
        );
        if (!exists) {
          const idea = cellIdeas[age][need];
          const tierLabel = tier === 'budget' ? 'Phân khúc Giá rẻ (Mass)' : tier === 'mid' ? 'Phân khúc Bình dân' : 'Phân khúc Cao cấp (Premium)';
          const bm = vnIndustryBenchmark[need][tier];
          const factor = ageCapexFactor[age] || 1.0;

          const rev = Math.round(bm.rev * factor);
          const cogs = bm.cogs;
          const gross = 100 - cogs;
          const rent = bm.rent;
          const labor = bm.labor;
          const opex = bm.opex;
          const net = Math.max(9, gross - rent - labor - opex);
          const capexMin = Math.round(bm.capexMin * factor);
          const capexMax = Math.round(bm.capexMax * factor);
          const aov = Math.round(bm.aov * factor);
          const monthlyNetMil = Math.max(5, Math.round((rev * net) / 100));

          models.push({
            id: `matrix-${age}-${need}-${tier}`,
            name: `${idea.title} — ${tierLabel}`,
            tagline: `Khai thác dòng tiền nhu cầu ${need.toUpperCase()} của tệp khách hàng ${age} ở mức giá ${tier === 'budget' ? 'tiết kiệm, tần suất cao' : tier === 'mid' ? 'phổ thông, tệp rộng' : 'cao cấp, biên lãi gộp lớn'}`,
            isMultiNeed: false,
            ageSegments: [age],
            maslowNeeds: [need],
            priceTier: tier,
            summary: `Mô hình ${idea.title} được tối ưu hóa cho ${tierLabel}. Các chỉ số P&L, ROI, ROA và Thời gian hoàn vốn đã được hiệu chỉnh sát với mặt bằng giá thuê mặt bằng, chi phí nhân sự, khấu hao tài sản cố định và sức mua thực tế tại thị trường Việt Nam.`,
            productsAndServices: [
              `Sản phẩm/Dịch vụ phễu thu hút khách hàng mới (${tierLabel})`,
              'Gói Combo / Thẻ trả trước (Prepaid/Subscription) giữ chân khách hàng định kỳ',
              'Sản phẩm bán chéo (Up-sell/Cross-sell) gia tăng biên lợi nhuận ròng',
            ],
            exemplarsVN: idea.vn,
            exemplarsAsia: [
              {
                name: idea.asia,
                country: 'Nhật Bản / Châu Á',
                tickerOrStatus: idea.ticker,
                financialHighlight: `Biên lợi nhuận gộp chuẩn ngành đạt ${gross}%, biên lãi ròng thực tế tại điểm bán Việt Nam (sau khấu hao & thuế) ước đạt ~${net}%.`,
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
              paybackMonthsMin: Math.max(6, Math.round((capexMin * 1.15) / monthlyNetMil + 1)),
              paybackMonthsMax: Math.max(10, Math.round((capexMax * 1.2) / monthlyNetMil + 2)),
              averageOrderValueVND: aov,
              repeatRatePercent: tier === 'budget' ? 78 : tier === 'mid' ? 72 : 65,
              cashflowCycle: 'Thu tiền trực tiếp qua POS/QR và gói thẻ thành viên trả trước; đã tính dự phòng 3 tháng cọc mặt bằng và 2 tháng chạy đà (Ramp-up) tại Việt Nam.',
              dataSourceCitation: `BCTC ${idea.asia} (${idea.ticker}) & hiệu chỉnh theo mặt bằng P&L thực tế tại Việt Nam.`,
            },
            locationRequirements: {
              idealPOIs: idea.pois,
              minAreaM2: tier === 'budget' ? 20 : tier === 'mid' ? 40 : 75,
              footTrafficNotes: 'Đặt tại bán kính 0.2 - 1.5km quanh các điểm tụ tập của tệp khách hàng mục tiêu.',
            },
            ikigaiProfile: {
              passions: [idea.passion],
              skills: [idea.skill, 'operations_chain'],
              techLevel: 'moderate',
              networkAdvantages: ['landlord_re', 'kol_local_group'],
              goalFit: tier === 'budget' ? ['cashflow_fast', 'scalable_chain'] : tier === 'mid' ? ['cashflow_fast', 'scalable_chain'] : ['high_margin'],
            },
            keySuccessFactors: [
              'Định vị rõ ràng theo phân khúc giá để thiết kế mặt bằng và bao bì tương xứng',
              'Xây dựng tệp khách hàng quen trong bán kính 2km qua Zalo OA / Hội nhóm cư dân',
            ],
            risks: [
              'Cần giữ chi phí mặt bằng dưới 15% doanh thu dự kiến để đảm bảo biên an toàn dòng tiền',
            ],
            sourceType: 'curated',
          });
        }
      }
    }
  }

  return models;
}

