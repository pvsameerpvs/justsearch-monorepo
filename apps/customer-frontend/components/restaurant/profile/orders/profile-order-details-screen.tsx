"use client";

import type { Restaurant } from '@/lib/restaurant-types';
import { Container } from '@/components/shared/container';
import { useProfileOrders } from './use-profile-orders';
import { ProfileOrderDetailsEmpty } from './profile-order-details-empty';
import { ProfileOrderDetailsLoading } from './profile-order-details-loading';
import { ProfileOrderDetailsPresenter } from './profile-order-details-presenter';

type Props = {
  restaurant: Restaurant;
  orderId: string;
};

export function ProfileOrderDetailsScreen({ restaurant, orderId }: Props) {
  const { hydrated, findOrderById } = useProfileOrders();

  if (!hydrated) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <ProfileOrderDetailsLoading />
        </Container>
      </section>
    );
  }

  const order = findOrderById(orderId);

  if (!order) {
    return (
      <section className="py-4 sm:py-6">
        <Container className="max-w-2xl">
          <ProfileOrderDetailsEmpty />
        </Container>
      </section>
    );
  }

  return <ProfileOrderDetailsPresenter order={order} restaurant={restaurant} />;
}
