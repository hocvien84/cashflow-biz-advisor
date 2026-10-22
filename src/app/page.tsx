'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  AGE_SEGMENTS,
  MASLOW_NEEDS,
  PRICE_TIERS,
  POI_CATEGORY_META,
  IKIGAI_OPTIONS,
  PRESET_LOCATIONS,
} from '@/data/matrix-constants';
import {
  AgeSegmentId,
  AreaIntelligenceRecord,
  BusinessModel,
  IkigaiUserInput,
  LeadUser,
  MaslowNeedId,
  PriceTierId,
  POICategory,
} from '@/types/business';
import { scoreBusinessModels } from '@/lib/recommendation-engine';
import { computeVietnamInvestmentMetrics } from '@/lib/investment-metrics';
import PnLSimulatorCard from '@/components/PnLSimulatorCard';
import {
  AdminLeadCrmModal,
  EmailPdfActionCard,
  LeadAuthGate,
  LoggedInUserBar,
  SmtpClientConfig,
} from '@/components/LeadGateAndCrm';
import {
  Grid,
  MapPin,
  Compass,
  Sparkles,
  Search,
  Database,
  RefreshCw,
  Layers,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Settings,
  ChevronRight,
  Building2,
  Users,
  Wallet,
  Cpu,
  Handshake,
  Target,
  PlusCircle,
  Loader2,
  Award,
} from 'lucide-react';

const LocationMapView = dynamic(() => import('@/components/LocationMapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] w-full rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 text-sm">
      Đang tải bản đồ định vị bán kính...
    </div>
  ),
});

type ActiveTab = 'matrix' | 'location' | 'ikigai' | 'advisor';

