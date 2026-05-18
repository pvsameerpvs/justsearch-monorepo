import bcrypt from 'bcrypt';
import { client } from './index';

import fs from 'fs';
import path from 'path';

// Per-tenant tables cloned into each restaurant schema
// Global tables (users, user_restaurants, addresses, loyalty_points) stay in public schema only
export const TENANT_TABLES = [
  'orders',
  'order_items',
  'menu_categories',
  'menus',
  'menu_items',
  'promo_codes',
  'delivery_agents',
  'delivery_assignments',
  'staff',
  'game_sessions',
  'otp_requests',
  'daily_closeouts',
];

const DEFAULT_RIDER_PASSWORD = process.env.SEED_RIDER_PASSWORD || 'rider123';

export async function createTenantSchema(schemaName: string): Promise<void> {
  await client.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  for (const table of TENANT_TABLES) {
    await client.unsafe(
      `CREATE TABLE IF NOT EXISTS "${schemaName}"."${table}" (LIKE public."${table}" INCLUDING ALL)`
    );
  }
}

export async function setupTenantDefaults(
  schemaName: string,
  restaurantId: string,
  ownerCredentials?: { username?: string; password?: string }
): Promise<void> {
  const ownerUsername = ownerCredentials?.username || 'owner';
  const ownerPassword = ownerCredentials?.password || (process.env.SEED_STAFF_PASSWORD || 'owner123');
  const ownerHash = await bcrypt.hash(ownerPassword, 12);
  const riderHash = await bcrypt.hash(DEFAULT_RIDER_PASSWORD, 12);

  await client.unsafe(
    `INSERT INTO "${schemaName}"."staff" (restaurant_id, name, username, password_hash, role, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, true)`,
    [restaurantId, 'Restaurant Owner', ownerUsername, ownerHash, 'owner', JSON.stringify({ all: true })]
  );

  await client.unsafe(
    `INSERT INTO "${schemaName}"."delivery_agents" (restaurant_id, name, phone, username, password_hash, vehicle_type, status, rating, completed_today, shift_label, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
    [restaurantId, 'Delivery Rider', '', 'rider', riderHash, 'scooter', 'offline', '5.0', 0, 'Flexible']
  );

  await client.unsafe(
    `INSERT INTO "${schemaName}"."menu_categories" (restaurant_id, name, description, sort_order, status) VALUES ` +
    `($1, 'Starters', 'Appetizers and small bites', 1, 'active'),` +
    `($1, 'Mains', 'Main course dishes', 2, 'active'),` +
    `($1, 'Desserts', 'Sweet treats', 3, 'active'),` +
    `($1, 'Drinks', 'Beverages and refreshments', 4, 'active')`,
    [restaurantId]
  );

  await client.unsafe(
    `INSERT INTO "${schemaName}"."menus" (restaurant_id, name, description, status, sort_order) VALUES ($1, $2, $3, $4, $5)`,
    [restaurantId, 'Main Menu', 'Our complete menu', 'active', 1]
  );
}

export async function backupTenantSchema(
  schemaName: string,
  restaurantSlug: string
): Promise<string> {
  const backupDir = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${restaurantSlug}_${timestamp}.json`;
  const filepath = path.join(backupDir, filename);

  const backup: Record<string, unknown[]> = {};

  for (const table of TENANT_TABLES) {
    try {
      const rows = await client.unsafe(`SELECT * FROM "${schemaName}"."${table}"`);
      backup[table] = rows as unknown[];
    } catch {
      // Table may not exist (e.g. partially created restaurant) — skip
      backup[table] = [];
    }
  }

  // Also backup the public.restaurants registry row
  try {
    const [registry] = await client.unsafe(
      `SELECT * FROM public.restaurants WHERE schema_name = $1`,
      [schemaName]
    );
    backup['_registry'] = registry ? [registry] : [];
  } catch {
    backup['_registry'] = [];
  }

  fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
  return filepath;
}

export async function dropTenantSchema(schemaName: string): Promise<void> {
  await client.unsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
}
