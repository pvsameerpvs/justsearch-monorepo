import { sql } from 'drizzle-orm';
import { db, client } from '../db';
import { restaurants } from '../db/schema';
import { eq } from 'drizzle-orm';

interface ActiveSchema {
  schemaName: string;
  id: string;
  name: string;
}

export async function getActiveSchemas(): Promise<ActiveSchema[]> {
  const rows = await db
    .select({ schemaName: restaurants.schemaName, id: restaurants.id, name: restaurants.name })
    .from(restaurants)
    .where(eq(restaurants.status, 'active'));
  return rows;
}

export async function queryAllSchemas<T>(
  tableName: string,
  columns: string = '*',
  whereClause: string = 'TRUE',
  params: string[] = []
): Promise<T[]> {
  const schemas = await getActiveSchemas();
  const results: T[] = [];

  for (const schema of schemas) {
    const schemaTable = `${schema.schemaName}.${tableName}`;
    const rows = await client.unsafe<T[]>(
      `SELECT ${columns} FROM ${sql.identifier(schema.schemaName).toString()}.${sql.identifier(tableName).toString()} WHERE ${whereClause} ORDER BY created_at DESC`,
      params
    );
    results.push(...rows);
  }

  return results;
}

export async function querySchemaById<T>(
  schemaName: string,
  tableName: string,
  id: string
): Promise<T | null> {
  const [row] = await client.unsafe<T[]>(
    `SELECT * FROM ${sql.identifier(schemaName).toString()}.${sql.identifier(tableName).toString()} WHERE id = $1 LIMIT 1`,
    [id]
  );
  return row ?? null;
}
