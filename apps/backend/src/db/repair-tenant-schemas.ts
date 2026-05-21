import { client } from './index';

async function repairTenantSchemas(): Promise<void> {
  const restaurants = await client.unsafe<{ schema_name: string; name: string }[]>(
    `SELECT schema_name, name FROM public.restaurants WHERE status = 'active'`
  );

  for (const r of restaurants) {
    const schema = r.schema_name;

    // Add missing columns to orders table in tenant schemas
    // These columns were added via migrations after the initial schema-per-tenant setup.
    // If a tenant schema was cloned from an older schema, it may be missing them.
    await client.unsafe(
      `ALTER TABLE "${schema}"."orders" ` +
      `ADD COLUMN IF NOT EXISTS payment_method "payment_method", ` +
      `ADD COLUMN IF NOT EXISTS cancel_reason text, ` +
      `ADD COLUMN IF NOT EXISTS alternate_number varchar(20), ` +
      `ADD COLUMN IF NOT EXISTS eta_minutes integer, ` +
      `ADD COLUMN IF NOT EXISTS table_id uuid`
    );
  }
}

repairTenantSchemas()
  .then(() => process.exit(0))
  .catch((err) => {
    process.stderr.write(String(err));
    process.exit(1);
  });
