"use client";

import { create } from 'zustand';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export type DashboardOrder = {
  id: string;
  code: string;
  customerName: string;
  customerPhone: string;
  items: number;
  total: number;
  status: OrderStatus;
  type: 'dine_in' | 'delivery' | 'pickup';
  address: string;
  assignedAgentId: string | null;
  createdAt: string;
};

interface OrderStore {
  orders: DashboardOrder[];
  assignAgent: (orderId: string, agentId: string) => void;
  updateStatus: (orderId: string, status: OrderStatus) => void;
}

const INITIAL_ORDERS: DashboardOrder[] = [
  {
    id: '1',
    code: '#1024',
    customerName: 'Amina Hassan',
    customerPhone: '+971 55 111 2222',
    items: 3,
    total: 142,
    status: 'pending',
    type: 'delivery',
    address: '24 Marina Walk, JLT',
    assignedAgentId: null,
    createdAt: '2024-05-12T10:00:00',
  },
  {
    id: '2',
    code: '#1025',
    customerName: 'Khalid Al Mansoori',
    customerPhone: '+971 50 333 4444',
    items: 2,
    total: 78,
    status: 'confirmed',
    type: 'dine_in',
    address: 'Table 5',
    assignedAgentId: null,
    createdAt: '2024-05-12T10:15:00',
  },
  {
    id: '3',
    code: '#1026',
    customerName: 'Priya Nair',
    customerPhone: '+971 52 555 6666',
    items: 4,
    total: 210,
    status: 'preparing',
    type: 'delivery',
    address: 'Dubai Marina, Tower 3',
    assignedAgentId: null,
    createdAt: '2024-05-12T10:30:00',
  },
];

export const useOrderStore = create<OrderStore>((set) => ({
  orders: INITIAL_ORDERS,
  assignAgent: (orderId, agentId) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, assignedAgentId: agentId, status: 'out_for_delivery' as OrderStatus } : o
      ),
    })),
  updateStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    })),
}));
