"use client";

import type { Restaurant } from '@/lib/restaurant-types';
import { Container } from '@/components/shared/container';
import { useOrderStatusQuery } from '@/lib/hooks/use-order-status-query';
import { mapOrderToDeliveryOrder } from './profile-order-mapper';
import { ProfileOrderDetailsEmpty } from './profile-order-details-empty';
import { ProfileOrderDetailsLoading } from './profile-order-details-loading';
import { ProfileOrderDetailsPresenter } from './profile-order-details-presenter';

type Props = {
  restaurant: Restaurant;
  orderId: string;
};

export function ProfileOrderDetailsScreen({ restaurant, orderId }: Props) {
  const { data, isLoading } = useOrderStatusQuery(orderId);

  if (isLoading) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <ProfileOrderDetailsLoading />
        </Container>
      </section>
    );
  }

  if (!data?.order) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <ProfileOrderDetailsEmpty />
        </Container>
      </section>
    );
  }

  const order = mapOrderToDeliveryOrder(
    data.order,
    data.items,
    restaurant.menu[0]?.items[0]?.currency ?? 'AED'
  );

  return <ProfileOrderDetailsPresenter order={order} restaurant={restaurant} />;
}
