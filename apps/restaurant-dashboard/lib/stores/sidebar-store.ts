"use client";

import { create } from 'zustand';

interface SidebarStore {
  isCollapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  isCollapsed: false,
  toggle: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (v) => set({ isCollapsed: v }),
}));
