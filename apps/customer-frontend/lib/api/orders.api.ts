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

export type MyOrdersResponse = {
  orders: Array<{ order: Order & { restaurantName?: string }; items: OrderItem[] }>;
};

export async function fetchMyOrders(): Promise<MyOrdersResponse> {
  return apiClient<MyOrdersResponse>('/orders/my');
}
