import { apiClient } from './client';
import type { Order } from '@justsearch/types';

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

export async function fetchOrder(orderId: string): Promise<Order> {
  return apiClient<Order>(`/orders/${orderId}`);
}
