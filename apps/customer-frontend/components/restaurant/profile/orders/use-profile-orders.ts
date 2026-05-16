"use client";

import { useMemo } from 'react';
import { useRestaurantFulfillment } from '../../use-restaurant-fulfillment';

export function useProfileOrders() {
  const { hydrated, orders } = useRestaurantFulfillment();

  const ordersById = useMemo(
    () => new Map(orders.map((order) => [order.id, order])),
    [orders],
  );

  return {
    hydrated,
    orders,
    findOrderById: (orderId: string) => ordersById.get(orderId) ?? null,
  };
}
