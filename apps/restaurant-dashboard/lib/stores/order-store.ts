"use client";

import { create } from 'zustand';
import { STATUS_TIMELINE_LABELS, INITIAL_ORDERS } from './order-store.data';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  image?: string;
  tags?: string[];
  notes?: string;
};

export type TimelineEvent = {
  status: OrderStatus;
  label: string;
  time: string;
};

export type DashboardOrder = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: number;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  status: OrderStatus;
  type: 'dine_in' | 'delivery' | 'pickup';
  address: string;
  paymentMethod: string;
  notes?: string;
  assignedAgentId: string | null;
  createdAt: string;
  orderItems: OrderItem[];
  timeline: TimelineEvent[];
};

interface OrderStore {
  orders: DashboardOrder[];
  assignAgent: (orderId: string, agentId: string) => void;
  updateStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: INITIAL_ORDERS,
  assignAgent: (orderId, agentId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, assignedAgentId: agentId } : o
      ),
    })),
  updateStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const alreadyExists = o.timeline.some((t) => t.status === status);
        const newEvent: TimelineEvent = {
          status,
          label: STATUS_TIMELINE_LABELS[status],
          time: new Date().toISOString(),
        };
        return {
          ...o,
          status,
          timeline: alreadyExists ? o.timeline : [...o.timeline, newEvent],
        };
      }),
    })),
}));
