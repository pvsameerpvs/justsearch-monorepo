import { db } from '../index';
import { restaurants } from '../schema';

export async function seedRestaurant(): Promise<{ id: string; schemaName: string } | null> {
  const existing = await db.select().from(restaurants).limit(1);
  if (existing.length > 0) {
    return { id: existing[0].id, schemaName: existing[0].schemaName };
  }

  // Create default demo restaurant for local development
  const schemaName = 'rest_demo_bistro';
  const [restaurant] = await db
    .insert(restaurants)
    .values({
      slug: 'demo-bistro',
      subdomain: 'demo-bistro',
      schemaName,
      name: 'Demo Bistro',
      status: 'active',
      settings: {},
      theme: {},
    })
    .returning();

  return { id: restaurant.id, schemaName };
}
