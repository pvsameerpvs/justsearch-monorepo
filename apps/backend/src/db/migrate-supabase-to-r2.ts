import dotenv from 'dotenv';
dotenv.config();

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '../lib/r2';
import { db, client } from './index';

// ── Config ─────────────────────────────────────────────
const SUPABASE_DOMAIN = 'supabase.co';

interface MigrationResult {
  table: string;
  id: string;
  field: string;
  oldUrl: string;
  newUrl: string;
  status: 'success' | 'skipped' | 'error';
  error?: string;
}

const results: MigrationResult[] = [];

// ── Helpers ──────────────────────────────────────────

function isSupabaseUrl(url: string | null): boolean {
  return !!url && url.includes(SUPABASE_DOMAIN);
}

function isAlreadyMigrated(url: string | null): boolean {
  return !!url && url.includes('r2.dev');
}

function guessExtension(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase() ?? '';
  const valid = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'webm', 'mov', 'pdf'];
  return valid.includes(ext) ? ext : 'jpg';
}

function guessContentType(url: string): string {
  const ext = guessExtension(url);
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    pdf: 'application/pdf',
  };
  return map[ext] ?? 'application/octet-stream';
}

/** Map a JSONB field name to an R2 folder */
function folderFromFieldName(key: string): string {
  const lower = key.toLowerCase();
  if (lower.includes('logo')) return 'logos';
  if (lower.includes('hero') || lower.includes('banner') || lower.includes('cover') || lower.includes('background')) return 'banners';
  if (lower.includes('pdf') || lower.includes('document') || lower.includes('invoice') || lower.includes('receipt') || lower.includes('bill') || lower.includes('catalog') || lower.includes('brochure')) return 'pdfs';
  if (lower.includes('gallery') || lower.includes('interior') || lower.includes('exterior') || lower.includes('restaurant') || lower.includes('shop') || lower.includes('store')) return 'restaurants';
  if (lower.includes('game') || lower.includes('play') || lower.includes('poster')) return 'games';
  if (lower.includes('qr')) return 'qr';
  if (lower.includes('ad') || lower.includes('campaign') || lower.includes('promo') || lower.includes('advert')) return 'ads';
  if (lower.includes('menu') && !lower.includes('pdf')) return 'menu';
  return 'general';
}

async function downloadFile(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function migrateSingleUrl(
  oldUrl: string,
  targetFolder: string
): Promise<{ newUrl: string; status: 'success' | 'skipped' | 'error'; error?: string }> {
  if (isAlreadyMigrated(oldUrl)) {
    return { newUrl: oldUrl, status: 'skipped' };
  }
  if (!isSupabaseUrl(oldUrl)) {
    return { newUrl: oldUrl, status: 'skipped' };
  }

  try {
    const ext = guessExtension(oldUrl);
    const contentType = guessContentType(oldUrl);
    const newPath = `${targetFolder}/${uuid()}.${ext}`;
    const buffer = await downloadFile(oldUrl);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: newPath,
        Body: buffer,
        ContentType: contentType,
      })
    );

    const newUrl = `${R2_PUBLIC_URL}/${newPath}`;
    return { newUrl, status: 'success' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { newUrl: oldUrl, status: 'error', error: message };
  }
}

function pushResult(
  table: string,
  id: string,
  field: string,
  oldUrl: string,
  newUrl: string,
  status: 'success' | 'skipped' | 'error',
  error?: string
) {
  results.push({ table, id, field, oldUrl, newUrl, status, error });
}

// ── Deep JSONB scanner ─────────────────────────────────

function deepScanJsonb(obj: unknown, callbacks: { onUrl: (key: string, value: string) => Promise<void> }): Promise<void> {
  return deepScan(obj, '', callbacks);
}

async function deepScan(obj: unknown, path: string, callbacks: { onUrl: (key: string, value: string) => Promise<void> }): Promise<void> {
  if (obj === null || obj === undefined) return;

  if (typeof obj === 'string' && isSupabaseUrl(obj)) {
    // Use the leaf key name as the identifier
    const key = path.split('.').pop() ?? 'unknown';
    await callbacks.onUrl(key, obj);
    return;
  }

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      await deepScan(obj[i], `${path}[${i}]`, callbacks);
    }
    return;
  }

  if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      await deepScan(value, path ? `${path}.${key}` : key, callbacks);
    }
  }
}

// ── Public schema migrations ───────────────────────────

async function migrateAdvertisements(): Promise<void> {
  console.log('\n📢 Migrating advertisements...');
  const rows = await db.execute<{
    id: string;
    image_url: string | null;
    media_url_low: string | null;
  }>(sql`SELECT id, image_url, media_url_low FROM public.advertisements`);

  for (const row of rows) {
    if (row.image_url && isSupabaseUrl(row.image_url)) {
      const { newUrl, status, error } = await migrateSingleUrl(row.image_url, 'ads');
      if (status === 'success') {
        await db.execute(sql`UPDATE public.advertisements SET image_url = ${newUrl} WHERE id = ${row.id}`);
      }
      pushResult('public.advertisements', row.id, 'image_url', row.image_url, newUrl, status, error);
    }

    if (row.media_url_low && isSupabaseUrl(row.media_url_low)) {
      const { newUrl, status, error } = await migrateSingleUrl(row.media_url_low, 'ads');
      if (status === 'success') {
        await db.execute(sql`UPDATE public.advertisements SET media_url_low = ${newUrl} WHERE id = ${row.id}`);
      }
      pushResult('public.advertisements', row.id, 'media_url_low', row.media_url_low, newUrl, status, error);
    }
  }
}

