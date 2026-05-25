import { sql } from 'drizzle-orm';

/**
 * Build a schema-qualified table reference for raw SQL queries.
 * Use this for ALL tenant-scoped queries instead of relying on search_path.
 *
 * Example:
 *   db.execute(sql`SELECT * FROM ${t('rest_naples', 'orders')} WHERE ...`)
 *
 * This is the only safe way to query per-tenant tables when using
 * connection poolers (PgBouncer, Supavisor) in transaction mode,
 * because SET search_path does not survive backend swaps.
 */
export function t(schemaName: string, tableName: string) {
  return sql`${sql.identifier(schemaName)}.${sql.identifier(tableName)}`;
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function mapRow(row: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    mapped[toCamelCase(key)] = value;
  }
  return mapped;
}

export function mapRows(rows: Record<string, unknown>[]): Record<string, unknown>[] {
  return rows.map(mapRow);
}
