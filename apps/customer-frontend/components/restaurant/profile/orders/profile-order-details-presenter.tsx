import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import type { DeliveryOrder } from '../../use-restaurant-fulfillment';
import { splitOrderAddress } from './profile-order-utils';
import { ProfileOrderDetailsAddressCard } from './profile-order-details-address-card';
import { ProfileOrderDetailsInvoice } from './profile-order-details-invoice';
import { ProfileOrderDetailsRestaurantLink } from './profile-order-details-restaurant-link';
import { ProfileOrderDetailsRiderCard } from './profile-order-details-rider-card';
import { ProfileOrderDetailsStatusCard } from './profile-order-details-status-card';

type Props = {
  order: DeliveryOrder;
  restaurant: Restaurant;
};

export function ProfileOrderDetailsPresenter({ order, restaurant }: Props) {
  const addressLines = splitOrderAddress(order.address);
  const orderCurrency =
    order.items[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';

  return (
    <section className="py-4 sm:py-6">
      <Container className="max-w-2xl">
        <div className="space-y-3 sm:space-y-4">
          <ProfileOrderDetailsStatusCard order={order} />
          <ProfileOrderDetailsRiderCard riderName={order.riderName} />
          <ProfileOrderDetailsAddressCard addressLines={addressLines} />
          <ProfileOrderDetailsRestaurantLink restaurant={restaurant} />
          <ProfileOrderDetailsInvoice order={order} currency={orderCurrency} />
        </div>
      </Container>
    </section>
  );
}
