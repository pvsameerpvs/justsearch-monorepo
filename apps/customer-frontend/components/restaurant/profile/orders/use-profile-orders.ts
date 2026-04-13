"use client";

import { useMemo } from 'react';
import type { Restaurant } from '@/lib/restaurant-types';
import {
  useRestaurantFulfillment,
  type DeliveryOrder,
} from '../../use-restaurant-fulfillment';

function createDemoOrders(restaurant: Restaurant): DeliveryOrder[] {
  const now = Date.now();

  return [
    {
      id: '7401',
      createdAt: now - 1000 * 60 * 60 * 26,
      items: [
        {
          itemId: 'vanilla-berry-cake',
          quantity: 1,
          name: 'Vanilla Berry Cake',
          price: 46.4,
          currency: 'AED',
        },
      ],
      address:
        'Work - Dubai Damas tower, 28 Al Maktoum Road\nRiggat Al Buteen, Dubai, United Arab Emirates\nHand it to me',
      note: 'Happy Birthday Chocolate Tag, Half Kg',
      riderName: `${restaurant.name.split(' ').slice(0, 2).join(' ')} Rider`,
      subtotal: 46.4,
      deliveryFee: 0,
      deliverySavings: 7,
      total: 46.4,
      status: 'delivered',
    },
    {
      id: '7402',
      createdAt: now - 1000 * 60 * 60 * 3,
      items: [
        {
          itemId: 'grilled-wrap',
          quantity: 1,
          name: 'Grilled Chicken Wrap',
          price: 29,
          currency: 'AED',
        },
        {
          itemId: 'fries',
          quantity: 1,
          name: 'Seasoned Fries',
          price: 14,
          currency: 'AED',
        },
      ],
      address:
        'Home - Jumeirah Lake Towers\nCluster V, Dubai\nLeave at the door',
      note: 'No onions in the wrap please.',
      riderName: `${restaurant.name.split(' ').slice(0, 2).join(' ')} Rider`,
      subtotal: 43,
      deliveryFee: 0,
      deliverySavings: 7,
      total: 43,
      status: 'assigned_delivery_boy',
    },
  ];
}

export function useProfileOrders(restaurant: Restaurant) {
  const { hydrated, orders } = useRestaurantFulfillment();

  const fallbackOrders = useMemo(
    () => createDemoOrders(restaurant),
    [restaurant.name],
  );

  const displayOrders = orders.length > 0 ? orders : fallbackOrders;

  const ordersById = useMemo(
    () => new Map(displayOrders.map((order) => [order.id, order])),
    [displayOrders],
  );

  return {
    hydrated,
    orders: displayOrders,
    findOrderById: (orderId: string) => ordersById.get(orderId) ?? null,
  };
}
