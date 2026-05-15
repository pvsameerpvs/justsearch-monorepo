import bcrypt from 'bcrypt';
import { db, client } from './index';
import {
  restaurants,
  users,
  menuCategories,
  menus,
  menuItems,
  staff,
  deliveryAgents,
  restaurantTables,
} from './schema';

async function seed() {
  console.log('Seeding database...');

  // 1. Create demo restaurant
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

  const restaurantId = mosaic.id;
  console.log('Created restaurant:', mosaic.name);

  // 2. Create staff (owner)
  const hashedPassword = await bcrypt.hash('owner123', 12);
  const [owner] = await db
    .insert(staff)
    .values({
      restaurantId,
      name: 'Omar Hassan',
      username: 'owner_mosaic',
      passwordHash: hashedPassword,
      role: 'owner',
      permissions: JSON.stringify({ all: true }),
    })
    .returning();
  console.log('Created staff:', owner.name);

  // 3. Create delivery agent
  const agentPassword = await bcrypt.hash('rider123', 12);
  const [agent] = await db
    .insert(deliveryAgents)
    .values({
      restaurantId,
      name: 'Samira Khan',
      phone: '+971 52 880 4412',
      username: 'samira_khan',
      passwordHash: agentPassword,
      vehicleType: 'scooter',
      status: 'online',
      rating: '4.9',
      completedToday: 14,
      shiftLabel: '12:00 PM to 8:00 PM',
    })
    .returning();
  console.log('Created delivery agent:', agent.name);

  // 4. Create table
  const [table] = await db
    .insert(restaurantTables)
    .values({
      restaurantId,
      tableNumber: 'T1',
      capacity: 4,
      status: 'available',
    })
    .returning();
  console.log('Created table:', table.tableNumber);

  // 5. Create menu categories
  const categories = await db
    .insert(menuCategories)
    .values([
      { restaurantId, name: 'Small Plates', description: 'Shareable starters', sortOrder: 1 },
      { restaurantId, name: 'Main Plates', description: 'Signature mains', sortOrder: 2 },
      { restaurantId, name: 'Desserts', description: 'Sweet finale', sortOrder: 3 },
      { restaurantId, name: 'Drinks', description: 'Beverages', sortOrder: 4 },
    ])
    .returning();
  console.log('Created', categories.length, 'menu categories');

  // 6. Create menu
  const [menu] = await db
    .insert(menus)
    .values({
      restaurantId,
      name: 'Main Menu',
      description: 'Full menu',
      sortOrder: 1,
    })
    .returning();
  console.log('Created menu:', menu.name);

  // 7. Create menu items
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));
  const items = await db
    .insert(menuItems)
    .values([
      {
        restaurantId,
        menuId: menu.id,
        categoryId: categoryMap.get('Small Plates'),
        name: 'Whipped Hummus',
        description: 'Crisp chickpeas, extra virgin olive oil, warm pita chips',
        price: '28.00',
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554',
        tags: JSON.stringify(['Veg']),
        isVeg: true,
        sortOrder: 1,
      },
      {
        restaurantId,
        menuId: menu.id,
        categoryId: categoryMap.get('Small Plates'),
        name: 'Charred Halloumi',
        description: 'Citrus glaze, fresh mint, sesame & herbs',
        price: '34.00',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
        tags: JSON.stringify(['Popular', 'Veg']),
        isVeg: true,
        sortOrder: 2,
      },
      {
        restaurantId,
        menuId: menu.id,
        categoryId: categoryMap.get('Main Plates'),
        name: 'Citrus Grilled Salmon',
        description: 'Herb rice, roasted greens, lemon butter sauce',
        price: '78.00',
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
        sortOrder: 1,
      },
      {
        restaurantId,
        menuId: menu.id,
        categoryId: categoryMap.get('Desserts'),
        name: 'Date Cake',
        description: 'Warm caramel, candied pistachio, and cream',
        price: '32.00',
        imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
        sortOrder: 1,
      },
      {
        restaurantId,
        menuId: menu.id,
        categoryId: categoryMap.get('Drinks'),
        name: 'Signature Saffron Spritz',
        description: 'Citrus, elderflower, sparkling finish',
        price: '26.00',
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
        tags: JSON.stringify(['New', 'Popular']),
        sortOrder: 1,
      },
    ])
    .returning();
  console.log('Created', items.length, 'menu items');

  // 8. Create demo customer
  const [customer] = await db
    .insert(users)
    .values({
      restaurantId,
      phone: '+971501234567',
      name: 'Amina Hassan',
      role: 'customer',
      isActive: true,
    })
    .returning();
  console.log('Created customer:', customer.name);

  console.log('Seeding completed successfully');
  await client.end();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
