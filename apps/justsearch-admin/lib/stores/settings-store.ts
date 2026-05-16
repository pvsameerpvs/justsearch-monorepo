export * from './settings-store-types';
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type SettingsStore, DEFAULTS } from "./settings-store-types";

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      updatePlatform: (p) => set((s) => ({ platform: { ...s.platform, ...p } })),
      updateNotifications: (n) => set((s) => ({ notifications: { ...s.notifications, ...n } })),
      updateSecurity: (se) => set((s) => ({ security: { ...s.security, ...se } })),
      updateRestaurantDefaults: (r) => set((s) => ({ restaurantDefaults: { ...s.restaurantDefaults, ...r } })),
      updateRevenue: (r) => set((s) => ({ revenue: { ...s.revenue, ...r } })),
      updateGames: (g) => set((s) => ({ games: { ...s.games, ...g } })),
      updateBilling: (b) => set((s) => ({ billing: { ...s.billing, ...b } })),
    }),
    { name: "justsearch-admin-settings" }
  )
);
