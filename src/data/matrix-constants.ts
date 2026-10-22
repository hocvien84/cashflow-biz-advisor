import { AgeSegmentId, MaslowNeedId, PriceTierId, POICategory } from '@/types/business';

export interface AgeSegmentMeta {
  id: AgeSegmentId;
  label: string;
  subLabel: string;
  icon: string;
  decisionMaker: string;
  keyInsight: string;
}

export interface MaslowNeedMeta {
  id: MaslowNeedId;
  label: string;
  maslowLevel: string;
  icon: string;
  description: string;
  colorClass: string;
}

export interface PriceTierMeta {
  id: PriceTierId;
  label: string;
  badgeColor: string;
  marginCharacteristic: string;
  volumeCharacteristic: string;
}

export const AGE_SEGMENTS: AgeSegmentMeta[] = [
  {
    id: 'infant',
    label: 'Trẻ sơ sinh',
    subLabel: '< 18 tháng',
    icon: 'Baby',
    decisionMaker: 'Bố mẹ trẻ (24-35 tuổi) & Ông bà',
    keyInsight: 'Ưu tiên tuyệt đối sự an toàn, y khoa, hữu cơ; độ nhạy cảm về giá thấp, tần suất mua lặp lại cực cao (bỉm, sữa, ăn dặm).',
  },
  {
    id: 'toddler',
    label: 'Trẻ em',
    subLabel: '< 6 tuổi',
    icon: 'Blocks',
    decisionMaker: 'Bố mẹ (kết hợp sở thích của bé)',
    keyInsight: 'Giai đoạn vàng phát triển thể chất & vận động; nhu cầu cháo dinh dưỡng, đồ chơi giáo dục, khu vui chơi trong nhà và chuỗi Mẹ & Bé.',
  },
  {
    id: 'school',
    label: 'Học sinh',
    subLabel: '6 - 18 tuổi',
    icon: 'GraduationCap',
    decisionMaker: 'Phụ huynh chi trả & Học sinh tự chi tiêu vặt',
    keyInsight: 'Hai dòng tiền song song: Phụ huynh chi mạnh cho ngoại ngữ/STEM/năng khiếu/dinh dưỡng; Học sinh chi tiêu ăn vặt, trà sữa, văn phòng phẩm theo trend.',
  },
  {
    id: 'student',
    label: 'Sinh viên',
    subLabel: '18 - 22 tuổi',
    icon: 'BookOpen',
    decisionMaker: 'Tự quyết định (ngân sách giới hạn nhưng tần suất cao)',
    keyInsight: 'Nhạy cảm về giá nhưng cực kỳ bắt trend mạng xã hội; chi tiêu mạnh cho ăn uống tụ tập, ký túc xá/phòng trọ dịch vụ, thời trang fast-fashion và kỹ năng nghề nghiệp.',
  },
  {
    id: 'young_family',
    label: 'Đi làm & Gia đình trẻ',
    subLabel: '22 - 35 tuổi',
    icon: 'Briefcase',
    decisionMaker: 'Tự chủ tài chính & Đồng thuận vợ chồng',
    keyInsight: 'Nhóm tạo dòng tiền lớn nhất thị trường: mua sự tiện lợi, tiết kiệm thời gian, cà phê công sở, chăm sóc sức khỏe, nhà cửa thông minh và giải trí cuối tuần.',
  },
  {
    id: 'middle_age',
    label: 'Trung niên',
    subLabel: '35 - 55 tuổi',
    icon: 'Crown',
    decisionMaker: 'Tự quyết định (tích lũy tài sản cao)',
    keyInsight: 'Sức mua cao nhất (High AOV); chuyển dịch từ số lượng sang chất lượng, thực phẩm dưỡng sinh, bất động sản/nội thất, tầm soát sức khỏe, chống lão hóa và CLB giao thương.',
  },
  {
    id: 'senior',
    label: 'Cao tuổi',
    subLabel: '> 55 tuổi',
    icon: 'HeartHandshake',
    decisionMaker: 'Người cao tuổi & Con cái hiếu thảo mua tặng',
    keyInsight: 'Kinh tế bạc (Silver Economy) tăng trưởng nhanh nhất Châu Á: dinh dưỡng y học, vật lý trị liệu, du lịch nghỉ dưỡng chậm, dưỡng lão bán trú và CLB dưỡng sinh.',
  },
  {
    id: 'pet',
    label: 'Thú cưng',
    subLabel: 'Chó, Mèo, Sinh vật cảnh',
    icon: 'PawPrint',
    decisionMaker: 'Chủ nuôi ("Sen" Gen Z, Gia đình trẻ & Người độc thân)',
    keyInsight: 'Xu hướng "nhân격 hóa thú cưng" (Pet Humanization): biên lợi nhuận dịch vụ Spa/Hotel/Thú y và pate tươi/thức ăn hạt lên tới 40-65%, khách hàng trung thành định kỳ.',
  },
];

