import { eq } from 'drizzle-orm';
import { db } from '../db';
import { restaurants } from '../db/schema';
import type { TenantContext } from './tenant.middleware';

export async function lookupTenant(subdomain: string): Promise<TenantContext | null> {
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.subdomain, subdomain))
    .limit(1);

  if (!restaurant) return null;

  return {
    id: restaurant.id,
    slug: restaurant.slug,
    subdomain: restaurant.subdomain,
    schemaName: restaurant.schemaName,
    status: restaurant.status,
  };
}
