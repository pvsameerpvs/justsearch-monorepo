import {
  Store,
  Users,
  DollarSign,
  Megaphone,
  Gamepad2,
  Trophy,
} from "lucide-react";

import type { DashboardStats } from "../types/dashboard-types";

export interface StatMetaItem {
  label: string;
  key: keyof DashboardStats;
  subKey: keyof DashboardStats;
  subLabel: string;
  icon: typeof Store;
  gradient: string;
  text: string;
}

export const DASHBOARD_STAT_META: StatMetaItem[] = [
  { label: "Restaurants", key: "restaurants", subKey: "activeRestaurants", subLabel: "active", icon: Store, gradient: "from-blue-500 to-sky-500", text: "text-blue-700" },
  { label: "Users", key: "totalUsers", subKey: "activeUsers", subLabel: "active", icon: Users, gradient: "from-indigo-500 to-violet-500", text: "text-indigo-700" },
  { label: "Revenue", key: "totalRevenue", subKey: "totalOrders", subLabel: "orders", icon: DollarSign, gradient: "from-emerald-500 to-teal-500", text: "text-emerald-700" },
  { label: "Campaigns", key: "totalCampaigns", subKey: "activeCampaigns", subLabel: "active", icon: Megaphone, gradient: "from-amber-500 to-orange-500", text: "text-amber-700" },
  { label: "Games", key: "totalGames", subKey: "activeGames", subLabel: "live", icon: Gamepad2, gradient: "from-purple-500 to-fuchsia-500", text: "text-purple-700" },
  { label: "Game Points", key: "totalPoints", subKey: "totalImpressions", subLabel: "impressions", icon: Trophy, gradient: "from-rose-500 to-pink-500", text: "text-rose-700" },
];

export const DASHBOARD_CHART_GRADIENT_ID = "dashRevenue";
