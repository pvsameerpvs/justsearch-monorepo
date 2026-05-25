import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import type { Order } from '@justsearch/types';
import type { DeliveryOrder } from '../../use-restaurant-fulfillment';
import { splitOrderAddress } from './profile-order-utils';
import { ProfileOrderDetailsAddressCard } from './profile-order-details-address-card';
import { ProfileOrderDetailsCancelReasonCard } from './profile-order-details-cancel-reason-card';
import { ProfileOrderDetailsInvoice } from './profile-order-details-invoice';
import { ProfileOrderDetailsRestaurantLink } from './profile-order-details-restaurant-link';
import { ProfileOrderDetailsRiderCard } from './profile-order-details-rider-card';
import { ProfileOrderDetailsStatusCard } from './profile-order-details-status-card';

type Props = {
  order: DeliveryOrder;
  sourceOrder: Order;
  currentRestaurant: Restaurant;
};

export function ProfileOrderDetailsPresenter({
  order,
  sourceOrder,
  currentRestaurant,
}: Props) {
  const addressLines = splitOrderAddress(order.address);
  const orderCurrency =
    order.items[0]?.currency ?? currentRestaurant.menu[0]?.items[0]?.currency ?? 'AED';
  const isCancelled = order.status === 'cancelled';

  return (
    <section className="py-4 sm:py-6">
      <Container className="max-w-2xl">
        <div className="space-y-3 sm:space-y-4">
          <ProfileOrderDetailsStatusCard order={order} />

          {isCancelled ? (
            <ProfileOrderDetailsCancelReasonCard reason={order.cancelReason} />
          ) : (
            <ProfileOrderDetailsRiderCard riderName={order.riderName} />
          )}

          <ProfileOrderDetailsAddressCard addressLines={addressLines} />
          <ProfileOrderDetailsRestaurantLink
            sourceOrder={sourceOrder}
            currentRestaurant={currentRestaurant}
          />
          <ProfileOrderDetailsInvoice order={order} currency={orderCurrency} />
        </div>
      </Container>
    </section>
  );
}
