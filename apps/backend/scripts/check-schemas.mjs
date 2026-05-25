import 'dotenv/config';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

const TENANT_TABLES = [
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

const GLOBAL_TABLES = [
  'users',
  'user_restaurants',
  'addresses',
  'loyalty_points',
  'games',
  'advertisements',
  'super_admins',
  'restaurants',
];

async function main() {
  const restaurants = await sql`
    SELECT id, name, schema_name, subdomain, slug
    FROM public.restaurants
    ORDER BY name
  `;

  console.log('=== TENANT SCHEMA CHECK ===\n');

  let allTenantsOk = true;
  const extraTablesBySchema = {};

  for (const r of restaurants) {
    const schema = r.schema_name;
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = ${schema}
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;
    const tableNames = tables.map((t) => t.table_name);
    const missing = TENANT_TABLES.filter((t) => !tableNames.includes(t));
    const unexpected = tableNames.filter((t) => !TENANT_TABLES.includes(t));

    const ok = missing.length === 0;
    if (!ok) allTenantsOk = false;
    if (unexpected.length > 0) extraTablesBySchema[schema] = unexpected;

    const status = ok ? '✅' : '❌';
    const missingStr = missing.length > 0 ? ` (missing: ${missing.join(', ')})` : '';
    console.log(`${status} ${r.name} (${schema})${missingStr}`);
  }

  if (restaurants.length === 0) {
    console.log('No restaurants found in public.restaurants.');
  }

  console.log('\n=== EXTRA TABLES IN TENANT SCHEMAS ===\n');
  const extraSchemas = Object.keys(extraTablesBySchema);
  if (extraSchemas.length === 0) {
    console.log('No unexpected tables found in any tenant schema. ✅');
  } else {
    for (const schema of extraSchemas) {
      console.log(`⚠️  ${schema}: ${extraTablesBySchema[schema].join(', ')}`);
    }
  }

  console.log('\n=== GLOBAL TABLES CHECK (public schema) ===\n');
  const publicTables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `;
  const publicTableNames = publicTables.map((t) => t.table_name);
  const missingGlobal = GLOBAL_TABLES.filter((t) => !publicTableNames.includes(t));
  const unexpectedGlobal = publicTableNames.filter((t) => !GLOBAL_TABLES.includes(t));

  for (const t of GLOBAL_TABLES) {
    const present = publicTableNames.includes(t);
    console.log(`${present ? '✅' : '❌'} public.${t}`);
  }

  if (missingGlobal.length > 0) {
    console.log(`\nMissing global tables: ${missingGlobal.join(', ')}`);
  }
  if (unexpectedGlobal.length > 0) {
    console.log(`\nUnexpected extra tables in public: ${unexpectedGlobal.join(', ')}`);
  }

  console.log('\n=== DUPLICATE PHONE NUMBERS IN public.users ===\n');
  const dups = await sql`
    SELECT phone, COUNT(*) as count
    FROM public.users
    WHERE phone IS NOT NULL AND phone <> ''
    GROUP BY phone
    HAVING COUNT(*) > 1
    ORDER BY count DESC, phone
  `;

  if (dups.length === 0) {
    console.log('No duplicate phone numbers found. ✅');
  } else {
    console.log(`Found ${dups.length} duplicate phone number(s):`);
    for (const d of dups) {
      console.log(`  • ${d.phone} — ${d.count} users`);
    }
  }

  console.log('\n=== SUMMARY ===\n');
  console.log(`Restaurants checked: ${restaurants.length}`);
  console.log(`All tenant schemas complete: ${allTenantsOk ? 'Yes ✅' : 'No ❌'}`);
  console.log(`Global tables complete: ${missingGlobal.length === 0 ? 'Yes ✅' : 'No ❌'}`);
  console.log(`Duplicate phones: ${dups.length === 0 ? 'None ✅' : dups.length + ' found ❌'}`);

  await sql.end();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
