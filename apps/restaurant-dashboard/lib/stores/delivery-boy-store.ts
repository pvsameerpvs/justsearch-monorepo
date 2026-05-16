"use client";

import { create } from 'zustand';
import type { DeliveryBoy, UpdateAgentData, DeliveryBoyStore } from './delivery-boy-store.types';

export * from './delivery-boy-store.types';

export const useDeliveryBoyStore = create<DeliveryBoyStore>((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),
  addAgent: (agent) =>
    set((state) => ({
      agents: [...state.agents, agent],
    })),
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
  setStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),
}));
