import { ProfileOrdersScreen } from '@/components/restaurant/profile/orders/profile-orders-screen';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function OrdersHistoryPage() {
  const restaurant = await getCurrentRestaurant();

  return <ProfileOrdersScreen restaurant={restaurant} />;
}
