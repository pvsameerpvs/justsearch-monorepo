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

export async function querySchemaByRestaurantId<T>(
  schemaName: string,
  tableName: string,
  restaurantId: string,
  limit: number = 100
): Promise<T[]> {
  return client.unsafe<T[]>(
    `SELECT * FROM ${sql.identifier(schemaName).toString()}.${sql.identifier(tableName).toString()} WHERE restaurant_id = $1 ORDER BY created_at DESC LIMIT ${limit}`,
    [restaurantId]
  );
}

export async function aggregateAllSchemas<T>(
  tableName: string,
  aggregateFn: string
): Promise<T> {
  const schemas = await getActiveSchemas();
  const parts: string[] = [];

  for (const schema of schemas) {
    parts.push(
      `SELECT ${aggregateFn} FROM ${sql.identifier(schema.schemaName).toString()}.${sql.identifier(tableName).toString()}`
    );
  }

  if (parts.length === 0) {
    return 0 as T;
  }

  const query = parts.join(' UNION ALL ');
  const [result] = await client.unsafe<T[]>(`SELECT COALESCE(SUM(sum), 0) as value FROM (${query}) sub`);
  return result as T;
}
