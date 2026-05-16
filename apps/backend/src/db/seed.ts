import dotenv from 'dotenv';
dotenv.config();

import { client } from './index';
import { seedRestaurant } from './seed/seed.restaurant';
import { seedStaff, seedDeliveryAgent, seedTable } from './seed/seed.staff';
import { seedMenu } from './seed/seed.menu';
import { seedCustomer, seedSuperAdmin } from './seed/seed.users';
import { seedGames } from './seed/seed.games';

async function seed() {
  console.log('Seeding database...');

  const restaurantId = await seedRestaurant();
  await seedStaff(restaurantId);
  await seedDeliveryAgent(restaurantId);
  await seedTable(restaurantId);
  await seedMenu(restaurantId);
  await seedCustomer(restaurantId);
  await seedSuperAdmin();
  await seedGames();

  console.log('Seeding completed successfully');
  await client.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
