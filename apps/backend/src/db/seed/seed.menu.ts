import { db } from '../index';
import { menuCategories, menus, menuItems } from '../schema';

export async function seedMenu(restaurantId: string) {
  const categories = await db
    .insert(menuCategories)
    .values([
      { restaurantId, name: 'Small Plates', description: 'Shareable starters', sortOrder: 1 },
      { restaurantId, name: 'Main Plates', description: 'Signature mains', sortOrder: 2 },
      { restaurantId, name: 'Desserts', description: 'Sweet finale', sortOrder: 3 },
      { restaurantId, name: 'Drinks', description: 'Beverages', sortOrder: 4 },
    ])
    .returning();

  const [menu] = await db
    .insert(menus)
    .values({
      restaurantId,
      name: 'Main Menu',
      description: 'Full menu',
      sortOrder: 1,
    })
    .returning();

  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  await db
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
}
