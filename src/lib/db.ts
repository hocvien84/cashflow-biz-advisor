import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import { BusinessModel, AreaIntelligenceRecord, LeadUser } from '@/types/business';
import { buildCompleteSeedCatalog } from '@/data/seed-models';

// In-memory fallback store (used if host runs Node < 22.5 without node:sqlite or read-only FS)
let memoryModels: BusinessModel[] | null = null;
let memoryAreas: Map<string, AreaIntelligenceRecord> | null = null;
let memoryLeads: Map<string, LeadUser> | null = null;

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

      CREATE TABLE IF NOT EXISTS users_leads (
        email TEXT PRIMARY KEY,
        id TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        capital_budget REAL NOT NULL DEFAULT 500,
        target_area TEXT NOT NULL DEFAULT '',
        payload_json TEXT NOT NULL,
        last_active_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    // Always sync curated models so updated Vietnam market benchmarks (ROI, ROA, Payback, Net Margin) take effect immediately
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

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password.trim() + '_cashflow_salt_2026').digest('hex');
}

function ensureLeadsTable(db: SqliteDbLike): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users_leads (
      email TEXT PRIMARY KEY,
      id TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      capital_budget REAL NOT NULL DEFAULT 500,
      target_area TEXT NOT NULL DEFAULT '',
      payload_json TEXT NOT NULL,
      last_active_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

export function registerOrUpdateLead(input: {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  capitalBudgetMilVND?: number;
  targetArea?: string;
}): LeadUser {
  const db = getDb();
  const cleanEmail = input.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const pwdHash = input.password ? hashPassword(input.password) : hashPassword('123456');

  if (!db) {
    if (!memoryLeads) memoryLeads = new Map<string, LeadUser>();
    const existing = memoryLeads.get(cleanEmail);
    const user: LeadUser = {
      id: existing?.id || `lead_${Date.now().toString(36)}`,
      fullName: input.fullName.trim() || existing?.fullName || 'Khách hàng',
      email: cleanEmail,
      phone: input.phone.trim() || existing?.phone || '',
      passwordHash: input.password ? pwdHash : existing?.passwordHash || pwdHash,
      capitalBudgetMilVND: input.capitalBudgetMilVND ?? existing?.capitalBudgetMilVND ?? 500,
      targetArea: input.targetArea?.trim() || existing?.targetArea || '',
      scannedLocations: existing?.scannedLocations || [],
      topRecommendedModels: existing?.topRecommendedModels || [],
      reportSentCount: existing?.reportSentCount || 0,
      lastReportSentAt: existing?.lastReportSentAt,
      lastActiveAt: now,
      createdAt: existing?.createdAt || now,
    };
    memoryLeads.set(cleanEmail, user);
    const { passwordHash: _ph, ...safeUser } = user;
    return safeUser;
  }

  ensureLeadsTable(db);

  const existingRow = db
    .prepare('SELECT payload_json, password_hash FROM users_leads WHERE email = ?')
    .get(cleanEmail) as { payload_json: string; password_hash: string } | undefined;

  let existing: LeadUser | null = null;
  if (existingRow) {
    try {
      existing = JSON.parse(existingRow.payload_json) as LeadUser;
    } catch {
      existing = null;
    }
  }

  const finalPwdHash = input.password ? pwdHash : existingRow?.password_hash || pwdHash;
  const userRecord: LeadUser = {
    id: existing?.id || `lead_${Date.now().toString(36)}`,
    fullName: input.fullName.trim() || existing?.fullName || 'Khách hàng',
    email: cleanEmail,
    phone: input.phone.trim() || existing?.phone || '',
    capitalBudgetMilVND: input.capitalBudgetMilVND ?? existing?.capitalBudgetMilVND ?? 500,
    targetArea: input.targetArea?.trim() || existing?.targetArea || '',
    scannedLocations: existing?.scannedLocations || [],
    topRecommendedModels: existing?.topRecommendedModels || [],
    reportSentCount: existing?.reportSentCount || 0,
    lastReportSentAt: existing?.lastReportSentAt,
    lastActiveAt: now,
    createdAt: existing?.createdAt || now,
  };

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO users_leads (
      email, id, full_name, phone, password_hash, capital_budget, target_area, payload_json, last_active_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    cleanEmail,
    userRecord.id,
    userRecord.fullName,
    userRecord.phone,
    finalPwdHash,
    userRecord.capitalBudgetMilVND,
    userRecord.targetArea,
    JSON.stringify(userRecord),
    now,
    userRecord.createdAt
  );

  return userRecord;
}

export function authenticateLead(
  email: string,
  password?: string
): { success: boolean; user?: LeadUser; message?: string } {
  const db = getDb();
  const cleanEmail = email.trim().toLowerCase();
  const now = new Date().toISOString();

  if (!db) {
    if (!memoryLeads) memoryLeads = new Map<string, LeadUser>();
    const existing = memoryLeads.get(cleanEmail);
    if (!existing) {
      return {
        success: false,
        message: 'Email này chưa đăng ký trên hệ thống. Vui lòng chọn tab "Đăng ký tài khoản mới"!',
      };
    }
    if (password && existing.passwordHash && existing.passwordHash !== hashPassword(password)) {
      return {
        success: false,
        message: 'Mật khẩu không chính xác. Vui lòng thử lại hoặc đăng ký cập nhật lại thông tin.',
      };
    }
    existing.lastActiveAt = now;
    const { passwordHash: _ph, ...safeUser } = existing;
    return { success: true, user: safeUser };
  }

  ensureLeadsTable(db);

  const row = db
    .prepare('SELECT payload_json, password_hash FROM users_leads WHERE email = ?')
    .get(cleanEmail) as { payload_json: string; password_hash: string } | undefined;

  if (!row) {
    return {
      success: false,
      message: 'Email này chưa đăng ký trên hệ thống. Vui lòng chọn tab "Đăng ký tài khoản mới"!',
    };
  }

  if (password && row.password_hash !== hashPassword(password)) {
    return {
      success: false,
      message: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.',
    };
  }

  const user = JSON.parse(row.payload_json) as LeadUser;
  user.lastActiveAt = now;

  db.prepare('UPDATE users_leads SET payload_json = ?, last_active_at = ? WHERE email = ?').run(
    JSON.stringify(user),
    now,
    cleanEmail
  );

  return { success: true, user };
}

export function recordLeadConsultation(input: {
  email: string;
  fullName?: string;
  phone?: string;
  capitalBudgetMilVND?: number;
  scannedLocation?: string;
  recommendedModels?: string[];
  reportSent?: boolean;
}): LeadUser | null {
  const cleanEmail = input.email.trim().toLowerCase();
  if (!cleanEmail) return null;

  const baseUser = registerOrUpdateLead({
    fullName: input.fullName || '',
    email: cleanEmail,
    phone: input.phone || '',
    capitalBudgetMilVND: input.capitalBudgetMilVND,
    targetArea: input.scannedLocation,
  });

  const now = new Date().toISOString();
  const scannedSet = new Set(baseUser.scannedLocations || []);
  if (input.scannedLocation) scannedSet.add(input.scannedLocation);

  const modelsSet = new Set(baseUser.topRecommendedModels || []);
  if (input.recommendedModels) {
    for (const m of input.recommendedModels) {
      if (m) modelsSet.add(m);
    }
  }

  const updated: LeadUser = {
    ...baseUser,
    scannedLocations: Array.from(scannedSet).slice(0, 10),
    topRecommendedModels: Array.from(modelsSet).slice(0, 10),
    reportSentCount: (baseUser.reportSentCount || 0) + (input.reportSent ? 1 : 0),
    lastReportSentAt: input.reportSent ? now : baseUser.lastReportSentAt,
    lastActiveAt: now,
  };

  const db = getDb();
  if (!db) {
    if (!memoryLeads) memoryLeads = new Map<string, LeadUser>();
    const existing = memoryLeads.get(cleanEmail);
    memoryLeads.set(cleanEmail, { ...updated, passwordHash: existing?.passwordHash });
    return updated;
  }

  db.prepare(
    'UPDATE users_leads SET payload_json = ?, capital_budget = ?, target_area = ?, last_active_at = ? WHERE email = ?'
  ).run(
    JSON.stringify(updated),
    updated.capitalBudgetMilVND,
    updated.targetArea,
    now,
    cleanEmail
  );

  return updated;
}

export function getAllLeadsFromDb(): LeadUser[] {
  const db = getDb();
  if (!db) {
    if (!memoryLeads) return [];
    return Array.from(memoryLeads.values())
      .map(({ passwordHash: _ph, ...u }) => u)
      .sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt));
  }

  ensureLeadsTable(db);

  const rows = db
    .prepare('SELECT payload_json FROM users_leads ORDER BY last_active_at DESC LIMIT 500')
    .all() as { payload_json: string }[];

  return rows.map((r) => JSON.parse(r.payload_json) as LeadUser);
}

