#!/usr/bin/env node
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require', family: 4, prepare: false, max: 2 });

const schemas = await sql`SELECT schema_name, name FROM public.restaurants WHERE status = 'active'`;
console.log('Found', schemas.length, 'active restaurants:');

for (const r of schemas) {
  const tables = await sql.unsafe(`SELECT table_name FROM information_schema.tables WHERE table_schema = '${r.schema_name}' AND table_type = 'BASE TABLE' ORDER BY table_name`);
  const cols = await sql.unsafe(`SELECT column_name FROM information_schema.columns WHERE table_schema = '${r.schema_name}' AND table_name = 'promo_codes' ORDER BY ordinal_position`);
  console.log(`\n${r.schema_name} (${r.name}):`);
  console.log(`  Tables: ${tables.map(t => t.table_name).join(', ')}`);
  console.log(`  promo_codes columns: ${cols.map(c => c.column_name).join(', ') || 'NONE'}`);
}
await sql.end();
