import { apiClient } from './client';
import type { Order, OrderItem } from '@justsearch/types';

export type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  fulfillmentType: 'dine_in' | 'delivery' | 'pickup';
  items: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress?: string;
  notes?: string;
  paymentMethod?: 'cash' | 'card';
  alternateNumber?: string;
  lat?: number;
  lng?: number;
};

export type CreateOrderResponse = {
  order: { id: string; code: string };
};

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  return apiClient<CreateOrderResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchOrder(orderId: string): Promise<{ order: Order; items: OrderItem[] }> {
  return apiClient<{ order: Order; items: OrderItem[] }>(`/orders/${orderId}`);
}

// Cross-restaurant order history (all restaurants mixed together)
export type CrossRestaurantOrder = {
  id: string;
  code: string;
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
  restaurantSubdomain: string;
  restaurantLogoUrl: string | null;
  status: string;
  total: string;
  createdAt: string;
  fulfillmentType: string;
};

export type MyOrdersAllResponse = {
  orders: CrossRestaurantOrder[];
};

export async function fetchMyOrders(): Promise<MyOrdersAllResponse> {
  return apiClient<MyOrdersAllResponse>('/orders/my-all');
}
