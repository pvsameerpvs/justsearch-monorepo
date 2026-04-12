import { CheckoutOrderStatusListScreen } from '@/components/restaurant/checkout/checkout-order-status-list-screen';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function CheckoutOrderStatusListPage() {
  const restaurant = await getCurrentRestaurant();

  return <CheckoutOrderStatusListScreen restaurant={restaurant} />;
}
