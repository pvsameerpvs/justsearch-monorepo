"use client";

import { useState } from 'react';
import type { Restaurant } from '@/lib/restaurant-types';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';

export type ViewMode = 'grid' | 'list';

export function useMenuShowcaseState(restaurant: Restaurant) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
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

  const availableItemsCount = restaurant.menu
    .flatMap((category) => category.items)
    .filter((item) => item.isAvailable).length;

  const currency = cart[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';
  const shouldShowDeliveryCart = mode === 'delivery' && cartCount > 0;

  return {
    viewMode,
    setViewMode,
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
