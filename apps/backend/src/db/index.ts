import dotenv from 'dotenv';

// Load .env only if it exists (Railway injects env vars directly)
dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
  // Force IPv4 to avoid Supabase IPv6 connection issues
  // @ts-expect-error — postgres-js accepts this but types don't declare it
  family: 4,
  // Supabase Pooler doesn't support prepared statements well
  prepare: false,
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
