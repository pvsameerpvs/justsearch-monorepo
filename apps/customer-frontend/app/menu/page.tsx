import { RestaurantMenuShowcase } from '@/components/restaurant/restaurant-menu-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function MenuPage() {
  const restaurant = await getCurrentRestaurant();

  return <RestaurantMenuShowcase restaurant={restaurant} />;
}
