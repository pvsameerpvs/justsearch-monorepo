"use client";

import { useMyOrdersQuery } from '@/lib/hooks/use-my-orders-query';
import { mapApiOrdersToSummaries } from './use-api-order-summaries';
import { CheckoutLiveProgressCircle } from './checkout-live-progress-circle';

export function ActiveOrderTracker() {
  const { data: apiOrders } = useMyOrdersQuery();
  const activeOrders = mapApiOrdersToSummaries(apiOrders);

  if (activeOrders.length === 0) return null;

  return <CheckoutLiveProgressCircle orders={activeOrders} />;
}
