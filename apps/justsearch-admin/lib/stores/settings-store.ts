export type { SettingsStore, PlatformSettings, NotificationSettings, SecuritySettings, RestaurantDefaults, RevenueSettings, GameSettings, BillingSettings, SettingsTab } from "./settings-types";

export { DEFAULTS } from "./settings-defaults";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SettingsStore } from "./settings-types";
import { DEFAULTS } from "./settings-defaults";

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
