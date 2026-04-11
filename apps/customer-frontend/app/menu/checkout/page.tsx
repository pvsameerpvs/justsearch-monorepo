import { RestaurantCheckoutScreen } from '@/components/restaurant/restaurant-checkout-screen';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function MenuCheckoutPage() {
  const restaurant = await getCurrentRestaurant();

  return <RestaurantCheckoutScreen restaurant={restaurant} />;
}

