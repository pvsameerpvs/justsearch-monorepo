"use client";

import { createContext, useContext, ReactNode } from 'react';
import type { Restaurant } from '@/lib/restaurant-types';

type RestaurantContextType = {
  restaurant: Restaurant;
};

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export function RestaurantProvider({ 
  restaurant, 
  children 
}: { 
  restaurant: Restaurant; 
  children: ReactNode;
}) {
  return (
    <RestaurantContext.Provider value={{ restaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context.restaurant;
}
