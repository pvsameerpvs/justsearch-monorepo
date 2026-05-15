export { useRestaurantsQuery } from "./use-restaurants-query";
export type { ApiRestaurant } from "./use-restaurants-query";

export { useGamesQuery, useCreateGameMutation, useUpdateGameMutation, useDeleteGameMutation } from "./use-games-query";

export { useAdsQuery, useCreateAdMutation, useUpdateAdMutation, useDeleteAdMutation } from "./use-ads-query";
export type { AdCampaign, AdCampaignFormData } from "@/lib/stores/ad-campaign-types";

export { useAnalyticsAdminQuery } from "./use-analytics-admin-query";
export type { AnalyticsResponse, MonthlyDataPoint } from "./use-analytics-admin-query";

export { useRevenueAdminQuery } from "./use-revenue-admin-query";
export type { RevenueResponse } from "./use-revenue-admin-query";

export { useUsersAdminQuery } from "./use-users-admin-query";
export type { AdminUser } from "./use-users-admin-query";
