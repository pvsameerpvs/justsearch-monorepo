#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  max: 2,
  ssl: 'require',
  // @ts-expect-error
  family: 4,
  prepare: false,
});

async function migrate() {
  const restaurants = await sql`
    SELECT schema_name FROM public.restaurants WHERE status = 'active'
  `;

  if (restaurants.length === 0) {
    console.log('No active restaurants found');
    process.exit(0);
  }

  for (const r of restaurants) {
    const schema = r.schema_name;
    if (!schema) continue;

    console.log(`\nMigrating schema: ${schema}`);

    try {
      await sql.unsafe(`
        ALTER TABLE IF EXISTS "${schema}"."orders"
          ADD COLUMN IF NOT EXISTS promo_code_id uuid,
          ADD COLUMN IF NOT EXISTS promo_code varchar(50),
          ADD COLUMN IF NOT EXISTS discount_amount numeric(10, 2) DEFAULT '0';
      `);

      await sql.unsafe(`
        ALTER TABLE IF EXISTS "${schema}"."promo_codes"
          ADD COLUMN IF NOT EXISTS title varchar(100),
          ADD COLUMN IF NOT EXISTS description text;
      `);

      await sql.unsafe(`
        ALTER TABLE IF EXISTS "${schema}"."scratch_campaigns"
          ADD COLUMN IF NOT EXISTS behavior varchar(20) DEFAULT 'scratch_card',
          ADD COLUMN IF NOT EXISTS config JSONB;
      `);

      console.log(`  ✅ ${schema} migrated`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  ⚠️ ${schema} failed: ${msg}`);
    }
  }

  await sql.end();
  console.log('\n✅ Migration complete');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
