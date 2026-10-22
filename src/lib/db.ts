import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { DatabaseSync } from 'node:sqlite';
import { BusinessModel, AreaIntelligenceRecord } from '@/types/business';
import { buildCompleteSeedCatalog } from '@/data/seed-models';

function resolveDbPath(): string {
  if (process.env.SQLITE_DB_PATH) {
    return process.env.SQLITE_DB_PATH;
  }
  const preferredDir = process.env.SQLITE_DB_DIR || path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(preferredDir)) {
      fs.mkdirSync(preferredDir, { recursive: true });
    }
    fs.accessSync(preferredDir, fs.constants.W_OK);
    return path.join(preferredDir, 'cashflow_advisor.sqlite');
  } catch {
    // Fallback cho môi trường Serverless (như Vercel) chỉ cho phép ghi vào /tmp
    const tmpDir = path.join(os.tmpdir(), 'cashflow-biz-advisor');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    return path.join(tmpDir, 'cashflow_advisor.sqlite');
  }
}

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dbPath = resolveDbPath();
  const db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS business_models (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_multi_need INTEGER NOT NULL DEFAULT 0,
      price_tier TEXT NOT NULL,
      age_segments_json TEXT NOT NULL,
      maslow_needs_json TEXT NOT NULL,
      payload_json TEXT NOT NULL,
      source_type TEXT NOT NULL DEFAULT 'curated',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS area_cache (
      cache_key TEXT PRIMARY KEY,
      location_name TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      radius_km REAL NOT NULL,
      data_source TEXT NOT NULL DEFAULT 'osm_overpass',
      payload_json TEXT NOT NULL,
      cached_at TEXT NOT NULL
    );
  `);

  // Seed initial business models if empty
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM business_models').get() as { cnt: number };
  if (!countRow || countRow.cnt === 0) {
    const seedModels = buildCompleteSeedCatalog();
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO business_models (
        id, name, is_multi_need, price_tier, age_segments_json, maslow_needs_json, payload_json, source_type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    for (const model of seedModels) {
      insertStmt.run(
        model.id,
        model.name,
        model.isMultiNeed ? 1 : 0,
        model.priceTier,
        JSON.stringify(model.ageSegments),
        JSON.stringify(model.maslowNeeds),
        JSON.stringify(model),
        model.sourceType || 'curated',
        now
      );
    }
  }

  dbInstance = db;
  return db;
}

export function getAllBusinessModelsFromDb(): BusinessModel[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT payload_json, source_type, created_at FROM business_models ORDER BY is_multi_need DESC, created_at DESC')
    .all() as { payload_json: string; source_type: string; created_at: string }[];

  return rows.map((r) => {
    const parsed = JSON.parse(r.payload_json) as BusinessModel;
    parsed.sourceType = (r.source_type as 'curated' | 'ai_researched') || 'curated';
    parsed.createdAt = r.created_at;
    return parsed;
  });
}

export function saveBusinessModelToDb(model: BusinessModel): void {
  const db = getDb();
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO business_models (
      id, name, is_multi_need, price_tier, age_segments_json, maslow_needs_json, payload_json, source_type, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    model.id,
    model.name,
    model.isMultiNeed ? 1 : 0,
    model.priceTier,
    JSON.stringify(model.ageSegments),
    JSON.stringify(model.maslowNeeds),
    JSON.stringify({ ...model, createdAt: now }),
    model.sourceType || 'ai_researched',
    now
  );
}

export function buildAreaCacheKey(lat: number, lng: number, radiusKm: number): string {
  // Làm tròn tọa độ đến 3 chữ số thập phân (~110m) để gom nhóm các lần tìm kiếm gần nhau
  const rLat = Math.round(lat * 250) / 250;
  const rLng = Math.round(lng * 250) / 250;
  const rRad = Math.round(radiusKm * 10) / 10;
  return `area_${rLat.toFixed(3)}_${rLng.toFixed(3)}_${rRad.toFixed(1)}km`;
}

export function findCachedAreaInDb(lat: number, lng: number, radiusKm: number): AreaIntelligenceRecord | null {
  const db = getDb();
  const exactKey = buildAreaCacheKey(lat, lng, radiusKm);
  let row = db
    .prepare('SELECT payload_json, data_source, cached_at FROM area_cache WHERE cache_key = ?')
    .get(exactKey) as { payload_json: string; data_source: string; cached_at: string } | undefined;

  if (!row) {
    // Tìm kiếm lân cận trong khoảng ~350m (0.0035 độ) và cùng bán kính (+/- 0.2km)
    row = db
      .prepare(
        `SELECT payload_json, data_source, cached_at FROM area_cache
         WHERE ABS(lat - ?) <= 0.0035 AND ABS(lng - ?) <= 0.0035 AND ABS(radius_km - ?) <= 0.2
         ORDER BY cached_at DESC LIMIT 1`
      )
      .get(lat, lng, radiusKm) as { payload_json: string; data_source: string; cached_at: string } | undefined;
  }

  if (!row) return null;

  // Nếu nguồn dữ liệu từ Google Places, tuân thủ giới hạn cache tối đa 30 ngày của Google Maps Platform ToS
  if (row.data_source === 'google_places') {
    const ageDays = (Date.now() - new Date(row.cached_at).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > 30) {
      return null;
    }
  }

  const record = JSON.parse(row.payload_json) as AreaIntelligenceRecord;
  record.fromCache = true;
  return record;
}

export function saveAreaToDb(record: AreaIntelligenceRecord): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO area_cache (
      cache_key, location_name, lat, lng, radius_km, data_source, payload_json, cached_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    record.cacheKey,
    record.locationName,
    record.lat,
    record.lng,
    record.radiusKm,
    record.dataSource,
    JSON.stringify(record),
    record.cachedAt
  );
}

export function listCachedAreasFromDb(): AreaIntelligenceRecord[] {
  const db = getDb();
  const rows = db
    .prepare('SELECT payload_json FROM area_cache ORDER BY cached_at DESC LIMIT 30')
    .all() as { payload_json: string }[];
  return rows.map((r) => {
    const rec = JSON.parse(r.payload_json) as AreaIntelligenceRecord;
    rec.fromCache = true;
    return rec;
  });
}
