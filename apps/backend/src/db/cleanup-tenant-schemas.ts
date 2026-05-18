import { client } from './index';

async function cleanupTenantSchemas(): Promise<void> {
  const restaurants = await client.unsafe<{ schema_name: string; name: string }[]>(
    `SELECT schema_name, name FROM public.restaurants WHERE status = 'active'`
  );

  for (const r of restaurants) {
    const schema = r.schema_name;
    console.log(`[${schema}] Cleaning up tenant schema...`);

    // Drop old tables that are no longer cloned into tenants
    await client.unsafe(`DROP TABLE IF EXISTS "${schema}"."users" CASCADE`);
    await client.unsafe(`DROP TABLE IF EXISTS "${schema}"."restaurant_users" CASCADE`);
    console.log(`[${schema}] Dropped obsolete tables: users, restaurant_users`);

    // Add new tenant tables that were introduced after initial creation
    // (addresses is now in TENANT_TABLES but may be missing in older schemas)
    await client.unsafe(
      `CREATE TABLE IF NOT EXISTS "${schema}"."addresses" (LIKE public."addresses" INCLUDING ALL)`
    );
    console.log(`[${schema}] Ensured table: addresses`);
  }

  console.log('Tenant schema cleanup complete.');
}

cleanupTenantSchemas()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
