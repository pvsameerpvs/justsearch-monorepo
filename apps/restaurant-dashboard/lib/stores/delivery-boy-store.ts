"use client";

import { create } from 'zustand';

export type DeliveryBoy = {
  id: string;
  name: string;
  phone: string;
  email: string;
  uniqueId: string;
  isActive: boolean;
  totalDeliveries: number;
  rating: number;
};

interface DeliveryBoyStore {
  agents: DeliveryBoy[];
  addAgent: (agent: { name: string; phone: string; email: string; isActive: boolean }) => void;
  removeAgent: (id: string) => void;
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
    totalDeliveries: 145,
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Mohammed Ali',
    phone: '+971 50 987 6543',
    email: 'mohammed@delivery.com',
    uniqueId: 'moh-202',
    isActive: true,
    totalDeliveries: 89,
    rating: 4.5,
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
          totalDeliveries: 0,
          rating: 5.0,
        },
      ],
    })),
  removeAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),
}));
