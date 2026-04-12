import { ProfileOrderDetailsScreen } from '@/components/restaurant/profile/orders/profile-order-details-screen';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

type OrderDetailsPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const restaurant = await getCurrentRestaurant();
  const { orderId } = await params;

  return (
    <ProfileOrderDetailsScreen
      restaurant={restaurant}
      orderId={decodeURIComponent(orderId)}
    />
  );
}
