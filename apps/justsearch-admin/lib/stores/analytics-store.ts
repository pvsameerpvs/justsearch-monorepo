import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "all";

export interface AnalyticsSummary {
  totalRestaurants: number;
  activeRestaurants: number;
  totalUsers: number;
  activeUsers: number;
  totalGamePoints: number;
  totalAdRevenue: number;
  totalAdImpressions: number;
  activeCampaigns: number;
  totalCampaigns: number;
  totalOrders: number;
  totalViews: number;
  avgPointsPerUser: number;
}

export interface MonthlyDataPoint {
  month: string;
  revenue: number;
  users: number;
  restaurants: number;
  orders: number;
}

interface AnalyticsStore {
  period: AnalyticsPeriod;
  setPeriod: (p: AnalyticsPeriod) => void;
  monthlyData: MonthlyDataPoint[];
}

const MONTHLY_DATA: MonthlyDataPoint[] = [
  { month: "Jan", revenue: 32000, users: 1200, restaurants: 8, orders: 890 },
  { month: "Feb", revenue: 34500, users: 1500, restaurants: 9, orders: 1020 },
  { month: "Mar", revenue: 31000, users: 1800, restaurants: 10, orders: 1150 },
  { month: "Apr", revenue: 38000, users: 2200, restaurants: 11, orders: 1340 },
  { month: "May", revenue: 45000, users: 2847, restaurants: 12, orders: 1580 },
  { month: "Jun", revenue: 52000, users: 3200, restaurants: 14, orders: 1720 },
];

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      period: "30d",
      setPeriod: (p) => set({ period: p }),
      monthlyData: MONTHLY_DATA,
    }),
    { name: "justsearch-admin-analytics" }
  )
);
