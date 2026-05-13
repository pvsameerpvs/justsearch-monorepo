"use client";

import { create } from 'zustand';

export type AgentStatus = 'available' | 'busy' | 'offline';

export type DeliveryBoy = {
  id: string;
  name: string;
  phone: string;
  email: string;
  uniqueId: string;
  username: string;
  password: string;
  isActive: boolean;
  status: AgentStatus;
  currentOrderId: string | null;
  totalDeliveries: number;
  rating: number;
  location: string;
};

export type UpdateAgentData = {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  password?: string;
};

export type AddAgentData = {
  name: string;
  phone: string;
  email: string;
  location: string;
  password: string;
  isActive: boolean;
};

interface DeliveryBoyStore {
  agents: DeliveryBoy[];
  addAgent: (agent: AddAgentData) => void;
  removeAgent: (id: string) => void;
  toggleActive: (id: string) => void;
  updateAgent: (id: string, data: UpdateAgentData) => void;
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
    username: 'aem-101',
    password: 'driver123',
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
    username: 'moh-202',
    password: 'driver123',
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
    username: 'ras-303',
    password: 'driver123',
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
    username: 'fah-404',
    password: 'driver123',
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
    username: 'sae-505',
    password: 'driver123',
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
    set((state) => {
      const uniqueId = generateUniqueId(agent.name);
      const newAgent: DeliveryBoy = {
        id: crypto.randomUUID(),
        name: agent.name,
        phone: agent.phone,
        email: agent.email,
        uniqueId,
        username: uniqueId,
        password: agent.password,
        isActive: agent.isActive,
        status: 'available',
        currentOrderId: null,
        totalDeliveries: 0,
        rating: 5.0,
        location: agent.location,
      };
      return {
        agents: [...state.agents, newAgent],
      };
    }),
  removeAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),
  toggleActive: (id) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, isActive: !a.isActive } : a
      ),
    })),
  updateAgent: (id, data) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, ...data } : a
      ),
    })),
  setStatus: (id, status, currentOrderId = null) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, status, currentOrderId } : a
      ),
    })),
}));
