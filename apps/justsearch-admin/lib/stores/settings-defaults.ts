import type { SettingsStore } from "./settings-types";

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
