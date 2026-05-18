import { client } from './index';

async function cleanupTenantSchemas(): Promise<void> {
  const restaurants = await client.unsafe<{ schema_name: string; name: string }[]>(
    `SELECT schema_name, name FROM public.restaurants WHERE status = 'active'`
  );

  for (const r of restaurants) {
    const schema = r.schema_name;

    // Drop old tables that are no longer cloned into tenants
    await client.unsafe(`DROP TABLE IF EXISTS "${schema}"."users" CASCADE`);
    await client.unsafe(`DROP TABLE IF EXISTS "${schema}"."restaurant_users" CASCADE`);
  }
}

cleanupTenantSchemas()
  .then(() => process.exit(0))
  .catch((err) => {
    process.stderr.write(String(err));
    process.exit(1);
  });
