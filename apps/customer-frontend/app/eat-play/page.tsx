import { RestaurantEatPlayShowcase } from '@/components/restaurant/restaurant-eat-play-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function EatPlayPage() {
  const restaurant = await getCurrentRestaurant();

  return <RestaurantEatPlayShowcase restaurant={restaurant} />;
}