export default function CashflowBizAdvisorApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('matrix');

  // 1. State: Business Models from SQLite DB
  const [models, setModels] = useState<BusinessModel[]>([]);
  const [loadingModels, setLoadingModels] = useState<boolean>(true);
  const [selectedAge, setSelectedAge] = useState<AgeSegmentId>('toddler');
  const [selectedNeed, setSelectedNeed] = useState<MaslowNeedId>('eat');
  const [selectedTierFilter, setSelectedTierFilter] = useState<PriceTierId | 'all'>('all');
  const [showMultiNeedOnly, setShowMultiNeedOnly] = useState<boolean>(false);
  const [activeModelDetail, setActiveModelDetail] = useState<BusinessModel | null>(null);

  // AI Custom Research state on Matrix tab
  const [researchAges, setResearchAges] = useState<AgeSegmentId[]>(['toddler']);
  const [researchNeeds, setResearchNeeds] = useState<MaslowNeedId[]>(['eat', 'wear']);
  const [researchTier, setResearchTier] = useState<PriceTierId>('mid');
  const [researchCustomText, setResearchCustomText] = useState<string>('');
  const [isResearchingModel, setIsResearchingModel] = useState<boolean>(false);
  const [researchFeedback, setResearchFeedback] = useState<string>('');

  // 2. State: Location & Area Intelligence
  const [lat, setLat] = useState<number>(PRESET_LOCATIONS[0].lat);
  const [lng, setLng] = useState<number>(PRESET_LOCATIONS[0].lng);
  const [radiusKm, setRadiusKm] = useState<number>(1.0);
  const [locationQuery, setLocationQuery] = useState<string>('');
  const [geocodeResults, setGeocodeResults] = useState<{ name: string; lat: number; lng: number }[]>([]);
  const [areaData, setAreaData] = useState<AreaIntelligenceRecord | null>(null);
  const [cachedAreasList, setCachedAreasList] = useState<AreaIntelligenceRecord[]>([]);
  const [isScanningArea, setIsScanningArea] = useState<boolean>(false);
  const [isSearchingGeocode, setIsSearchingGeocode] = useState<boolean>(false);
  const [areaStatusMsg, setAreaStatusMsg] = useState<string>('');

  // 3. State: Ikigai & User Resources
  const [ikigai, setIkigai] = useState<IkigaiUserInput>({
    passions: ['food_nutrition', 'kids_mother'],
    strongestSkills: ['operations_chain', 'marketing_digital'],
    capitalBudgetMilVND: 350,
    riskTolerance: 'medium',
    techCapability: 'moderate',
    networks: ['landlord_re', 'kol_local_group'],
    primaryGoals: ['cashflow_fast', 'scalable_chain'],
    personalNote: '',
  });

  // 4. API Keys & Map Mode Settings
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');
  const [useGoogleMaps, setUseGoogleMaps] = useState<boolean>(false);

  // 5. Lead Capture Account & Admin CRM State
  const [currentUser, setCurrentUser] = useState<LeadUser | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [smtpConfig, setSmtpConfig] = useState<SmtpClientConfig>({
    gmailUser: '',
    gmailAppPassword: '',
    resendApiKey: '',
    webhookUrl: '',
  });

  // Load saved keys from localStorage + initial models & cached areas from SQLite
  useEffect(() => {
    const savedGemini = localStorage.getItem('CBA_GEMINI_KEY') || '';
    const savedGMaps = localStorage.getItem('CBA_GMAPS_KEY') || '';
    if (savedGemini) setGeminiApiKey(savedGemini);
    if (savedGMaps) setGoogleMapsApiKey(savedGMaps);

    try {
      const savedLeadRaw = localStorage.getItem('CBA_LEAD_USER');
      if (savedLeadRaw) {
        const parsedLead = JSON.parse(savedLeadRaw) as LeadUser;
        if (parsedLead && parsedLead.email) {
          setCurrentUser(parsedLead);
          if (parsedLead.capitalBudgetMilVND) {
            setIkigai((prev) => ({
              ...prev,
              capitalBudgetMilVND: parsedLead.capitalBudgetMilVND,
            }));
          }
        }
      }
      const savedSmtpRaw = localStorage.getItem('CBA_SMTP_CONFIG');
      if (savedSmtpRaw) {
        setSmtpConfig(JSON.parse(savedSmtpRaw));
      }
    } catch {
      // ignore invalid storage
    } finally {
      setAuthChecked(true);
    }

    fetchModels();
    fetchCachedAreasHistory();
  }, []);

  const fetchModels = async () => {
    setLoadingModels(true);
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      if (data.models) {
        setModels(data.models);
      }
    } catch (e) {
      console.error('Failed to load models:', e);
    } finally {
      setLoadingModels(false);
    }
  };

  const fetchCachedAreasHistory = async () => {
    try {
      const res = await fetch('/api/area-research');
      const data = await res.json();
      if (data.history) {
        setCachedAreasList(data.history);
      }
    } catch (e) {
      console.error('Failed to load cached areas:', e);
    }
  };

  const triggerAreaScan = useCallback(
    async (
      targetLat: number,
      targetLng: number,
      targetRadius: number,
      locName = '',
      forceRefresh = false
    ) => {
      setIsScanningArea(true);
      setAreaStatusMsg('⏳ Đang quét các địa điểm (POIs) trong bán kính và phân tích nhân khẩu học...');
      try {
        const res = await fetch('/api/area-research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: targetLat,
            lng: targetLng,
            radiusKm: targetRadius,
            locationNameInput: locName,
            forceRefresh,
            apiKey: geminiApiKey,
            googleMapsApiKey,
          }),
        });
        const data = await res.json();
        if (data.area) {
          setAreaData(data.area);
          setAreaStatusMsg(data.message || '');
          fetchCachedAreasHistory();
        }
      } catch (e) {
        console.error('Area scan error:', e);
        setAreaStatusMsg('⚠️ Có lỗi kết nối tạm thời khi quét khu vực, vui lòng thử lại.');
      } finally {
        setIsScanningArea(false);
      }
    },
    [geminiApiKey, googleMapsApiKey]
  );

  // Run initial area scan on first load so the user immediately has rich location data
  useEffect(() => {
    triggerAreaScan(PRESET_LOCATIONS[0].lat, PRESET_LOCATIONS[0].lng, 1.0, PRESET_LOCATIONS[0].name, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGeocodeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationQuery.trim()) return;
    setIsSearchingGeocode(true);
    setAreaStatusMsg(`🔍 Đang tìm tọa độ cho "${locationQuery}"...`);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(locationQuery)}&gmapsKey=${encodeURIComponent(
          googleMapsApiKey
        )}&geminiKey=${encodeURIComponent(geminiApiKey)}`
      );
      const data = await res.json();
      const found = data.results || [];
      setGeocodeResults(found);
      if (found.length > 0) {
        const first = found[0];
        setLat(first.lat);
        setLng(first.lng);
        await triggerAreaScan(first.lat, first.lng, radiusKm, first.name, false);
      } else {
        setAreaStatusMsg(
          `⚠️ Không tìm thấy địa danh "${locationQuery}". Hãy thử nhập tên Quận/Phường (VD: Cầu Giấy Hà Nội, Quận 7 TPHCM) hoặc click trực tiếp lên bản đồ!`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingGeocode(false);
    }
  };

  const handleUseMyGPS = () => {
    if (!navigator.geolocation) {
      setAreaStatusMsg('⚠️ Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }
    setAreaStatusMsg('📡 Đang lấy tọa độ GPS hiện tại của bạn...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const myLat = Number(pos.coords.latitude.toFixed(5));
        const myLng = Number(pos.coords.longitude.toFixed(5));
        setLat(myLat);
        setLng(myLng);
        triggerAreaScan(myLat, myLng, radiusKm, '', false);
      },
      () => {
        setAreaStatusMsg('⚠️ Bạn chưa cấp quyền truy cập vị trí GPS trên trình duyệt.');
      }
    );
  };

  const handleAiModelResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetAges: AgeSegmentId[] = researchAges.length > 0 ? researchAges : [selectedAge];
    const targetNeeds: MaslowNeedId[] = researchNeeds.length > 0 ? researchNeeds : [selectedNeed];
    setIsResearchingModel(true);
    setResearchFeedback('⏳ Đang phân tích thị trường Châu Á & bóc tách P&L...');
    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageSegments: targetAges,
          maslowNeeds: targetNeeds,
          priceTier: researchTier,
          customPrompt: researchCustomText,
          apiKey: geminiApiKey,
        }),
      });
      const data = await res.json();
      if (data.model) {
        setModels((prev) => [data.model, ...prev]);
        setSelectedTierFilter('all');
        setShowMultiNeedOnly(false);
        setSelectedAge(targetAges[0]);
        setSelectedNeed(targetNeeds[0]);
        setActiveModelDetail(data.model);
        setResearchFeedback(`✅ Đã tạo & lưu thành công mô hình: "${data.model.name}"! Xem chi tiết P&L ngay bên trái.`);
      } else {
        setResearchFeedback(`⚠️ Không thể tạo mô hình: ${data.error || 'Vui lòng thử lại'}`);
      }
    } catch (err) {
      console.error('AI Model research error:', err);
      setResearchFeedback('⚠️ Có lỗi kết nối khi gọi AI Research, vui lòng bấm thử lại.');
    } finally {
      setIsResearchingModel(false);
    }
  };

  // Filtered models for the currently selected cell (selectedAge x selectedNeed)
  const cellModels = useMemo(() => {
    return models.filter((m) => {
      const matchCell =
        m.ageSegments.includes(selectedAge) && m.maslowNeeds.includes(selectedNeed);
      const matchTier = selectedTierFilter === 'all' || m.priceTier === selectedTierFilter;
      const matchMulti = !showMultiNeedOnly || m.isMultiNeed;
      return matchCell && matchTier && matchMulti;
    });
  }, [models, selectedAge, selectedNeed, selectedTierFilter, showMultiNeedOnly]);

  // Count models & compute Vietnam Investment Efficiency metrics (ROI, ROA, Payback, Net Margin) in each cell of the 8x6 matrix
  const cellCounts = useMemo(() => {
    const counts: Record<
      string,
      {
        total: number;
        multi: number;
        avgNetMargin: number;
        avgRoi: number;
        avgRoa: number;
        avgPayback: number;
      }
    > = {};
    for (const age of AGE_SEGMENTS) {
      for (const need of MASLOW_NEEDS) {
        const key = `${age.id}__${need.id}`;
        const matching = models.filter(
          (m) =>
            m.ageSegments.includes(age.id) &&
            m.maslowNeeds.includes(need.id) &&
            (selectedTierFilter === 'all' || m.priceTier === selectedTierFilter) &&
            (!showMultiNeedOnly || m.isMultiNeed)
        );
        if (matching.length > 0) {
          const metricsList = matching.map((item) =>
            computeVietnamInvestmentMetrics(item.pnl, item.maslowNeeds, item.priceTier)
          );
          const avgNet = Math.round(
            matching.reduce((acc, item) => acc + item.pnl.netMarginPercent, 0) / matching.length
          );
          const avgRoi = Math.round(
            metricsList.reduce((acc, m) => acc + m.roiPercentYear, 0) / metricsList.length
          );
          const avgRoa = Math.round(
            metricsList.reduce((acc, m) => acc + m.roaPercentYear, 0) / metricsList.length
          );
          const avgPayback = Math.round(
            metricsList.reduce((acc, m) => acc + m.paybackMonthsRealistic, 0) / metricsList.length
          );
          counts[key] = {
            total: matching.length,
            multi: matching.filter((x) => x.isMultiNeed).length,
            avgNetMargin: avgNet,
            avgRoi,
            avgRoa,
            avgPayback,
          };
        } else {
          counts[key] = {
            total: 0,
            multi: 0,
            avgNetMargin: 0,
            avgRoi: 0,
            avgRoa: 0,
            avgPayback: 0,
          };
        }
      }
    }
    return counts;
  }, [models, selectedTierFilter, showMultiNeedOnly]);

  // Scored recommendations combining Area + Matrix + Ikigai
  const scoredRecommendations = useMemo(() => {
    return scoreBusinessModels(models, areaData, ikigai);
  }, [models, areaData, ikigai]);

  // Sync lead activity (scanned location & top recommended models) to CRM DB
  useEffect(() => {
    if (!currentUser?.email || !areaData?.locationName) return;
    const topNames = scoredRecommendations.slice(0, 3).map((r) => r.model.name);
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sync',
        email: currentUser.email,
        fullName: currentUser.fullName,
        phone: currentUser.phone,
        capitalBudgetMilVND: ikigai.capitalBudgetMilVND,
        scannedLocation: areaData.locationName,
        recommendedModels: topNames,
      }),
    }).catch(() => {});
  }, [currentUser?.email, currentUser?.fullName, currentUser?.phone, areaData?.locationName, ikigai.capitalBudgetMilVND, scoredRecommendations]);

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const handleUserAuthenticated = (user: LeadUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('CBA_LEAD_USER', JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
    if (user.capitalBudgetMilVND) {
      setIkigai((prev) => ({
        ...prev,
        capitalBudgetMilVND: user.capitalBudgetMilVND,
      }));
    }
    if (user.targetArea && user.targetArea.trim().length > 2) {
      const targetQ = user.targetArea.trim();
      setLocationQuery(targetQ);
      // Automatically geocode and scan the user's registered targetArea
      fetch(
        `/api/geocode?q=${encodeURIComponent(targetQ)}&gmapsKey=${encodeURIComponent(
          googleMapsApiKey
        )}&geminiKey=${encodeURIComponent(geminiApiKey)}`
      )
        .then((r) => r.json())
        .then((data) => {
          const first = data?.results?.[0];
          if (first && typeof first.lat === 'number' && typeof first.lng === 'number') {
            setLat(first.lat);
            setLng(first.lng);
            triggerAreaScan(first.lat, first.lng, radiusKm, first.name || targetQ, false);
          }
        })
        .catch(() => {});
    }
  };

  const handleLogoutLead = () => {
    setCurrentUser(null);
    localStorage.removeItem('CBA_LEAD_USER');
  };

  const handleSaveSmtpConfig = (cfg: SmtpClientConfig) => {
    setSmtpConfig(cfg);
    localStorage.setItem('CBA_SMTP_CONFIG', JSON.stringify(cfg));
  };

  if (!authChecked) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center text-sm notranslate"
        translate="no"
      >
        <span>Đang khởi tạo hệ thống tư vấn...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col notranslate" translate="no">
        <LeadAuthGate
          onAuthenticated={handleUserAuthenticated}
          onOpenAdmin={() => setShowAdminModal(true)}
          smtpConfig={smtpConfig}
        />
        <AdminLeadCrmModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          smtpConfig={smtpConfig}
          onSaveSmtpConfig={handleSaveSmtpConfig}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col notranslate" translate="no">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                  Cashflow Matrix & Ikigai Biz Advisor
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  8 Độ Tuổi × 6 Maslow × 3 Phân Khúc
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hệ thống Tư vấn Mô hình Kinh doanh Khai thác Dòng tiền • Phân tích P&L Châu Á • Định vị Bán kính 0.2-2km & Ikigai
              </p>
            </div>
          </div>

          {/* Navigation Steps */}
          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>1. Ma Trận Nhu Cầu & P&L ({models.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('location')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'location'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>2. Định Vị 0.2-2km & DB Khu Vực</span>
              {areaData && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('ikigai')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'ikigai'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>3. Ikigai & Nguồn Lực ({ikigai.capitalBudgetMilVND}Tr)</span>
            </button>

            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'advisor'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-amber-300 hover:bg-slate-800 border border-amber-500/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>4. Tư Vấn & Mô Phỏng Dòng Tiền</span>
            </button>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <LoggedInUserBar
              user={currentUser}
              onLogout={handleLogoutLead}
              onOpenAdmin={() => setShowAdminModal(true)}
            />
            <button
              onClick={() => setShowSettingsModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-300 border border-slate-800 transition"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xl:inline">API Key</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* ===================================================================
            TAB 1: MA TRẬN 2 CHIỀU (8 ĐỘ TUỔI x 6 MASLOW x 3 PHÂN KHÚC) & P&L
        =================================================================== */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            {/* Filter & Legend Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 mr-1">Lọc theo phân khúc giá:</span>
                <button
                  onClick={() => setSelectedTierFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    selectedTierFilter === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Tất cả phân khúc (3)
                </button>
                {PRICE_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTierFilter(tier.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      selectedTierFilter === tier.id
                        ? tier.badgeColor + ' ring-2 ring-white/20'
                        : 'bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-fuchsia-300 bg-fuchsia-500/10 px-3 py-1.5 rounded-lg border border-fuchsia-500/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMultiNeedOnly}
                    onChange={(e) => setShowMultiNeedOnly(e.target.checked)}
                    className="rounded accent-fuchsia-500"
                  />
                  <Layers className="w-3.5 h-3.5" />
                  Chỉ hiện Mô hình Kết hợp Đa nhu cầu (Con Cưng, BiboMart, Kids Cafe, Pet Hub...)
                </label>
              </div>
            </div>

            {/* 2D MATRIX TABLE (6 MASLOW ROWS x 8 AGE SEGMENT COLUMNS) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Grid className="w-4 h-4 text-indigo-400" />
                    Ma Trận Khai Thác Dòng Tiền: 8 Nhóm Tuổi Khách Hàng × 6 Nhu Cầu Maslow
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click vào bất kỳ ô nào trên ma trận để xem chi tiết các mô hình kinh doanh đơn lẻ, mô hình kết hợp đa nhu cầu và cấu trúc P&L chuẩn Châu Á bên dưới.
                  </p>
                </div>
                <div className="text-xs text-indigo-300 font-medium">
                  Đang chọn:{' '}
                  <strong className="text-white">
                    {AGE_SEGMENTS.find((a) => a.id === selectedAge)?.label}
                  </strong>{' '}
                  ×{' '}
                  <strong className="text-amber-300">
                    {MASLOW_NEEDS.find((n) => n.id === selectedNeed)?.label}
                  </strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800">
                      <th className="p-3 text-left text-xs font-bold text-slate-400 w-48 border-r border-slate-800">
                        Nhu cầu Maslow \ Độ tuổi KH
                      </th>
                      {AGE_SEGMENTS.map((age) => {
                        const isColSelected = age.id === selectedAge;
                        return (
                          <th
                            key={age.id}
                            onClick={() => setSelectedAge(age.id)}
                            className={`p-3 text-left cursor-pointer transition border-r border-slate-800/70 ${
                              isColSelected ? 'bg-indigo-950/60' : 'hover:bg-slate-900'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{age.label}</div>
                            <div className="text-[11px] text-indigo-400 font-medium">{age.subLabel}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {MASLOW_NEEDS.map((need) => (
                      <tr key={need.id} className="border-b border-slate-800/80">
                        {/* Row header */}
                        <td
                          onClick={() => setSelectedNeed(need.id)}
                          className={`p-3 cursor-pointer border-r border-slate-800 transition ${
                            selectedNeed === need.id ? 'bg-indigo-950/60' : 'bg-slate-950/40 hover:bg-slate-900'
                          }`}
                        >
                          <div className="text-xs font-bold text-white">{need.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{need.maslowLevel}</div>
                        </td>

                        {/* 8 Cells in Row */}
                        {AGE_SEGMENTS.map((age) => {
                          const key = `${age.id}__${need.id}`;
                          const stat = cellCounts[key] || {
                            total: 0,
                            multi: 0,
                            avgNetMargin: 0,
                            avgRoi: 0,
                            avgRoa: 0,
                            avgPayback: 0,
                          };
                          const isSelected = selectedAge === age.id && selectedNeed === need.id;
                          const areaAgeBoost = areaData?.demographics?.ageSegmentScores?.[age.id] || 0;

                          return (
                            <td
                              key={key}
                              onClick={() => {
                                setSelectedAge(age.id);
                                setSelectedNeed(need.id);
                              }}
                              className={`p-2.5 align-top cursor-pointer border-r border-slate-800/60 transition relative ${
                                isSelected
                                  ? 'bg-indigo-600/25 ring-2 ring-inset ring-indigo-400'
                                  : 'hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200">
                                  {stat.total} mô hình
                                </span>
                                {stat.multi > 0 && (
                                  <span
                                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                    title="Có mô hình kết hợp đa nhu cầu"
                                  >
                                    +{stat.multi} Đa NC
                                  </span>
                                )}
                              </div>

                              <div className="space-y-0.5 mt-1">
                                <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-between">
                                  <span>ROI: ~{stat.avgRoi}%/năm</span>
                                  <span className="text-[10px] text-cyan-300 font-semibold">
                                    ROA ~{stat.avgRoa}%
                                  </span>
                                </div>
                                <div className="text-[10px] text-amber-300 font-medium flex items-center justify-between">
                                  <span>⏱ Hoàn vốn: ~{stat.avgPayback}th</span>
                                  <span className="text-slate-400">Ròng ~{stat.avgNetMargin}%</span>
                                </div>
                              </div>

                              {/* Mini price tier dots */}
                              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                                <div className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Giá rẻ" />
                                  <span className="w-2 h-2 rounded-full bg-sky-400" title="Bình dân" />
                                  <span className="w-2 h-2 rounded-full bg-amber-400" title="Cao cấp" />
                                </div>
                                {areaAgeBoost >= 80 && (
                                  <span className="text-[10px] text-amber-300 font-semibold" title="Khu vực đang chọn có mật độ KH này rất cao">
                                    🔥 Hot ở ĐP
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SELECTED CELL DETAILS & MODELS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left 2 columns: Active P&L Simulator (on top when selected) + Models in selected cell */}
              <div className="xl:col-span-2 space-y-4">
                {activeModelDetail && (
                  <PnLSimulatorCard
                    model={activeModelDetail}
                    onClose={() => setActiveModelDetail(null)}
                  />
                )}

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                        Chi tiết Ô Ma Trận Đang Chọn
                      </div>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        Khách hàng: {AGE_SEGMENTS.find((a) => a.id === selectedAge)?.label} (
                        {AGE_SEGMENTS.find((a) => a.id === selectedAge)?.subLabel}) × Nhu cầu:{' '}
                        {MASLOW_NEEDS.find((n) => n.id === selectedNeed)?.label}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        💡 <strong>Đặc điểm người ra quyết định chi tiền:</strong>{' '}
                        {AGE_SEGMENTS.find((a) => a.id === selectedAge)?.decisionMaker} —{' '}
                        {AGE_SEGMENTS.find((a) => a.id === selectedAge)?.keyInsight}
                      </p>
                    </div>
                  </div>

                  {loadingModels ? (
                    <div className="py-12 text-center text-slate-400 text-sm">
                      Đang tải cơ sở dữ liệu mô hình kinh doanh...
                    </div>
                  ) : cellModels.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      Không có mô hình khớp bộ lọc phụ hiện tại. Hãy bấm chọn &quot;Tất cả phân khúc&quot; hoặc dùng AI Research bên phải để tạo mới.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cellModels.map((m) => {
                        const tierMeta = PRICE_TIERS.find((t) => t.id === m.priceTier);
                        const isSelectedCard = activeModelDetail?.id === m.id;
                        const inv = computeVietnamInvestmentMetrics(
                          m.pnl,
                          m.maslowNeeds,
                          m.priceTier
                        );
                        return (
                          <div
                            key={m.id}
                            onClick={() => setActiveModelDetail(m)}
                            className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                              isSelectedCard
                                ? 'bg-indigo-950/50 border-indigo-400 ring-1 ring-indigo-400'
                                : 'bg-slate-950/70 border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                {tierMeta && (
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${tierMeta.badgeColor}`}
                                  >
                                    {tierMeta.label}
                                  </span>
                                )}
                                {m.isMultiNeed ? (
                                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                                    🔗 Kết hợp Đa nhu cầu ({m.maslowNeeds.length} nhu cầu)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300">
                                    Đơn nhu cầu chuyên sâu
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-white leading-snug">{m.name}</h4>
                              <p className="text-xs text-slate-400 line-clamp-2">{m.summary}</p>

                              <div className="flex flex-wrap gap-1 pt-1">
                                {(m.exemplarsVN || []).slice(0, 3).map((ex, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700"
                                  >
                                    🇻🇳 {ex}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-4 gap-1.5 text-center">
                              <div className="bg-slate-900 p-1.5 rounded-lg">
                                <div className="text-[10px] text-slate-400">Hiệu suất ROI</div>
                                <div className="text-xs font-bold text-emerald-400">
                                  ~{inv.roiPercentYear}%/năm
                                </div>
                              </div>
                              <div className="bg-slate-900 p-1.5 rounded-lg">
                                <div className="text-[10px] text-slate-400">Hiệu suất ROA</div>
                                <div className="text-xs font-bold text-cyan-300">
                                  ~{inv.roaPercentYear}%/năm
                                </div>
                              </div>
                              <div className="bg-slate-900 p-1.5 rounded-lg">
                                <div className="text-[10px] text-slate-400">Hoàn vốn VN</div>
                                <div className="text-xs font-bold text-amber-300">
                                  ~{inv.paybackMonthsRealistic} tháng
                                </div>
                              </div>
                              <div className="bg-slate-900 p-1.5 rounded-lg">
                                <div className="text-[10px] text-slate-400">Dòng tiền ròng</div>
                                <div className="text-xs font-bold text-white">
                                  ~{inv.monthlyNetProfitMil}Tr ({m.pnl.netMarginPercent}%)
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right 1 column: AI Deep Market Research Generator (Multi-need & P&L) */}
              <div className="space-y-4">
                <div className="bg-gradient-to-b from-indigo-950/50 to-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">
                      AI Research Thị Trường & P&L Mô Hình Mới
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tự động nghiên cứu các mô hình thành công tại Việt Nam & các công ty niêm yết trên sàn chứng khoán Châu Á (Nhật, Trung, Hàn, Thái...), nội suy cấu trúc P&L và lưu bổ sung vào Database. Hỗ trợ ghép <strong>nhiều nhu cầu kết hợp</strong>!
                  </p>

                  {/* Choose 1 or multiple Age Segments */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      1. Chọn (các) Độ tuổi khách hàng muốn kết hợp:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {AGE_SEGMENTS.map((ag) => {
                        const active = researchAges.includes(ag.id);
                        return (
                          <button
                            key={ag.id}
                            type="button"
                            onClick={() => setResearchAges((prev) => toggleArrayItem(prev, ag.id))}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                              active
                                ? 'bg-indigo-600 text-white border-indigo-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {ag.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Choose 1 or multiple Maslow Needs */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      2. Chọn (các) Nhu cầu Maslow tích hợp (Chọn &ge;2 để tạo mô hình Đa nhu cầu):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {MASLOW_NEEDS.map((nd) => {
                        const active = researchNeeds.includes(nd.id);
                        return (
                          <button
                            key={nd.id}
                            type="button"
                            onClick={() => setResearchNeeds((prev) => toggleArrayItem(prev, nd.id))}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                              active
                                ? 'bg-amber-500/25 text-amber-200 border-amber-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {nd.label.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Choose Price Tier */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">3. Phân khúc định giá:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {PRICE_TIERS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setResearchTier(t.id)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition ${
                            researchTier === t.id
                              ? t.badgeColor
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {t.label.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional specific idea */}
                  <form onSubmit={handleAiModelResearch} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        4. Ý tưởng / Ngách cụ thể muốn AI đào sâu BCTC & P&L (Nhấn Enter hoặc bấm nút):
                      </label>
                      <input
                        type="text"
                        value={researchCustomText}
                        onChange={(e) => setResearchCustomText(e.target.value)}
                        placeholder="VD: Chuỗi bánh ăn dặm & sữa hạt cho bé, Trạm sạc + Cafe..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isResearchingModel}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                    >
                      {isResearchingModel ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Đang Research Thị Trường Châu Á & Bóc Tách P&L...
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4" />
                          Research & Lưu Mô Hình Vào Database
                        </>
                      )}
                    </button>

                    {researchFeedback && (
                      <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-200 font-medium leading-relaxed">
                        {researchFeedback}
                      </div>
                    )}
                  </form>
                </div>

                {/* Highlight Multi-need Exemplars */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Các Siêu Mô Hình Đa Nhu Cầu Nổi Bật
                  </h4>
                  <p className="text-xs text-slate-400">
                    Kết hợp sản phẩm phễu (mua lặp lại hàng tuần) + sản phẩm biên lãi cao để tối đa hóa vòng đời khách hàng (LTV):
                  </p>
                  <div className="space-y-2">
                    {models
                      .filter((m) => m.isMultiNeed)
                      .slice(0, 5)
                      .map((m) => (
                        <div
                          key={m.id}
                          onClick={() => setActiveModelDetail(m)}
                          className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition space-y-1"
                        >
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>{m.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                          </div>
                          <div className="text-[11px] text-fuchsia-300">
                            Ví dụ: {m.exemplarsVN.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: ĐỊNH VỊ BẢN ĐỒ (0.2KM - 2KM) & DATABASE KHU VỰC
        =================================================================== */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            {/* Top Search & Preset Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-400" />
                    Định Vị Mặt Bằng & Quét Tệp Khách Hàng Bán Kính 0.2km - 2.0km
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click trực tiếp lên bản đồ hoặc tìm địa chỉ để quét Trường học, Bệnh viện, Công viên, Chợ, Chung cư, Văn phòng và phân tích Nhân khẩu học địa phương. Kết quả tự động lưu vào <strong>SQLite Database Khu vực</strong> để tái sử dụng tức thì!
                  </p>
                </div>

                {/* Radius Slider (0.2km - 2.0km) */}
                <div className="flex items-center gap-4 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400">Bán kính quét khách hàng:</div>
                    <div className="text-sm font-bold text-indigo-300">
                      {radiusKm.toFixed(1)} km ({Math.round(radiusKm * 1000)}m)
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0.2}
                    max={2.0}
                    step={0.1}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                    className="w-36 accent-indigo-500 cursor-pointer"
                  />
                  <button
                    onClick={() => triggerAreaScan(lat, lng, radiusKm, '', false)}
                    disabled={isScanningArea}
                    className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {isScanningArea ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    Phân tích
                  </button>
                </div>
              </div>

              {/* Search Input & Preset Locations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t border-slate-800/80">
                <form onSubmit={handleGeocodeSearch} className="lg:col-span-5 flex gap-2">
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    placeholder="Nhập địa chỉ, phường, quận (VD: Cầu Giấy, Quận 1, Đà Nẵng...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingGeocode || isScanningArea}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                  >
                    {isSearchingGeocode ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    Tìm & Quét
                  </button>
                  <button
                    type="button"
                    onClick={handleUseMyGPS}
                    disabled={isScanningArea}
                    className="px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-xs font-semibold text-emerald-300 border border-emerald-500/40 transition shrink-0"
                    title="Định vị vị trí hiện tại của bạn"
                  >
                    📍 GPS
                  </button>
                </form>

                <div className="lg:col-span-7 flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-slate-400 mr-1">Khu vực mẫu:</span>
                  {PRESET_LOCATIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLat(preset.lat);
                        setLng(preset.lng);
                        triggerAreaScan(preset.lat, preset.lng, radiusKm, preset.name, false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-indigo-950/60 text-xs text-slate-300 hover:text-indigo-200 border border-slate-800 transition"
                    >
                      📍 {preset.name.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Geocode Search Dropdown Results */}
              {geocodeResults.length > 0 && (
                <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-2 space-y-1">
                  <div className="text-[11px] text-indigo-300 px-2 font-semibold">
                    Chọn kết quả định vị để quét bán kính:
                  </div>
                  {geocodeResults.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setLat(item.lat);
                        setLng(item.lng);
                        setGeocodeResults([]);
                        triggerAreaScan(item.lat, item.lng, radiusKm, item.name, false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200 flex items-center justify-between"
                    >
                      <span>📍 {item.name}</span>
                      <span className="text-[11px] text-slate-400">
                        ({item.lat.toFixed(4)}, {item.lng.toFixed(4)})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Map + Area Intelligence Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Interactive Map & Discovered POIs */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        📌 {areaData?.locationName || `Tọa độ (${lat.toFixed(4)}, ${lng.toFixed(4)})`}
                      </span>
                      {areaData?.fromCache ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <Database className="w-3 h-3" /> Đã lấy từ Database Khu vực (Cached)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                          ✨ Vừa quét mới & Đã lưu Database
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        triggerAreaScan(lat, lng, radiusKm, areaData?.locationName || '', true)
                      }
                      disabled={isScanningArea}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700 transition"
                      title="Bỏ qua cache, ép hệ thống quét lại POI và gọi AI Research mới"
                    >
                      <RefreshCw className={`w-3 h-3 ${isScanningArea ? 'animate-spin' : ''}`} />
                      Research lại khu vực này
                    </button>
                  </div>

                  {areaStatusMsg && (
                    <div className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                      {areaStatusMsg}
                    </div>
                  )}

                  <LocationMapView
                    lat={lat}
                    lng={lng}
                    radiusKm={radiusKm}
                    pois={areaData?.pois || []}
                    onSelectLocation={(newLat, newLng) => {
                      setLat(newLat);
                      setLng(newLng);
                      triggerAreaScan(newLat, newLng, radiusKm, '', false);
                    }}
                    googleMapsApiKey={googleMapsApiKey}
                    useGoogleMaps={useGoogleMaps}
                  />
                </div>

                {/* Cached Area Database History */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Database className="w-4 h-4" /> Kho Dữ Liệu Khu Vực Đã Lưu Trong SQLite Database ({cachedAreasList.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Click để tải ngay không cần đợi AI research lại
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {cachedAreasList.map((item) => (
                      <button
                        key={item.cacheKey}
                        onClick={() => {
                          setLat(item.lat);
                          setLng(item.lng);
                          setRadiusKm(item.radiusKm);
                          setAreaData({ ...item, fromCache: true });
                          setAreaStatusMsg('⚡ Truy xuất tức thì (0ms) từ SQLite Database Khu vực!');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                          areaData?.cacheKey === item.cacheKey
                            ? 'bg-indigo-950/60 border-indigo-400'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-xs font-semibold text-white truncate">
                            {item.locationName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Bán kính {item.radiusKm}km • {(item.pois || []).length} điểm POI • Dân số ~
                            {Number(item.demographics?.estimatedPopulationInRadius || 25000).toLocaleString('vi-VN')}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300 shrink-0">
                          DB Cache
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Demographic Analysis & Potential Customer Ranking */}
              <div className="lg:col-span-5 space-y-4">
                {areaData && (
                  <>
                    {/* POI Summary Counts */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-400" />
                        Hệ Sinh Thái Điểm Tụ Tập Khách Hàng Trong Bán Kính {areaData.radiusKm}km
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {(Object.keys(POI_CATEGORY_META) as POICategory[]).map((cat) => (
                          <div
                            key={cat}
                            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                          >
                            <div className="text-[11px] text-slate-400">
                              {POI_CATEGORY_META[cat].label.split(' ')[0]}
                            </div>
                            <div
                              className="text-lg font-bold mt-0.5"
                              style={{ color: POI_CATEGORY_META[cat].color }}
                            >
                              {areaData.poiCounts?.[cat] || 0} điểm
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Local Demographics & Income */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        Phân Tích Nhân Khẩu Học, Thu Nhập & Tiềm Năng Địa Phương
                      </h3>

                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-medium">
                        🏆 {areaData.demographics?.topCustomerSummary}
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-400">Mật độ & Quy mô dân số bán kính {areaData.radiusKm}km:</span>
                          <div className="font-semibold text-white mt-0.5">
                            ~{Number(areaData.demographics?.estimatedPopulationInRadius || 25000).toLocaleString('vi-VN')} cư dân —{' '}
                            {areaData.demographics?.populationDensity}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-400">Thu nhập bình quân & Sức mua:</span>
                          <div className="font-semibold text-emerald-300 mt-0.5">
                            {areaData.demographics?.avgMonthlyIncomeVND}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-400">Ngành nghề & Tầng lớp cư dân chính:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {(areaData.demographics?.dominantOccupations || []).map((occ, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px]"
                              >
                                {occ}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                          <span className="text-slate-400">Hành vi chi tiêu & Tin tức tiềm năng địa phương:</span>
                          <p className="text-slate-200 mt-1 leading-relaxed">
                            {areaData.demographics?.spendingBehavior}
                          </p>
                          <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                            {(areaData.demographics?.localNewsAndPotential || []).map((news, i) => (
                              <li key={i}>{news}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Ranking of 8 Customer Age Segments at this Location */}
                    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <h3 className="text-sm font-bold text-white">
                        Chấm Điểm Độ Dồi Dào Của 8 Tệp Khách Hàng Tại Địa Điểm Này
                      </h3>
                      <div className="space-y-2">
                        {AGE_SEGMENTS.map((seg) => {
                          const score = areaData.demographics?.ageSegmentScores?.[seg.id] || 60;
                          return (
                            <div key={seg.id} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-200 font-medium">
                                  {seg.label} <span className="text-slate-400">({seg.subLabel})</span>
                                </span>
                                <span className="font-bold text-indigo-300">{score}/100</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  style={{ width: `${score}%` }}
                                  className={`h-full rounded-full ${
                                    score >= 82
                                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                      : score >= 70
                                      ? 'bg-indigo-500'
                                      : 'bg-slate-500'
                                  }`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex justify-end">
                        <button
                          onClick={() => setActiveTab('ikigai')}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          Tiếp tục Bước 3: Ghép Ikigai & Nguồn Lực <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 3: IKIGAI NHẬT BẢN & NGUỒN LỰC CÁ NHÂN
        =================================================================== */}
        {activeTab === 'ikigai' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    Ma Trận IKIGAI Nhật Bản & Hồ Sơ Nguồn Lực Chủ Đầu Tư
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Chọn những gì bạn yêu thích, sở trường mạnh nhất, cùng nguồn lực Tài chính, Công nghệ, Mối quan hệ và Mục tiêu dòng tiền để thuật toán khớp với nhu cầu tại{' '}
                    <strong className="text-indigo-300">
                      {areaData?.locationName || 'khu vực bạn chọn'}
                    </strong>
                    .
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('advisor')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4" /> Xem Kết Quả Tư Vấn Mô Hình Kinh Doanh
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. PASSION (What you LOVE) */}
                <div className="p-5 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                    <span>❤️ 1. Đam Mê Của Bạn (What You LOVE)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Lĩnh vực bạn có hứng thú làm việc mỗi ngày mà không thấy chán:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {IKIGAI_OPTIONS.passions.map((item) => {
                      const active = ikigai.passions.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setIkigai((prev) => ({
                              ...prev,
                              passions: toggleArrayItem(prev.passions, item.id),
                            }))
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                            active
                              ? 'bg-rose-500/20 text-rose-200 border-rose-400 shadow-sm'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. SKILLS (What you are GOOD AT) */}
                <div className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                    <span>🏆 2. Cái Bạn Giỏi Nhất (What You Are GOOD AT)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Năng lực cốt lõi giúp bạn vận hành vượt trội hơn đối thủ cùng khu vực:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {IKIGAI_OPTIONS.skills.map((item) => {
                      const active = ikigai.strongestSkills.includes(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setIkigai((prev) => ({
                              ...prev,
                              strongestSkills: toggleArrayItem(prev.strongestSkills, item.id),
                            }))
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                            active
                              ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400 shadow-sm'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. FINANCIAL & TECH RESOURCES */}
                <div className="p-5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <Wallet className="w-4 h-4" />
                    <span>3. Nguồn Lực Tài Chính & Công Nghệ Hiện Có</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300">Tổng vốn đầu tư sẵn sàng (CAPEX + Dự phòng):</span>
                      <span className="text-base font-bold text-emerald-400">
                        {ikigai.capitalBudgetMilVND.toLocaleString('vi-VN')} Triệu VNĐ
                      </span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={2500}
                      step={25}
                      value={ikigai.capitalBudgetMilVND}
                      onChange={(e) =>
                        setIkigai((prev) => ({
                          ...prev,
                          capitalBudgetMilVND: Number(e.target.value),
                        }))
                      }
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>50 Triệu (Khởi nghiệp nhỏ/Kiosk)</span>
                      <span>500 Triệu (Cửa hàng chuẩn)</span>
                      <span>2,5 Tỷ+ (Tổ hợp lớn/Chuỗi)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Năng lực áp dụng Công nghệ & Quản trị số:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'basic', label: 'Cơ bản / Truyền thống' },
                        { id: 'moderate', label: 'Khá (POS, CRM, Zalo OA)' },
                        { id: 'advanced', label: 'Mạnh (AI, Tự động hóa, App)' },
                      ].map((lv) => (
                        <button
                          key={lv.id}
                          type="button"
                          onClick={() =>
                            setIkigai((prev) => ({
                              ...prev,
                              techCapability: lv.id as 'basic' | 'moderate' | 'advanced',
                            }))
                          }
                          className={`p-2 rounded-lg text-xs font-medium border transition ${
                            ikigai.techCapability === lv.id
                              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {lv.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. NETWORKS & GOALS */}
                <div className="p-5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-4">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Handshake className="w-4 h-4" />
                    <span>4. Đối Tác, Mối Quan Hệ & Mục Tiêu Dòng Tiền</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs text-slate-300">Lợi thế quan hệ / đối tác sẵn có:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {IKIGAI_OPTIONS.networks.map((net) => {
                        const active = ikigai.networks.includes(net.id);
                        return (
                          <button
                            key={net.id}
                            type="button"
                            onClick={() =>
                              setIkigai((prev) => ({
                                ...prev,
                                networks: toggleArrayItem(prev.networks, net.id),
                              }))
                            }
                            className={`px-2.5 py-1.5 rounded-lg text-xs border transition text-left ${
                              active
                                ? 'bg-amber-500/20 text-amber-200 border-amber-400'
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                          >
                            {active ? '✓ ' : '+ '}
                            {net.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-amber-400" /> Mục tiêu ưu tiên hàng đầu của bạn:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {IKIGAI_OPTIONS.goals.map((g) => {
                        const active = ikigai.primaryGoals.includes(g.id);
                        return (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() =>
                              setIkigai((prev) => ({
                                ...prev,
                                primaryGoals: toggleArrayItem(prev.primaryGoals, g.id),
                              }))
                            }
                            className={`p-2.5 rounded-xl border text-left transition ${
                              active
                                ? 'bg-indigo-600/25 border-indigo-400 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <div className="text-xs font-bold">{g.label}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{g.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: TƯ VẤN MÔ HÌNH TỐI ƯU & BÁO CÁO P&L / DÒNG TIỀN
        =================================================================== */}
        {activeTab === 'advisor' && (
          <div className="space-y-6">
            {/* PDF Export & Email Delivery Banner */}
            <EmailPdfActionCard
              currentUser={currentUser}
              areaRecord={areaData}
              ikigai={ikigai}
              recommendations={scoredRecommendations}
              smtpConfig={smtpConfig}
            />

            {/* Summary Context Banner */}
            <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-amber-950/40 border border-indigo-500/40 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-4 h-4" /> Kết Quả Tư Vấn Giao Thoa 3 Trục (Địa Phương × Ma Trận P&L × Ikigai)
                </div>
                <h2 className="text-lg md:text-xl font-bold text-white">
                  Top Mô Hình Kinh Doanh Khai Thác Dòng Tiền Phù Hợp Nhất Với Bạn
                </h2>
                <p className="text-xs text-slate-300">
                  📍 <strong>Khu vực mục tiêu:</strong>{' '}
                  {areaData?.locationName || 'Chưa chọn (đang dùng mặc định)'} (Bán kính {radiusKm}km •{' '}
                  {areaData?.pois?.length || 0} điểm POI) &nbsp;|&nbsp; 💰 <strong>Ngân sách vốn:</strong>{' '}
                  {ikigai.capitalBudgetMilVND} Triệu VNĐ
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('location')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                >
                  Đổi vị trí bản đồ
                </button>
                <button
                  onClick={() => setActiveTab('ikigai')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
                >
                  Chỉnh sửa Ikigai & Vốn
                </button>
              </div>
            </div>

            {/* Top Recommendations List */}
            <div className="space-y-5">
              {scoredRecommendations.slice(0, 8).map((rec, index) => {
                const { model } = rec;
                const tierMeta = PRICE_TIERS.find((t) => t.id === model.priceTier);
                const isExpanded =
                  activeModelDetail?.id === model.id || (index === 0 && !activeModelDetail);

                return (
                  <div
                    key={model.id}
                    className={`rounded-2xl border transition overflow-hidden ${
                      index === 0
                        ? 'bg-slate-900/95 border-amber-500/60 shadow-xl shadow-amber-500/5'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              index === 0
                                ? 'bg-amber-400 text-slate-950'
                                : index === 1
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800 text-slate-200'
                            }`}
                          >
                            #{index + 1} Đề xuất ({rec.totalScore}% Độ khớp)
                          </span>
                          {model.isMultiNeed && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                              🔗 Mô hình Đa Nhu Cầu ({model.maslowNeeds.length} nhu cầu)
                            </span>
                          )}
                          {tierMeta && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tierMeta.badgeColor}`}
                            >
                              {tierMeta.label}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-white">{model.name}</h3>
                        <p className="text-xs text-slate-300">{model.tagline}</p>

                        {/* Match reasons */}
                        <div className="space-y-1 pt-1">
                          {rec.matchReasons.map((reason, rIdx) => (
                            <div
                              key={rIdx}
                              className="flex items-start gap-1.5 text-xs text-emerald-300"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </div>
                          ))}
                          {rec.warnings.map((warn, wIdx) => (
                            <div
                              key={wIdx}
                              className="flex items-start gap-1.5 text-xs text-amber-300"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{warn}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3 Score Breakdown & Key P&L Metrics */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Địa điểm</div>
                            <div className="text-sm font-bold text-cyan-300">{rec.locationScore}%</div>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Ikigai</div>
                            <div className="text-sm font-bold text-rose-300">{rec.ikigaiScore}%</div>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-[10px] text-slate-400">Nguồn lực</div>
                            <div className="text-sm font-bold text-emerald-300">{rec.resourceScore}%</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {(() => {
                            const inv = computeVietnamInvestmentMetrics(
                              model.pnl,
                              model.maslowNeeds,
                              model.priceTier
                            );
                            return (
                              <div className="text-right text-xs space-y-0.5">
                                <div className="text-slate-300 font-semibold">
                                  ROI:{' '}
                                  <strong className="text-emerald-400">
                                    ~{inv.roiPercentYear}%/năm
                                  </strong>{' '}
                                  • ROA:{' '}
                                  <strong className="text-cyan-300">
                                    ~{inv.roaPercentYear}%/năm
                                  </strong>
                                </div>
                                <div className="text-slate-400">
                                  Hoàn vốn VN:{' '}
                                  <strong className="text-amber-300">
                                    ~{inv.paybackMonthsRealistic} tháng ({inv.paybackRangeText})
                                  </strong>
                                </div>
                                <div className="text-slate-400">
                                  Vốn CAPEX:{' '}
                                  <strong className="text-slate-200">
                                    {model.pnl.initialCapexMinVND}-{model.pnl.initialCapexMaxVND} Tr
                                  </strong>{' '}
                                  • Dòng tiền ròng:{' '}
                                  <strong className="text-emerald-300">
                                    ~{inv.monthlyNetProfitMil} Tr/th ({model.pnl.netMarginPercent}%)
                                  </strong>
                                </div>
                              </div>
                            );
                          })()}

                          <button
                            onClick={() =>
                              setActiveModelDetail(
                                activeModelDetail?.id === model.id ? null : model
                              )
                            }
                            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                          >
                            {isExpanded ? 'Thu gọn P&L' : 'Mô phỏng P&L & Kế hoạch'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action Plan & Interactive P&L Simulator when expanded */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4">
                        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                            <Award className="w-4 h-4" /> Lộ Trình Triển Khai Thực Chiến Tại {areaData?.locationName || 'Địa Phương'}
                          </h4>
                          <div className="space-y-1.5 text-xs text-slate-200">
                            {rec.actionPlan.map((step, sIdx) => (
                              <div key={sIdx} className="leading-relaxed">
                                {step}
                              </div>
                            ))}
                          </div>
                        </div>

                        <PnLSimulatorCard model={model} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL FOR OPTIONAL API KEYS */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-400" /> Cấu hình Gemini AI & Bản Đồ (Tùy chọn)
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Đóng ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Hệ thống đã tích hợp sẵn <strong>OpenStreetMap + Overpass POI Scanner</strong> và <strong>Kho dữ liệu P&L Châu Á trong SQLite Database</strong> nên hoạt động đầy đủ 100% ngay lập tức mà không bắt buộc nhập Key. Nếu bạn muốn kích hoạt thêm <strong>Gemini Google Search Grounding trực tiếp</strong> hoặc <strong>Google Maps SDK</strong>, hãy nhập Key bên dưới:
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">
                  1. Gemini API Key (`gemini-3.8-flash` + Google Search Grounding):
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy... (Từ Google AI Studio)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-200">
                  2. Google Maps Platform API Key / Demo Key (Tùy chọn):
                </label>
                <input
                  type="password"
                  value={googleMapsApiKey}
                  onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                  placeholder="AIzaSy... (Để trống để dùng OpenStreetMap miễn phí)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer text-slate-200">
                <input
                  type="checkbox"
                  checked={useGoogleMaps}
                  onChange={(e) => setUseGoogleMaps(e.target.checked)}
                  className="rounded accent-indigo-500"
                />
                <span>Sử dụng giao diện `@vis.gl/react-google-maps` khi có Google Maps API Key</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  localStorage.setItem('CBA_GEMINI_KEY', geminiApiKey);
                  localStorage.setItem('CBA_GMAPS_KEY', googleMapsApiKey);
                  setShowSettingsModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN LEAD CRM MODAL */}
      <AdminLeadCrmModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        smtpConfig={smtpConfig}
        onSaveSmtpConfig={handleSaveSmtpConfig}
      />

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 lg:px-8 py-4 text-[11px] text-slate-500">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Cashflow Matrix & Ikigai Business Advisor • Cơ sở dữ liệu SQLite lưu trữ tự động tại `data/cashflow_advisor.sqlite`
          </div>
          <div>
            Dữ liệu P&L tham chiếu từ BCTC các doanh nghiệp niêm yết Châu Á (TSE, HKEX, KOSPI, SGX) & Báo cáo thị trường Việt Nam.
          </div>
        </div>
      </footer>
    </div>
  );
}
