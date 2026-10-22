import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Danh mục tọa độ chuẩn các quận/thành phố lớn tại Việt Nam để đảm bảo luôn định vị tức thì kể cả khi mạng quốc tế nghẽn
const VN_GAZETTEER: { keywords: string[]; name: string; lat: number; lng: number }[] = [
  { keywords: ['hoàn kiếm', 'phố cổ', 'hồ gươm'], name: 'Quận Hoàn Kiếm, Hà Nội', lat: 21.0285, lng: 105.8542 },
  { keywords: ['ba đình', 'lăng bác', 'đội cấn', 'kim mã'], name: 'Quận Ba Đình, Hà Nội', lat: 21.0341, lng: 105.8262 },
  { keywords: ['đống đa', 'chùa bộc', 'thái hà', 'láng hạ', 'xã đàn'], name: 'Quận Đống Đa, Hà Nội', lat: 21.0146, lng: 105.8235 },
  { keywords: ['hai bà trưng', 'bách khoa', 'minh khai', 'bà triệu', 'times city'], name: 'Quận Hai Bà Trưng, Hà Nội', lat: 21.0058, lng: 105.8575 },
  { keywords: ['cầu giấy', 'xuân thủy', 'dịch vọng', 'trung hòa', 'duy tân'], name: 'Quận Cầu Giấy, Hà Nội', lat: 21.0338, lng: 105.7944 },
  { keywords: ['thanh xuân', 'nguyễn trãi', 'royal city', 'nhân chính'], name: 'Quận Thanh Xuân, Hà Nội', lat: 20.9948, lng: 105.8047 },
  { keywords: ['tây hồ', 'hồ tây', 'xuân diệu', 'lạc long quân'], name: 'Quận Tây Hồ, Hà Nội', lat: 21.0686, lng: 105.8211 },
  { keywords: ['hoàng mai', 'linh đàm', 'định công', 'giáp bát'], name: 'Quận Hoàng Mai, Hà Nội', lat: 20.9714, lng: 105.8471 },
  { keywords: ['long biên', 'gia lâm', 'ocean park', 'ngọc thụy'], name: 'Quận Long Biên / Gia Lâm, Hà Nội', lat: 21.0451, lng: 105.8882 },
  { keywords: ['nam từ liêm', 'mỹ đình', 'tây mỗ', 'mễ trì', 'smart city'], name: 'Quận Nam Từ Liêm, Hà Nội', lat: 21.0181, lng: 105.7647 },
  { keywords: ['bắc từ liêm', 'cổ nhuế', 'ngoại giao đoàn'], name: 'Quận Bắc Từ Liêm, Hà Nội', lat: 21.0667, lng: 105.7725 },
  { keywords: ['hà đông', 'văn quán', 'mỗ lao', 'dương nội'], name: 'Quận Hà Đông, Hà Nội', lat: 20.9718, lng: 105.7765 },
  { keywords: ['quận 1', 'bến nghé', 'bến thành', 'nguyễn huệ'], name: 'Quận 1, TP. Hồ Chí Minh', lat: 10.7769, lng: 106.7009 },
  { keywords: ['quận 3', 'võ văn tần', 'nguyễn thị minh khai'], name: 'Quận 3, TP. Hồ Chí Minh', lat: 10.7829, lng: 106.6868 },
  { keywords: ['quận 4', 'khánh hội', 'bến vân đồn'], name: 'Quận 4, TP. Hồ Chí Minh', lat: 10.7578, lng: 106.7013 },
  { keywords: ['quận 5', 'chợ lớn', 'nguyễn trãi q5', 'an đông'], name: 'Quận 5, TP. Hồ Chí Minh', lat: 10.754, lng: 106.6634 },
  { keywords: ['quận 7', 'phú mỹ hưng', 'tân phong', 'nguyễn thị thập'], name: 'Quận 7, TP. Hồ Chí Minh', lat: 10.7324, lng: 106.7213 },
  { keywords: ['quận 10', 'sư vạn hạnh', 'bà hạt', 'thành thái'], name: 'Quận 10, TP. Hồ Chí Minh', lat: 10.7726, lng: 106.6678 },
  { keywords: ['bình thạnh', 'landmark 81', 'vinhomes central park', 'điện biên phủ', 'xô viết nghệ tĩnh'], name: 'Quận Bình Thạnh, TP. Hồ Chí Minh', lat: 10.8033, lng: 106.7114 },
  { keywords: ['phú nhuận', 'phan xích long', 'nguyễn văn trỗi'], name: 'Quận Phú Nhuận, TP. Hồ Chí Minh', lat: 10.7992, lng: 106.6803 },
  { keywords: ['tân bình', 'cộng hòa', 'sân bay tân sơn nhất', 'bàu cát'], name: 'Quận Tân Bình, TP. Hồ Chí Minh', lat: 10.8015, lng: 106.6526 },
  { keywords: ['gò vấp', 'quang trung', 'phan văn trị', 'cityland'], name: 'Quận Gò Vấp, TP. Hồ Chí Minh', lat: 10.8387, lng: 106.6653 },
  { keywords: ['thủ đức', 'thảo điền', 'an phú', 'vạn phúc', 'làng đại học'], name: 'TP. Thủ Đức, TP. Hồ Chí Minh', lat: 10.8245, lng: 106.7528 },
  { keywords: ['bình tân', 'aeon bình tân', 'tên lửa'], name: 'Quận Bình Tân, TP. Hồ Chí Minh', lat: 10.7653, lng: 106.6038 },
  { keywords: ['tân phú', 'aeon tân phú', 'lũy bán bích'], name: 'Quận Tân Phú, TP. Hồ Chí Minh', lat: 10.7905, lng: 106.6281 },
  { keywords: ['đà nẵng', 'hải châu', 'sơn trà', 'ngũ hành sơn', 'thanh khê'], name: 'Trung tâm TP. Đà Nẵng', lat: 16.0678, lng: 108.2208 },
  { keywords: ['hải phòng', 'lê chân', 'ngô quyền', 'hồng bàng'], name: 'Trung tâm TP. Hải Phòng', lat: 20.8449, lng: 106.6881 },
  { keywords: ['cần thơ', 'ninh kiều'], name: 'Quận Ninh Kiều, TP. Cần Thơ', lat: 10.0342, lng: 105.7875 },
  { keywords: ['nha trang', 'khánh hòa'], name: 'TP. Nha Trang, Khánh Hòa', lat: 12.2388, lng: 109.1967 },
  { keywords: ['đà lạt', 'lâm đồng'], name: 'TP. Đà Lạt, Lâm Đồng', lat: 11.9404, lng: 108.4583 },
  { keywords: ['vũng tàu', 'bà rịa'], name: 'TP. Vũng Tàu', lat: 10.346, lng: 107.0843 },
  { keywords: ['biên hòa', 'đồng nai'], name: 'TP. Biên Hòa, Đồng Nai', lat: 10.9574, lng: 106.8427 },
  { keywords: ['bình dương', 'thủ dầu một', 'dĩ an', 'thuận an'], name: 'TP. Thủ Dầu Một / Dĩ An, Bình Dương', lat: 10.9804, lng: 106.6519 },
  { keywords: ['hạ long', 'quảng ninh'], name: 'TP. Hạ Long, Quảng Ninh', lat: 20.9599, lng: 107.0425 },
  { keywords: ['huế', 'thừa thiên huế'], name: 'TP. Huế', lat: 16.4637, lng: 107.5909 },
  { keywords: ['vinh', 'nghệ an'], name: 'TP. Vinh, Nghệ An', lat: 18.6796, lng: 105.6813 },
  { keywords: ['thanh hóa'], name: 'TP. Thanh Hóa', lat: 19.8067, lng: 105.7852 },
  { keywords: ['bắc ninh'], name: 'TP. Bắc Ninh', lat: 21.1861, lng: 106.0763 },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const gmapsKey = (searchParams.get('gmapsKey') || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '').trim();
  const geminiKey = (searchParams.get('geminiKey') || process.env.GEMINI_API_KEY || '').trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results: { name: string; lat: number; lng: number; source?: string }[] = [];

  // 1. Nếu có Google Maps API Key -> thử gọi Google Geocoding API và Places API (New) Text Search
  if (gmapsKey) {
    try {
      const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        q + ', Việt Nam'
      )}&language=vi&region=vn&key=${encodeURIComponent(gmapsKey)}`;
      const res = await fetch(geoUrl, { signal: AbortSignal.timeout(4500) });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'OK' && Array.isArray(data.results)) {
          for (const item of data.results.slice(0, 5)) {
            if (item.geometry?.location) {
              results.push({
                name: item.formatted_address,
                lat: Number(item.geometry.location.lat),
                lng: Number(item.geometry.location.lng),
                source: 'google_geocoding',
              });
            }
          }
        }
      }
    } catch {
      // ignore and fallback
    }

    if (results.length === 0) {
      try {
        const placesRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': gmapsKey,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
          },
          body: JSON.stringify({
            textQuery: q + ', Việt Nam',
            languageCode: 'vi',
            regionCode: 'VN',
          }),
          signal: AbortSignal.timeout(4500),
        });
        if (placesRes.ok) {
          const pData = await placesRes.json();
          if (Array.isArray(pData.places)) {
            for (const pl of pData.places.slice(0, 5)) {
              if (pl.location) {
                results.push({
                  name: `${pl.displayName?.text || ''} - ${pl.formattedAddress || ''}`.replace(/^ - /, ''),
                  lat: Number(pl.location.latitude),
                  lng: Number(pl.location.longitude),
                  source: 'google_places_new',
                });
              }
            }
          }
        }
      } catch {
        // ignore and fallback
      }
    }
  }

  // 2. Thử Photon Komoot (OpenStreetMap Cloud Search - Không chặn IP Vercel)
  if (results.length === 0) {
    try {
      const photonRes = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(q + ' Vietnam')}&limit=5`,
        { signal: AbortSignal.timeout(4500) }
      );
      if (photonRes.ok) {
        const pJson = await photonRes.json();
        if (Array.isArray(pJson.features)) {
          for (const f of pJson.features) {
            const coords = f.geometry?.coordinates;
            const props = f.properties || {};
            if (Array.isArray(coords) && coords.length >= 2) {
              const labelParts = [props.name, props.street, props.district, props.city, props.state].filter(Boolean);
              results.push({
                name: labelParts.length > 0 ? labelParts.join(', ') : q,
                lat: Number(coords[1]),
                lng: Number(coords[0]),
                source: 'osm_photon',
              });
            }
          }
        }
      }
    } catch {
      // ignore and fallback
    }
  }

  // 3. Thử Nominatim OpenStreetMap
  if (results.length === 0) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
          q
        )}&countrycodes=vn&limit=5&accept-language=vi`,
        {
          headers: { 'User-Agent': 'CashflowBizAdvisor/1.1 (https://cashflow-biz-advisor.vercel.app)' },
          signal: AbortSignal.timeout(4500),
        }
      );
      if (res.ok) {
        const data = await res.json();
        for (const item of data || []) {
          results.push({
            name: item.display_name.split(',').slice(0, 4).join(', '),
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            source: 'osm_nominatim',
          });
        }
      }
    } catch {
      // ignore and fallback
    }
  }

  // 4. Tra cứu trong Gazetteer nội địa Việt Nam
  if (results.length === 0) {
    const qLower = q.toLowerCase();
    for (const entry of VN_GAZETTEER) {
      if (entry.keywords.some((kw) => qLower.includes(kw)) || entry.name.toLowerCase().includes(qLower)) {
        results.push({
          name: `${q} (${entry.name})`,
          lat: entry.lat,
          lng: entry.lng,
          source: 'vn_gazetteer',
        });
      }
    }
  }

  // 5. Nếu có Gemini API Key -> dùng Gemini để định vị chính xác tọa độ địa điểm tại Việt Nam
  if (results.length === 0 && geminiKey) {
    try {
      const client = new GoogleGenAI({ apiKey: geminiKey });
      const interaction = await client.interactions.create({
        model: 'gemini-3.8-flash',
        input: `Cho biết tọa độ vĩ độ (lat) và kinh độ (lng) chính xác của địa điểm sau tại Việt Nam: "${q}".`,
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              lat: { type: 'number' },
              lng: { type: 'number' },
            },
            required: ['name', 'lat', 'lng'],
          },
        },
      });
      if (interaction.output_text) {
        const parsed = JSON.parse(interaction.output_text);
        if (parsed.lat && parsed.lng) {
          results.push({
            name: parsed.name || q,
            lat: parsed.lat,
            lng: parsed.lng,
            source: 'gemini_ai',
          });
        }
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ results });
}
