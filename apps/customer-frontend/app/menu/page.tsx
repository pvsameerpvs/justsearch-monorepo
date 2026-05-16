import { RestaurantMenuShowcase } from '@/components/restaurant/restaurant-menu-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { headers } from 'next/headers';
import { fetchMenu, adaptApiCategoriesToLocal } from '@/lib/api/menu.api';

export default async function MenuPage() {
  const restaurant = await getCurrentRestaurant();
  const headerStore = await headers();
  const host = headerStore.get('host') ?? '';

  const menuData = await fetchMenu(host);
  const adaptedMenu = menuData ? adaptApiCategoriesToLocal(menuData) : [];

  return <RestaurantMenuShowcase restaurant={{ ...restaurant, menu: adaptedMenu }} />;
}
