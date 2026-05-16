import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db, client } from './index';
import {
  restaurants,
  games,
  superAdmins,
  users,
  staff,
  deliveryAgents,
  restaurantTables,
  menuCategories,
  menus,
  menuItems,
  orders,
  orderItems,
  payments,
  loyaltyPoints,
  gameSessions,
  tableSessions,
  promoCodes,
} from './schema';
import { createTenantSchema, seedTenantSchema } from './tenant-template';

/* ------------------------------------------------------------------ */
/*  CONFIGURATION                                                      */
/* ------------------------------------------------------------------ */

const DEMO_PASSWORDS = {
  owner: process.env.SEED_STAFF_PASSWORD || 'owner123',
  rider: process.env.SEED_RIDER_PASSWORD || 'rider123',
  admin: process.env.SEED_ADMIN_PASSWORD || 'admin123',
};

/* ------------------------------------------------------------------ */
/*  PUBLIC SCHEMA SEEDS                                                */
/* ------------------------------------------------------------------ */

async function seedDemoRestaurant() {
  const existing = await db.select().from(restaurants).where(eq(restaurants.slug, 'demo-bistro'));
  if (existing.length > 0) {
    return existing[0];
  }

  const [restaurant] = await db
    .insert(restaurants)
    .values({
      slug: 'demo-bistro',
      subdomain: 'demo-bistro',
      schemaName: 'rest_demo_bistro',
      name: 'Demo Bistro',
      status: 'active',
      settings: JSON.stringify({
        currency: 'AED',
        taxRate: 5,
        deliveryFee: 10,
        acceptsDelivery: true,
        acceptsPickup: true,
        acceptsDineIn: true,
      }),
      theme: JSON.stringify({
        brandColor: '220 90 55',
        brandSoft: '255 245 240',
        accentColor: '45 180 120',
      }),
    })
    .returning();

  return restaurant;
}

async function seedPlatformGames() {
  const existing = await db.select().from(games);
  if (existing.length > 0) return;

  const platformGames = [
    {
      name: 'Jump & Bite',
      type: 'vex-runner',
      config: { description: 'Dash, jump, and dodge obstacles.', icon: '🏃', prize: 'Up to 1200 points', maxPoints: 1200, tag: 'HOT' },
      isActive: true,
    },
    {
      name: 'Hungry Bird Rush',
      type: 'hungry-bird-rush',
      config: { description: 'Tap to fly, weave through pipes.', icon: '🐤', prize: 'Up to 700 points', maxPoints: 700, tag: 'NEW' },
      isActive: true,
    },
    {
      name: 'Cheddar Chase',
      type: 'cheese-chase',
      config: { description: 'Guide the mouse through mazes.', icon: '🧀', prize: 'Up to 2500 points', maxPoints: 2500, tag: 'PRO' },
      isActive: true,
    },
    {
      name: 'Gem Match',
      type: 'memory-match',
      config: { description: 'Classic card matching game.', icon: '🃏', prize: 'Up to 2000 points', maxPoints: 2000, tag: 'HOT' },
      isActive: true,
    },
  ];

  await db.insert(games).values(platformGames);
}

async function seedSuperAdmin() {
  const existing = await db.select().from(superAdmins);
  if (existing.length > 0) return;

  await db.insert(superAdmins).values({
    name: 'Platform Admin',
    username: 'admin',
    passwordHash: await bcrypt.hash(DEMO_PASSWORDS.admin, 12),
    email: 'admin@justsearch.com',
    isActive: true,
  });
}

/* ------------------------------------------------------------------ */
/*  TENANT SCHEMA SEEDS                                               */
/* ------------------------------------------------------------------ */

async function seedTenantUsers(schemaName: string, restaurantId: string) {
  const customers = [
    { phone: '+971501111111', name: 'Amina Hassan' },
    { phone: '+971502222222', name: 'Karim Fayed' },
    { phone: '+971503333333', name: 'Layla Mahmoud' },
    { phone: '+971504444444', name: 'Omar Khalil' },
  ];

  for (const customer of customers) {
    await client.unsafe(
      `INSERT INTO "${schemaName}"."users" (restaurant_id, phone, name, role, is_active) VALUES ($1, $2, $3, $4, true) ON CONFLICT DO NOTHING`,
      [restaurantId, customer.phone, customer.name, 'customer']
    );
  }
}

