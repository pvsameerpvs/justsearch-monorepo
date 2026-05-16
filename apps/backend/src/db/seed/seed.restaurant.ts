import { db } from '../index';
import { restaurants } from '../schema';

export async function seedRestaurant(): Promise<string | null> {
  // No default restaurant seeded — restaurants are created via admin portal
  const existing = await db.select().from(restaurants).limit(1);
  if (existing.length > 0) {
    return existing[0].id;
  }
  return null;
}
