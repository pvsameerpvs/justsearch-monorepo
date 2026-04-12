"use client";

import { EmptyState } from '@/components/shared/empty-state';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { ProfileOrderListItem } from './profile-order-list-item';
import { useProfileOrders } from './use-profile-orders';

type ProfileOrdersScreenProps = {
  restaurant: Restaurant;
};

function LoadingRows() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-[76px] animate-pulse rounded-[22px] border border-[rgb(var(--border)/0.56)] bg-white/70"
        />
      ))}
    </div>
  );
}

export function ProfileOrdersScreen({ restaurant }: ProfileOrdersScreenProps) {
  const { hydrated, orders } = useProfileOrders(restaurant);

  return (
    <section className="py-4 sm:py-6">
      <Container className="max-w-2xl">
        <div className="mb-3 space-y-1 sm:mb-4">
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-[rgb(var(--ink))] sm:text-2xl">
            Past orders
          </h1>
          <p className="text-[13px] text-[rgb(var(--muted))] sm:text-sm">
            Tap the restaurant logo to open the menu, or tap the order row for the full summary.
          </p>
        </div>

        {!hydrated ? (
          <LoadingRows />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Your recent orders will show up here after checkout."
            className="rounded-[24px] p-6 sm:p-8"
          />
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {orders.map((order) => (
              <ProfileOrderListItem
                key={order.id}
                restaurant={restaurant}
                order={order}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
