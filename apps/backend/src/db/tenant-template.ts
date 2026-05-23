import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
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
  'otp_requests',
  'daily_closeouts',
];

export function generateSecurePassword(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const bytes = randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

export async function createTenantSchema(schemaName: string): Promise<void> {
  await client.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // Find an existing active schema that has the orders table to use as template
  // (public.orders may not exist after schema-per-tenant migration)
  const templateResult = await client.unsafe(
    `SELECT r.schema_name FROM public.restaurants r ` +
    `JOIN information_schema.tables t ON t.table_schema = r.schema_name AND t.table_name = 'orders' ` +
    `WHERE r.status = 'active' LIMIT 1`
  );
  const sourceSchema = templateResult[0]?.schema_name || 'public';

  for (const table of TENANT_TABLES) {
    await client.unsafe(
      `CREATE TABLE IF NOT EXISTS "${schemaName}"."${table}" (LIKE "${sourceSchema}"."${table}" INCLUDING ALL)`
    );
  }

  // Ensure orders table has all columns defined in Drizzle schema,
  // regardless of whether the source schema was created before migrations
  await client.unsafe(
    `ALTER TABLE "${schemaName}"."orders" ` +
    `ADD COLUMN IF NOT EXISTS payment_method "payment_method", ` +
    `ADD COLUMN IF NOT EXISTS cancel_reason text, ` +
    `ADD COLUMN IF NOT EXISTS alternate_number varchar(20), ` +
    `ADD COLUMN IF NOT EXISTS eta_minutes integer, ` +
    `ADD COLUMN IF NOT EXISTS table_id uuid`
  );
}

export async function setupTenantDefaults(
  schemaName: string,
  restaurantId: string,
  ownerCredentials?: { username?: string; password?: string }
): Promise<{ username: string; password: string }> {
  const ownerUsername = ownerCredentials?.username || 'owner';
  const ownerPassword = ownerCredentials?.password || generateSecurePassword();
  const ownerHash = await bcrypt.hash(ownerPassword, 12);

  await client.unsafe(
    `INSERT INTO "${schemaName}"."staff" (restaurant_id, name, username, password_hash, role, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, true)`,
    [restaurantId, 'Restaurant Owner', ownerUsername, ownerHash, 'owner', JSON.stringify({ all: true })]
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

  return { username: ownerUsername, password: ownerPassword };
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
