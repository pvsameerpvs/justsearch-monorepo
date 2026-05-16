import dotenv from 'dotenv';
dotenv.config();

import { client } from './index';
import { seedRestaurant } from './seed/seed.restaurant';
import { seedStaff, seedDeliveryAgent, seedTable } from './seed/seed.staff';
import { seedMenu } from './seed/seed.menu';
import { seedCustomer, seedSuperAdmin } from './seed/seed.users';
import { seedGames } from './seed/seed.games';

async function seed() {
  try {
    const restaurantId = await seedRestaurant();
    if (restaurantId) {
      await seedStaff(restaurantId);
      await seedDeliveryAgent(restaurantId);
      await seedTable(restaurantId);
      await seedMenu(restaurantId);
      await seedCustomer(restaurantId);
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