async function migrateRestaurantSettings(): Promise<void> {
  console.log('\n🏪 Migrating restaurant settings (deep scan for all URLs)...');
  const rows = await db.execute<{
    id: string;
    settings: unknown;
  }>(sql`SELECT id, settings FROM public.restaurants`);

  for (const row of rows) {
    const settings =
      row.settings && typeof row.settings === 'object'
        ? (row.settings as Record<string, unknown>)
        : {};

    let updated = false;

    await deepScanJsonb(settings, {
      onUrl: async (key, oldUrl) => {
        const folder = folderFromFieldName(key);
        const { newUrl, status, error } = await migrateSingleUrl(oldUrl, folder);
        if (status === 'success') {
          // Update the value in the nested object
          setValueAtKey(settings, key, newUrl);
          updated = true;
        }
        pushResult('public.restaurants', row.id, `settings.${key}`, oldUrl, newUrl, status, error);
      },
    });

    if (updated) {
      await db.execute(
        sql`UPDATE public.restaurants SET settings = ${JSON.stringify(settings)}::jsonb WHERE id = ${row.id}`
      );
    }
  }
}

/** Set a value at a top-level or nested key path. Supports simple keys like "logoUrl" */
function setValueAtKey(obj: Record<string, unknown>, key: string, value: unknown): void {
  // For a deep scanner, we need to find the object that contains this key.
  // Since our deepScan passes the leaf key name, we search recursively.
  function findAndSet(current: unknown): boolean {
    if (current === null || current === undefined) return false;
    if (typeof current !== 'object') return false;

    const record = current as Record<string, unknown>;
    if (key in record && typeof record[key] === 'string' && isSupabaseUrl(record[key] as string)) {
      record[key] = value;
      return true;
    }

    for (const k of Object.keys(record)) {
      if (findAndSet(record[k])) return true;
    }
    return false;
  }

  findAndSet(obj);
}

// ── Per-tenant schema migrations ───────────────────────

async function migrateTenantMenuItems(schemaName: string): Promise<void> {
  const rows = await db.execute<{
    id: string;
    image_url: string | null;
  }>(
    sql`SELECT id, image_url FROM ${sql.identifier(schemaName)}.menu_items WHERE image_url LIKE '%supabase.co%'`
  );

  if (rows.length === 0) return;

  console.log(`   - ${schemaName}: ${rows.length} menu item(s) to migrate`);

  for (const row of rows) {
    if (!row.image_url) continue;
    const { newUrl, status, error } = await migrateSingleUrl(row.image_url, 'menu');
    if (status === 'success') {
      await db.execute(
        sql`UPDATE ${sql.identifier(schemaName)}.menu_items SET image_url = ${newUrl} WHERE id = ${row.id}`
      );
    }
    pushResult(`${schemaName}.menu_items`, row.id, 'image_url', row.image_url, newUrl, status, error);
  }
}

async function migrateAllTenantSchemas(): Promise<void> {
  console.log('\n🍽️  Migrating per-tenant tables across all restaurant schemas...');
  const schemas = await db.execute<{ schema_name: string }>(
    sql`SELECT schema_name FROM public.restaurants WHERE status = 'active'`
  );

  for (const { schema_name } of schemas) {
    try {
      await migrateTenantMenuItems(schema_name);
    } catch (err) {
      console.error(`   ✗ Failed menu_items in ${schema_name}:`, err);
    }
  }
}

// ── Main ───────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting Supabase → R2 migration\n');

  if (!R2_PUBLIC_URL) {
    console.error('❌ R2_PUBLIC_URL is not set. Aborting.');
    process.exit(1);
  }

  await migrateAdvertisements();
  await migrateRestaurantSettings();
  await migrateAllTenantSchemas();

  // Summary
  const success = results.filter((r) => r.status === 'success').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const errors = results.filter((r) => r.status === 'error');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Migration Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   Success:  ${success}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Errors:   ${errors.length}`);
  console.log(`   Total:    ${results.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const e of errors) {
      console.log(`   ${e.table} [${e.id}] ${e.field}: ${e.error}`);
    }
  }

  // Per-folder breakdown
  const folderCounts: Record<string, number> = {};
  for (const r of results) {
    if (r.status === 'success') {
      const folder = r.newUrl.replace(R2_PUBLIC_URL + '/', '').split('/')[0] ?? 'unknown';
      folderCounts[folder] = (folderCounts[folder] ?? 0) + 1;
    }
  }
  console.log('\n📁 Files migrated by folder:');
  for (const [folder, count] of Object.entries(folderCounts).sort()) {
    console.log(`   ${folder}: ${count}`);
  }

  await client.end();
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
