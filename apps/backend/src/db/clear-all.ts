import dotenv from 'dotenv';

dotenv.config();

import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
  // @ts-expect-error
  family: 4,
});

async function clearAll() {
  console.log('🔍 Checking database...');

  // 1. Get all tenant schemas (rest_*)
  const schemas = await client`
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name LIKE 'rest_%'
      AND schema_name NOT IN ('rest_information_schema')
  `;

  console.log(`📋 Found ${schemas.length} restaurant schemas:`);
  for (const s of schemas) {
    console.log(`   - ${s.schema_name}`);
  }

  // 2. Drop all tenant schemas
  for (const s of schemas) {
    const schemaName = s.schema_name;
    console.log(`🗑️  Dropping schema: ${schemaName}...`);
    await client.unsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
    console.log(`   ✅ Dropped ${schemaName}`);
  }

  // 3. Get all tables in public schema except super_admins
  const publicTables = await client`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name != 'super_admins'
      AND table_name != 'drizzle_migrations'
  `;

  console.log(`📋 Found ${publicTables.length} public tables to clear:`);
  for (const t of publicTables) {
    console.log(`   - ${t.table_name}`);
  }

  // 4. Truncate all public tables (disable triggers to avoid FK issues)
  for (const t of publicTables) {
    const tableName = t.table_name;
    console.log(`🧹 Clearing table: ${tableName}...`);
    await client.unsafe(`TRUNCATE TABLE "public"."${tableName}" CASCADE`);
    console.log(`   ✅ Cleared ${tableName}`);
  }

  // 5. Verify super_admins still has data
  const admins = await client`SELECT id, username, name FROM public.super_admins`;
  console.log(`\n👤 Super admins remaining (${admins.length}):`);
  for (const a of admins) {
    console.log(`   - ${a.username} (${a.name})`);
  }

  // 6. Verify restaurants table is empty
  const remainingRestaurants = await client`SELECT COUNT(*) as count FROM public.restaurants`;
  console.log(`\n🏪 Restaurants remaining: ${remainingRestaurants[0].count}`);

  // 7. Verify games table is empty
  const remainingGames = await client`SELECT COUNT(*) as count FROM public.games`;
  console.log(`🎮 Games remaining: ${remainingGames[0].count}`);

  // 8. Verify advertisements table is empty
  const remainingAds = await client`SELECT COUNT(*) as count FROM public.advertisements`;
  console.log(`📢 Ads remaining: ${remainingAds[0].count}`);

  console.log('\n✅ Database cleanup complete! Only super_admin credentials kept.');
}

clearAll()
  .catch((err) => {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
    process.exit(0);
  });
