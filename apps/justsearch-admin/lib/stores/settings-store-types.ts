export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  primaryColor: string;
}

export interface NotificationSettings {
  newOrderAlert: boolean;
  paymentFailure: boolean;
  weeklyReport: boolean;
}

export interface SecuritySettings {
  require2FA: boolean;
  sessionTimeoutMinutes: number;
}

export interface RestaurantDefaults {
  autoActivate: boolean;
  requireKYC: boolean;
}

export interface RevenueSettings {
  restaurantAdSplit: number;
  platformAdSplit: number;
  subscriptionPriceAED: number;
  taxPercent: number;
}

export interface GameSettings {
  maxPointsPerGame: number;
  allowSponsorAds: boolean;
}

export interface BillingSettings {
  stripePublicKey: string;
  stripeSecretKey: string;
}

export type SettingsTab = "general" | "notifications" | "security" | "restaurants" | "revenue" | "games" | "billing";

export interface SettingsStore {
  platform: PlatformSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  restaurantDefaults: RestaurantDefaults;
  revenue: RevenueSettings;
  games: GameSettings;
  billing: BillingSettings;
  updatePlatform: (p: Partial<PlatformSettings>) => void;
  updateNotifications: (n: Partial<NotificationSettings>) => void;
  updateSecurity: (s: Partial<SecuritySettings>) => void;
  updateRestaurantDefaults: (r: Partial<RestaurantDefaults>) => void;
  updateRevenue: (r: Partial<RevenueSettings>) => void;
  updateGames: (g: Partial<GameSettings>) => void;
  updateBilling: (b: Partial<BillingSettings>) => void;
}

export const DEFAULTS: Omit<SettingsStore, `update${string}`> = {
  platform: {
    platformName: "JustSearch",
    supportEmail: "support@justsearch.ae",
    supportPhone: "+971 4 123 4567",
    defaultCurrency: "AED",
    primaryColor: "#4f46e5",
  },
  notifications: {
    newOrderAlert: true,
    paymentFailure: true,
    weeklyReport: true,
  },
  security: {
    require2FA: false,
    sessionTimeoutMinutes: 60,
  },
  restaurantDefaults: {
    autoActivate: false,
    requireKYC: true,
  },
  revenue: {
    restaurantAdSplit: 60,
    platformAdSplit: 40,
    subscriptionPriceAED: 499,
    taxPercent: 5,
  },
  games: {
    maxPointsPerGame: 3000,
    allowSponsorAds: true,
  },
  billing: {
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
  },
};
