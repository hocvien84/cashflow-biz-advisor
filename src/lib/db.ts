import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { BusinessModel, AreaIntelligenceRecord } from '@/types/business';
import { buildCompleteSeedCatalog } from '@/data/seed-models';

// In-memory fallback store (used if host runs Node < 22.5 without node:sqlite or read-only FS)
let memoryModels: BusinessModel[] | null = null;
let memoryAreas: Map<string, AreaIntelligenceRecord> | null = null;

function getStorageDir(): string {
  const defaultDir = path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(/*turbopackIgnore: true*/ defaultDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ defaultDir, { recursive: true });
    }
    fs.accessSync(/*turbopackIgnore: true*/ defaultDir, fs.constants.W_OK);
    return defaultDir;
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'cashflow-biz-advisor');
    if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDir)) {
      fs.mkdirSync(/*turbopackIgnore: true*/ tmpDir, { recursive: true });
    }
    return tmpDir;
  }
}

interface SqliteDbLike {
  exec(sql: string): void;
  prepare(sql: string): {
    run(...params: unknown[]): unknown;
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  };
}

let dbInstance: SqliteDbLike | null = null;
let sqliteChecked = false;

export function getDb(): SqliteDbLike | null {
  if (sqliteChecked) return dbInstance;
  sqliteChecked = true;

  try {
    // Dynamic require so environments running Node 20 (e.g. default Vercel) smoothly fallback
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sqliteMod = require('node:sqlite');
    const DatabaseSync = sqliteMod.DatabaseSync;
    const dir = getStorageDir();
    const dbPath = path.join(dir, 'cashflow_advisor.sqlite');
    const db: SqliteDbLike = new DatabaseSync(dbPath);

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

    const countRow = db.prepare('SELECT COUNT(*) as cnt FROM business_models').get() as {
      cnt: number;
    };
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
    return dbInstance;
  } catch {
    // Initialize fallback memory store
    memoryModels = buildCompleteSeedCatalog();
    memoryAreas = new Map<string, AreaIntelligenceRecord>();
    return null;
  }
}

export function getAllBusinessModelsFromDb(): BusinessModel[] {
  const db = getDb();
  if (!db) {
    if (!memoryModels) memoryModels = buildCompleteSeedCatalog();
    return memoryModels;
  }

  const rows = db
    .prepare(
      'SELECT payload_json, source_type, created_at FROM business_models ORDER BY is_multi_need DESC, created_at DESC'
    )
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
  if (!db) {
    if (!memoryModels) memoryModels = buildCompleteSeedCatalog();
    memoryModels = [{ ...model, createdAt: now }, ...memoryModels];
    return;
  }

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
  const rLat = Math.round(lat * 250) / 250;
  const rLng = Math.round(lng * 250) / 250;
  const rRad = Math.round(radiusKm * 10) / 10;
  return `area_${rLat.toFixed(3)}_${rLng.toFixed(3)}_${rRad.toFixed(1)}km`;
}

export function findCachedAreaInDb(
  lat: number,
  lng: number,
  radiusKm: number
): AreaIntelligenceRecord | null {
  const db = getDb();
  const exactKey = buildAreaCacheKey(lat, lng, radiusKm);

  if (!db) {
    if (!memoryAreas) return null;
    const hit = memoryAreas.get(exactKey);
    return hit ? { ...hit, fromCache: true } : null;
  }

  let row = db
    .prepare('SELECT payload_json, data_source, cached_at FROM area_cache WHERE cache_key = ?')
    .get(exactKey) as { payload_json: string; data_source: string; cached_at: string } | undefined;

  if (!row) {
    row = db
      .prepare(
        `SELECT payload_json, data_source, cached_at FROM area_cache
         WHERE ABS(lat - ?) <= 0.0035 AND ABS(lng - ?) <= 0.0035 AND ABS(radius_km - ?) <= 0.2
         ORDER BY cached_at DESC LIMIT 1`
      )
      .get(lat, lng, radiusKm) as
      | { payload_json: string; data_source: string; cached_at: string }
      | undefined;
  }

  if (!row) return null;

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
  if (!db) {
    if (!memoryAreas) memoryAreas = new Map();
    memoryAreas.set(record.cacheKey, record);
    return;
  }

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
  if (!db) {
    if (!memoryAreas) return [];
    return Array.from(memoryAreas.values()).map((r) => ({ ...r, fromCache: true }));
  }

  const rows = db
    .prepare('SELECT payload_json FROM area_cache ORDER BY cached_at DESC LIMIT 30')
    .all() as { payload_json: string }[];
  return rows.map((r) => {
    const rec = JSON.parse(r.payload_json) as AreaIntelligenceRecord;
    rec.fromCache = true;
    return rec;
  });
}
