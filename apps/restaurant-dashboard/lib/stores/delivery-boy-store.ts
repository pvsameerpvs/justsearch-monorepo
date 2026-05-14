"use client";

import { create } from 'zustand';
import { generateUniqueId, INITIAL_AGENTS } from './delivery-boy-store.data';
import type { DeliveryBoy, UpdateAgentData, AddAgentData, DeliveryBoyStore } from './delivery-boy-store.types';

export * from './delivery-boy-store.types';

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