export const MASLOW_NEEDS: MaslowNeedMeta[] = [
  {
    id: 'eat',
    label: 'Ăn (Dinh dưỡng & F&B)',
    maslowLevel: 'Nhu cầu Sinh lý (Physiological)',
    icon: 'Utensils',
    description: 'Thực phẩm hàng ngày, ăn dặm, cháo dinh dưỡng, đồ uống, nhà hàng, thực phẩm chức năng.',
    colorClass: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
  },
  {
    id: 'live',
    label: 'Ở (Không gian & Lưu trú)',
    maslowLevel: 'Nhu cầu An toàn (Safety & Shelter)',
    icon: 'Home',
    description: 'Lưu trú, phòng trọ/căn hộ dịch vụ, nội thất, vệ sinh nhà cửa, thiết bị an toàn & chăm sóc tại gia.',
    colorClass: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
  },
  {
    id: 'wear',
    label: 'Mặc (Thời trang & Chăm sóc)',
    maslowLevel: 'Nhu cầu Thể diện & Sinh lý',
    icon: 'Shirt',
    description: 'Quần áo, giày dép, phụ kiện, bỉm tã, mỹ phẩm, spa, grooming, chăm sóc ngoại hình.',
    colorClass: 'from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-300',
  },
  {
    id: 'play',
    label: 'Vui chơi giải trí',
    maslowLevel: 'Nhu cầu Tinh thần & Trải nghiệm',
    icon: 'Gamepad2',
    description: 'Khu vui chơi, đồ chơi, giải trí, thể thao, du lịch, workshop, trải nghiệm cuối tuần.',
    colorClass: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300',
  },
  {
    id: 'grow',
    label: 'Phát triển bản thân',
    maslowLevel: 'Nhu cầu Tự hoàn thiện & Tôn trọng',
    icon: 'Sparkles',
    description: 'Giáo dục sớm, ngoại ngữ, STEM, đào tạo nghề, rèn luyện thể chất, y tế dự phòng & trị liệu.',
    colorClass: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
  },
  {
    id: 'community',
    label: 'Cộng đồng & Kết nối',
    maslowLevel: 'Nhu cầu Xã hội & Thuộc về (Belonging)',
    icon: 'Users',
    description: 'CLB hội nhóm, không gian sinh hoạt chung, sự kiện kết nối, tâm linh, hoạt động xã hội.',
    colorClass: 'from-violet-500/20 to-fuchsia-500/10 border-violet-500/40 text-violet-300',
  },
];

