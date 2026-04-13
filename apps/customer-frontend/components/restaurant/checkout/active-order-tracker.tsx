"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import {
  getCheckoutOrderSummaries,
} from './checkout-live-status-utils';
import { CheckoutLiveProgressCircle } from './checkout-live-progress-circle';

export function ActiveOrderTracker() {
  const { hydrated, orders } = useRestaurantFulfillment();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeOrders = useMemo(() => {
    if (!hydrated) return [];
    return getCheckoutOrderSummaries(orders, now);
  }, [hydrated, orders, now]);

  if (activeOrders.length === 0) return null;

  return (
    <CheckoutLiveProgressCircle orders={activeOrders} />
  );
}