async function seedTenantMenu(schemaName: string, restaurantId: string) {
  const categories = [
    { name: 'Small Plates', desc: 'Shareable starters', order: 1 },
    { name: 'Main Plates', desc: 'Hearty mains', order: 2 },
    { name: 'Desserts', desc: 'Sweet treats', order: 3 },
    { name: 'Drinks', desc: 'Beverages', order: 4 },
  ];

  for (const cat of categories) {
    await client.unsafe(
      `INSERT INTO "${schemaName}"."menu_categories" (restaurant_id, name, description, sort_order, status) VALUES ($1, $2, $3, $4, 'active')`,
      [restaurantId, cat.name, cat.desc, cat.order]
    );
  }

  await client.unsafe(
    `INSERT INTO "${schemaName}"."menus" (restaurant_id, name, description, status, sort_order) VALUES ($1, $2, $3, 'active', 1)`,
    [restaurantId, 'Main Menu', 'Full restaurant menu']
  );
}

async function seedTenantTables(schemaName: string, restaurantId: string) {
  const tables = [
    { number: 'T1', capacity: 2 },
    { number: 'T2', capacity: 4 },
    { number: 'T3', capacity: 4 },
    { number: 'T4', capacity: 6 },
    { number: 'T5', capacity: 8 },
  ];

  for (const table of tables) {
    await client.unsafe(
      `INSERT INTO "${schemaName}"."restaurant_tables" (restaurant_id, table_number, capacity, status) VALUES ($1, $2, $3, 'available')`,
      [restaurantId, table.number, table.capacity]
    );
  }
}

async function seedTenantDeliveryAgents(schemaName: string, restaurantId: string) {
  const agents = [
    { name: 'Samira Khan', phone: '+971528804412', username: 'samira_khan', vehicle: 'scooter', shift: 'Morning' },
    { name: 'Ahmed Noor', phone: '+971529995523', username: 'ahmed_noor', vehicle: 'bike', shift: 'Evening' },
  ];

  for (const agent of agents) {
    await client.unsafe(
      `INSERT INTO "${schemaName}"."delivery_agents" (restaurant_id, name, phone, username, password_hash, vehicle_type, status, rating, completed_today, shift_label, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)`,
      [restaurantId, agent.name, agent.phone, agent.username, await bcrypt.hash(DEMO_PASSWORDS.rider, 12), agent.vehicle, 'offline', '4.8', 0, agent.shift]
    );
  }
}

async function seedTenantPromoCodes(schemaName: string, restaurantId: string) {
  const codes = [
    { code: 'WELCOME20', type: 'percentage', value: '20', min: '50' },
    { code: 'FLAT10', type: 'fixed', value: '10', min: '30' },
  ];

  for (const promo of codes) {
    await client.unsafe(
      `INSERT INTO "${schemaName}"."promo_codes" (restaurant_id, code, type, value, min_order, is_active) VALUES ($1, $2, $3, $4, $5, true)`,
      [restaurantId, promo.code, promo.type, promo.value, promo.min]
    );
  }
}

/* ------------------------------------------------------------------ */
/*  COMPLETE DEMO DATABASE SETUP                                      */
/* ------------------------------------------------------------------ */

async function setupDemoDatabase() {
  const restaurant = await seedDemoRestaurant();

  await Promise.all([
    seedPlatformGames(),
    seedSuperAdmin(),
  ]);

  await createTenantSchema(restaurant.schemaName);
  await seedTenantSchema(restaurant.schemaName, restaurant.id);

  await Promise.all([
    seedTenantUsers(restaurant.schemaName, restaurant.id),
    seedTenantMenu(restaurant.schemaName, restaurant.id),
    seedTenantTables(restaurant.schemaName, restaurant.id),
    seedTenantDeliveryAgents(restaurant.schemaName, restaurant.id),
    seedTenantPromoCodes(restaurant.schemaName, restaurant.id),
  ]);
}

/* ------------------------------------------------------------------ */
/*  ENTRY POINT                                                        */
/* ------------------------------------------------------------------ */

async function main() {
  try {
    await setupDemoDatabase();
  } finally {
    await client.end();
  }
}

main().catch(() => {
  process.exit(1);
});
