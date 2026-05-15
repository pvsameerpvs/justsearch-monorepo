"use client";

import { createContext, useContext } from 'react';
import type { FulfillmentContextType } from './fulfillment.types';

const FulfillmentContext = createContext<FulfillmentContextType | null>(null);

export function useRestaurantFulfillment() {
  const context = useContext(FulfillmentContext);
  if (!context) throw new Error('useRestaurantFulfillment must be used within a FulfillmentProvider');
  return context;
}

export { FulfillmentContext };
