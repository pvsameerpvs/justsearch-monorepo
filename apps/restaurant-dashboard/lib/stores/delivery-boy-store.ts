"use client";

import { create } from 'zustand';

export type AgentStatus = 'available' | 'busy' | 'offline';

export type DeliveryBoy = {
  id: string;
  name: string;
  phone: string;
  email: string;
  uniqueId: string;
  isActive: boolean;
  status: AgentStatus;
  currentOrderId: string | null;
  totalDeliveries: number;
  rating: number;
  location: string;
};

interface DeliveryBoyStore {
  agents: DeliveryBoy[];
  addAgent: (agent: { name: string; phone: string; email: string; isActive: boolean }) => void;
  removeAgent: (id: string) => void;
  setStatus: (id: string, status: AgentStatus, currentOrderId?: string | null) => void;
}

function generateUniqueId(name: string): string {
  const prefix = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 3);
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}`;
}

const INITIAL_AGENTS: DeliveryBoy[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    phone: '+971 55 123 4567',
    email: 'ahmed@delivery.com',
    uniqueId: 'aem-101',
    isActive: true,
    status: 'busy',
    currentOrderId: '5',
    totalDeliveries: 145,
    rating: 4.8,
    location: 'Marina',
  },
  {
    id: '2',
    name: 'Mohammed Ali',
    phone: '+971 50 987 6543',
    email: 'mohammed@delivery.com',
    uniqueId: 'moh-202',
    isActive: true,
    status: 'available',
    currentOrderId: null,
    totalDeliveries: 89,
    rating: 4.5,
    location: 'JLT',
  },
  {
    id: '3',
    name: 'Rashid Khan',
    phone: '+971 52 444 7777',
    email: 'rashid@delivery.com',
    uniqueId: 'ras-303',
    isActive: true,
    status: 'busy',
    currentOrderId: '5',
    totalDeliveries: 210,
    rating: 4.9,
    location: 'Downtown',
  },
  {
    id: '4',
    name: 'Fahad Ibrahim',
    phone: '+971 54 666 8888',
    email: 'fahad@delivery.com',
    uniqueId: 'fah-404',
    isActive: true,
    status: 'offline',
    currentOrderId: null,
    totalDeliveries: 56,
    rating: 4.3,
    location: 'JBR',
  },
  {
    id: '5',
    name: 'Saeed Omar',
    phone: '+971 56 333 9999',
    email: 'saeed@delivery.com',
    uniqueId: 'sae-505',
    isActive: true,
    status: 'available',
    currentOrderId: null,
    totalDeliveries: 120,
    rating: 4.7,
    location: 'Marina',
  },
];

export const useDeliveryBoyStore = create<DeliveryBoyStore>((set) => ({
  agents: INITIAL_AGENTS,
  addAgent: (agent) =>
    set((state) => ({
      agents: [
        ...state.agents,
        {
          ...agent,
          id: crypto.randomUUID(),
          uniqueId: generateUniqueId(agent.name),
          status: 'available' as AgentStatus,
          currentOrderId: null,
          totalDeliveries: 0,
          rating: 5.0,
          location: 'Unknown',
        },
      ],
    })),
  removeAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),
  setStatus: (id, status, currentOrderId = null) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, status, currentOrderId } : a
      ),
    })),
}));
