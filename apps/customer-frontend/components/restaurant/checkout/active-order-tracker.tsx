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

  const activeOrder = useMemo(() => {
    if (!hydrated || orders.length === 0) return null;
    
    // Most recent order
    const latest = orders[0];
    const stageIndex = getCheckoutStageIndex(latest.createdAt, now, latest.status);
    
    // Only show if not delivered
    if (stageIndex >= 3) return null;
    
    return latest;
  }, [hydrated, orders, now]);

  if (!activeOrder) return null;

  const stageIndex = getCheckoutStageIndex(activeOrder.createdAt, now, activeOrder.status);
  const liveStages = getCheckoutLiveStages(activeOrder.riderName);
  const overallProgress = Math.min(1, (now - activeOrder.createdAt) / CHECKOUT_STAGE_COMPLETED_MS);
  const currentStageLabel = liveStages[Math.min(stageIndex, liveStages.length - 1)].label;

  return (
    <CheckoutLiveProgressCircle 
      progress={overallProgress}
      stageLabel={currentStageLabel}
    />
  );
}