export const PRICE_TIERS: PriceTierMeta[] = [
  {
    id: 'budget',
    label: 'Giá rẻ (Mass)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    marginCharacteristic: 'Biên LN ròng 10-18%, tối ưu nhờ quy mô & tự động hóa',
    volumeCharacteristic: 'Sản lượng lớn, tần suất mua hàng ngày, thu tiền mặt ngay',
  },
  {
    id: 'mid',
    label: 'Bình dân (Mid-tier)',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    marginCharacteristic: 'Biên LN ròng 15-25%, cân bằng thương hiệu & chi phí',
    volumeCharacteristic: 'Tệp khách hàng rộng nhất tại các khu đô thị & khu dân cư',
  },
  {
    id: 'premium',
    label: 'Cao cấp (Premium)',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    marginCharacteristic: 'Biên LN gộp 55-75%, LN ròng 20-35%, giá trị đơn (AOV) cao',
    volumeCharacteristic: 'Cần vị trí đắc địa/khu nhà giàu, dịch vụ cá nhân hóa sâu',
  },
];

export const POI_CATEGORY_META: Record<POICategory, { label: string; color: string; description: string }> = {
  school: {
    label: 'Trường học (Mầm non - ĐH)',
    color: '#3b82f6',
    description: 'Tập trung trẻ em, học sinh, sinh viên và phụ huynh đưa đón 2 khung giờ vàng/ngày',
  },
  hospital: {
    label: 'Bệnh viện & Phòng khám',
    color: '#ef4444',
    description: 'Nhu cầu cao về dinh dưỡng phục hồi, cháo súp, mẹ & bé, nhà thuốc, lưu trú ngắn ngày',
  },
  park: {
    label: 'Công viên & Thể thao',
    color: '#10b981',
    description: 'Tập trung người cao tuổi sáng sớm, trẻ em & thú cưng chiều tối, cộng đồng chạy bộ',
  },
  market: {
    label: 'Chợ, Siêu thị & TTTM',
    color: '#f59e0b',
    description: 'Lưu lượng giao thương sầm uất, nội trợ, gia đình trẻ mua sắm định kỳ',
  },
  apartment: {
    label: 'Chung cư & Khu dân cư',
    color: '#8b5cf6',
    description: 'Mật độ hộ gia đình trẻ, trẻ nhỏ và thú cưng dày đặc; tiêu dùng lặp lại tại chân đế',
  },
  office: {
    label: 'Văn phòng & Khu công sở',
    color: '#06b6d4',
    description: 'Dòng tiền mạnh buổi trưa & chiều từ dân văn phòng (22-45 tuổi): F&B, làm đẹp, gym',
  },
  tourism: {
    label: 'Điểm du lịch & Khách sạn',
    color: '#ec4899',
    description: 'Khách vãng lai chi tiêu trải nghiệm cao, đặc sản, lưu trú, dịch vụ tiện ích 24/7',
  },
};

