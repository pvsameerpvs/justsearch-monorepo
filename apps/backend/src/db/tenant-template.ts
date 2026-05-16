import bcrypt from 'bcrypt';
import { client } from './index';

const TENANT_TABLES = [
  'users',
  'restaurant_users',
  'restaurant_tables',
  'menu_categories',
  'menus',
  'menu_items',
  'promo_codes',
  'orders',
  'order_items',
  'payments',
  'delivery_agents',
  'delivery_assignments',
  'staff',
  'loyalty_points',
  'table_sessions',
  'game_sessions',
  'audit_logs',
  'otp_requests',
  'daily_closeouts',
];

export async function createTenantSchema(schemaName: string): Promise<void> {
  await client.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  for (const table of TENANT_TABLES) {
    await client.unsafe(
      `CREATE TABLE IF NOT EXISTS "${schemaName}"."${table}" (LIKE public."${table}" INCLUDING ALL)`
    );
  }
}

export async function seedTenantSchema(
  schemaName: string,
  restaurantId: string
): Promise<void> {
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'mydomain.com';
  const ownerHash = await bcrypt.hash('owner123', 12);
  const riderHash = await bcrypt.hash('rider123', 12);

  await client.unsafe(
    `INSERT INTO "${schemaName}"."staff" (restaurant_id, name, username, password_hash, role, permissions, is_active) VALUES ($1, $2, $3, $4, $5, $6, true)`,
    [restaurantId, 'Restaurant Owner', 'owner', ownerHash, 'owner', JSON.stringify({ all: true })]
  );

  await client.unsafe(
    `INSERT INTO "${schemaName}"."delivery_agents" (restaurant_id, name, phone, username, password_hash, vehicle_type, status, rating, completed_today, shift_label, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
    [restaurantId, 'Delivery Rider', '+971 50 000 0000', 'rider', riderHash, 'scooter', 'offline', '5.0', 0, 'Flexible']
  );

  await client.unsafe(
    `INSERT INTO "${schemaName}"."restaurant_tables" (restaurant_id, table_number, capacity, status) VALUES ($1, $2, $3, $4)`,
    [restaurantId, 'T1', 4, 'available']
  );

  await client.unsafe(
    `INSERT INTO "${schemaName}"."users" (restaurant_id, phone, name, role, is_active) VALUES ($1, $2, $3, $4, true)`,
    [restaurantId, '+971 50 111 1111', 'Guest Customer', 'customer']
  );
}

export async function dropTenantSchema(schemaName: string): Promise<void> {
  await client.unsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
}
