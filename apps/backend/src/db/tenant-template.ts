import bcrypt from 'bcryptjs';
import { client } from './index';
import { generateSecurePassword } from '../lib/password.utils';

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
  'scratch_campaigns',
  'customer_scratch_rewards',
];

export async function createTenantSchema(schemaName: string): Promise<void> {
  await client.unsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // Find an existing active schema that has the orders table to use as template
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

  // Ensure orders table has all columns defined in Drizzle schema
  await client.unsafe(
    `ALTER TABLE "${schemaName}"."orders" ` +
    `ADD COLUMN IF NOT EXISTS payment_method "payment_method", ` +
    `ADD COLUMN IF NOT EXISTS cancel_reason text, ` +
    `ADD COLUMN IF NOT EXISTS alternate_number varchar(20), ` +
    `ADD COLUMN IF NOT EXISTS eta_minutes integer, ` +
    `ADD COLUMN IF NOT EXISTS table_id uuid, ` +
    `ADD COLUMN IF NOT EXISTS promo_code_id uuid, ` +
    `ADD COLUMN IF NOT EXISTS promo_code varchar(50), ` +
    `ADD COLUMN IF NOT EXISTS discount_amount numeric(10, 2) DEFAULT '0'`
  );

  // Ensure promo_codes has title and description columns
  await client.unsafe(
    `ALTER TABLE "${schemaName}"."promo_codes" ` +
    `ADD COLUMN IF NOT EXISTS title varchar(100), ` +
    `ADD COLUMN IF NOT EXISTS description text`
  );

  // Ensure delivery_agents has push subscription column
  await client.unsafe(
    `ALTER TABLE "${schemaName}"."delivery_agents" ` +
    `ADD COLUMN IF NOT EXISTS push_subscription JSONB`
  );

  // Ensure scratch_campaigns has behavior and config columns
  await client.unsafe(
    `ALTER TABLE "${schemaName}"."scratch_campaigns" ` +
    `ADD COLUMN IF NOT EXISTS behavior varchar(20) DEFAULT 'scratch_card', ` +
    `ADD COLUMN IF NOT EXISTS config JSONB`
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
