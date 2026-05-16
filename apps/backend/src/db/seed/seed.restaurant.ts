import { db } from '../index';
import { restaurants } from '../schema';

export async function seedRestaurant() {
  const [mosaic] = await db
    .insert(restaurants)
    .values({
      slug: 'mosaic-table',
      subdomain: 'mosaic-table',
      schemaName: 'rest_mosaic',
      name: 'Mosaic Table',
      status: 'active',
      settings: JSON.stringify({}),
      theme: JSON.stringify({
        brandColor: '15 118 110',
        brandSoft: '223 247 243',
        accentColor: '245 170 66',
      }),
    })
    .returning();

  return mosaic.id;
}
