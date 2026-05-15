"use client";

import type { ReactNode } from 'react';
import type { Restaurant } from '@/lib/restaurant-types';
import { FulfillmentContext } from './use-restaurant-fulfillment';
import { useFulfillmentState } from './use-fulfillment-state';

export function FulfillmentProvider({ restaurant, children }: { restaurant: Restaurant; children: ReactNode }) {
  const state = useFulfillmentState(restaurant.slug);
  return <FulfillmentContext.Provider value={state}>{children}</FulfillmentContext.Provider>;
}
