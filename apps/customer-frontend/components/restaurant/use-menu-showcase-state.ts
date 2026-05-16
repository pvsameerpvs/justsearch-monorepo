"use client";

import { useState, useMemo } from 'react';
import type { Restaurant } from '@/lib/restaurant-types';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';

export type ViewMode = 'grid' | 'list';
export type DietaryFilter = 'all' | 'veg' | 'nonVeg';

export function useMenuShowcaseState(restaurant: Restaurant) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const {
    mode,
    cart,
    cartCount,
    deliverySavings,
    total,
    getQuantity,
    addToCart,
    updateQuantity,
    clearCart,
  } = useRestaurantFulfillment();

  const filteredMenu = useMemo(() => {
    if (restaurant.isPureVeg) {
      return restaurant.menu;
    }
    if (dietaryFilter === 'all') {
      return restaurant.menu;
    }
    return restaurant.menu.map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        dietaryFilter === 'veg' ? item.isVeg : !item.isVeg
      ),
    })).filter((category) => category.items.length > 0);
  }, [restaurant.menu, restaurant.isPureVeg, dietaryFilter]);

  const availableItemsCount = filteredMenu
    .flatMap((category) => category.items)
    .filter((item) => item.isAvailable).length;

  const currency = cart[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';
  const shouldShowDeliveryCart = mode === 'delivery' && cartCount > 0;

  return {
    viewMode,
    setViewMode,
    dietaryFilter,
    setDietaryFilter,
    filteredMenu,
    mode,
    cart,
    cartCount,
    deliverySavings,
    total,
    getQuantity,
    addToCart,
    updateQuantity,
    clearCart,
    availableItemsCount,
    currency,
    shouldShowDeliveryCart,
  };
}