export const IKIGAI_OPTIONS = {
  passions: [
    { id: 'food_nutrition', label: 'Ẩm thực, Dinh dưỡng & Đồ uống' },
    { id: 'kids_mother', label: 'Chăm sóc Mẹ & Bé, Gia đình' },
    { id: 'education_coaching', label: 'Giáo dục, Đào tạo & Phát triển con người' },
    { id: 'fashion_beauty', label: 'Thời trang, Làm đẹp & Phong cách sống' },
    { id: 'health_wellness', label: 'Sức khỏe, Y tế dự phòng & Dưỡng sinh' },
    { id: 'real_estate_living', label: 'Không gian sống, Lưu trú & Nội thất' },
    { id: 'entertainment_play', label: 'Giải trí, Khu vui chơi & Sự kiện' },
    { id: 'pets_nature', label: 'Thú cưng & Sinh vật cảnh' },
    { id: 'community_social', label: 'Xây dựng Cộng đồng & Kết nối xã hội' },
  ],
  skills: [
    { id: 'operations_chain', label: 'Vận hành cửa hàng, Chuẩn hóa quy trình SOP' },
    { id: 'marketing_digital', label: 'Marketing, TikTok/Facebook Ads, Xây kênh & Livestream' },
    { id: 'culinary_rd', label: 'Nấu ăn, Pha chế, R&D công thức sản phẩm' },
    { id: 'sales_consulting', label: 'Tư vấn bán hàng giá trị cao & Chăm sóc khách hàng' },
    { id: 'teaching_expertise', label: 'Giảng dạy, Chuyên môn Y dược / Sư phạm / Kỹ thuật' },
    { id: 'supply_chain', label: 'Thu mua, Quản trị tồn kho & Tối ưu giá vốn' },
    { id: 'community_building', label: 'Tổ chức sự kiện, Hoạt náo & Gắn kết hội nhóm' },
    { id: 'tech_automation', label: 'Ứng dụng Công nghệ, Phần mềm POS/CRM & Tự động hóa' },
  ],
  networks: [
    { id: 'landlord_re', label: 'Có sẵn mặt bằng nhà hoặc quan hệ chủ BĐS/Ban quản lý chung cư' },
    { id: 'factory_supplier', label: 'Quan hệ xưởng sản xuất, tổng kho sỉ hoặc nguồn hàng nông sản/nhập khẩu' },
    { id: 'school_hospital_gov', label: 'Quan hệ với Hiệu trưởng trường học, Bệnh viện, Cơ quan địa phương' },
    { id: 'kol_local_group', label: 'Sở hữu/Quản trị hội nhóm cư dân, CLB địa phương hoặc KOLs' },
    { id: 'medical_vet_pro', label: 'Có đội ngũ Bác sĩ, Dược sĩ, Giáo viên hoặc Bác sĩ thú y đồng hành' },
  ],
  goals: [
    {
      id: 'cashflow_fast' as const,
      label: 'Dòng tiền dương ngay (Cashflow-First)',
      desc: 'Thu tiền mặt hàng ngày, vòng quay vốn nhanh, hoàn vốn < 12 tháng',
    },
    {
      id: 'high_margin' as const,
      label: 'Biên lợi nhuận ròng cao (> 22%)',
      desc: 'Tập trung sản phẩm/dịch vụ giá trị gia tăng cao, ít cạnh tranh về giá',
    },
    {
      id: 'scalable_chain' as const,
      label: 'Đóng gói nhân chuỗi / Nhượng quyền',
      desc: 'Dễ chuẩn hóa SOP để mở 5-50 điểm bán hoặc bán Franchise',
    },
    {
      id: 'semi_passive' as const,
      label: 'Vận hành tinh gọn / Bán tự động',
      desc: 'Ít phụ thuộc nhân sự tay nghề cao, dễ quản lý từ xa bằng công nghệ',
    },
  ],
};

export const PRESET_LOCATIONS = [
  {
    name: 'Khu đô thị Vinhomes Smart City (Tây Mỗ, Nam Từ Liêm, Hà Nội)',
    lat: 21.0031,
    lng: 105.7406,
    badge: 'Đô thị Gia đình trẻ & Trẻ nhỏ',
  },
  {
    name: 'Phường Thảo Điền (TP. Thủ Đức, TP.HCM)',
    lat: 10.8035,
    lng: 106.7336,
    badge: 'Khu Cao cấp, Quốc tế & Thú cưng',
  },
  {
    name: 'Khu Bách - Kinh - Xây (Hai Bà Trưng, Hà Nội)',
    lat: 21.0041,
    lng: 105.8455,
    badge: 'Thủ phủ Sinh viên & Học sinh',
  },
  {
    name: 'Khu đô thị Phú Mỹ Hưng (Quận 7, TP.HCM)',
    lat: 10.7295,
    lng: 106.7068,
    badge: 'Gia đình Trung - Thượng lưu & Người cao tuổi',
  },
  {
    name: 'Quận Hải Châu - Trung tâm Đà Nẵng',
    lat: 16.0678,
    lng: 108.2208,
    badge: 'Khu Dân cư + Du lịch & Dịch vụ',
  },
  {
    name: 'Khu vực Bệnh viện Nhi Đồng 1 & Chợ Lớn (Quận 10, TP.HCM)',
    lat: 10.7683,
    lng: 106.6703,
    badge: 'Mật độ Y tế, Mẹ & Bé, Dân cư truyền thống',
  },
];
