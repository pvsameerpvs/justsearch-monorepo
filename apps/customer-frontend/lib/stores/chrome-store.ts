"use client";

import { useEffect } from "react";
import { create } from "zustand";

interface ChromeStore {
  refCount: number;
  hide: () => void;
  show: () => void;
}

export const useChromeStore = create<ChromeStore>((set, get) => ({
  refCount: 0,
  hide: () => set({ refCount: get().refCount + 1 }),
  show: () => set({ refCount: Math.max(0, get().refCount - 1) }),
}));

/**
 * Call this inside any fullscreen overlay / immersive component.
 * It hides the mobile header, bottom nav, order tracker, and reward manager.
 * Uses reference counting so multiple overlapping overlays work safely:
 * chrome stays hidden until ALL immersive components unmount.
 */
export function useImmersiveMode() {
  useEffect(() => {
    useChromeStore.getState().hide();
    return () => {
      useChromeStore.getState().show();
    };
  }, []);
}
