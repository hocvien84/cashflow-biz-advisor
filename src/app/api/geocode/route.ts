import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        q
      )}&countrycodes=vn&limit=5&accept-language=vi`,
      {
        headers: { 'User-Agent': 'CashflowBizAdvisor/1.0 (Vietnam Business Matrix Advisor)' },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) throw new Error('Geocode failed');
    const data = await res.json();
    const results = (data || []).map((item: { display_name: string; lat: string; lon: string }) => ({
      name: item.display_name.split(',').slice(0, 4).join(', '),
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
