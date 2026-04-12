import { CheckoutLiveOrderStatusScreen } from '@/components/restaurant/checkout/checkout-live-order-status-screen';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

type CheckoutOrderStatusPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function CheckoutOrderStatusPage({
  params,
}: CheckoutOrderStatusPageProps) {
  const restaurant = await getCurrentRestaurant();
  const { orderId } = await params;

  return (
    <CheckoutLiveOrderStatusScreen
      restaurant={restaurant}
      orderId={decodeURIComponent(orderId)}
    />
  );
}
