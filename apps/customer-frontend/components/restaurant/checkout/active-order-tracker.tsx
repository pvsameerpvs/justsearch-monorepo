"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRestaurant } from '@/components/restaurant/restaurant-context';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import { 
    getCheckoutStageIndex, 
    getCheckoutLiveStages, 
    CHECKOUT_STAGE_COMPLETED_MS 
} from './checkout-live-status-utils';
import { CheckoutLiveProgressCircle } from './checkout-live-progress-circle';

export function ActiveOrderTracker() {
  const restaurant = useRestaurant();
  const { hydrated, orders } = useRestaurantFulfillment(restaurant);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const activeOrders = useMemo(() => {
    if (!hydrated) return [];
    
    return orders
      .filter(o => getCheckoutStageIndex(o.createdAt, now, o.status) < 3)
      .sort((a, b) => a.createdAt - b.createdAt)
      .map(o => {
        const stageIndex = getCheckoutStageIndex(o.createdAt, now, o.status);
        const liveStages = getCheckoutLiveStages(o.riderName);
        return {
          id: o.id,
          progress: Math.min(1, (now - o.createdAt) / CHECKOUT_STAGE_COMPLETED_MS),
          stageLabel: liveStages[Math.min(stageIndex, liveStages.length - 1)].label,
          createdAt: o.createdAt,
          isOnTheWay: !!o.riderName
        };
      });
  }, [hydrated, orders, now]);

  if (activeOrders.length === 0) return null;

  return (
    <CheckoutLiveProgressCircle 
      orders={activeOrders}
    />
  );
}
