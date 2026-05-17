import dotenv from 'dotenv';
dotenv.config();

import { client } from './index';
import { seedRestaurant } from './seed/seed.restaurant';
import { seedSuperAdmin } from './seed/seed.users';
import { seedGames } from './seed/seed.games';
import { createTenantSchema, seedTenantSchema } from './tenant-template';

async function seed() {
  try {
    const restaurant = await seedRestaurant();
    if (restaurant) {
      await createTenantSchema(restaurant.schemaName);
      await seedTenantSchema(restaurant.schemaName, restaurant.id, {
        username: 'owner',
        password: 'owner123',
      });
    }
    await seedSuperAdmin();
    await seedGames();
  } finally {
    await client.end();
  }
}

seed().catch(() => {
  process.exit(1);
});
