"use client";

import { PageHeader } from "@justsearch/ui";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRestaurantProfile } from "@/lib/hooks/use-restaurant-profile";
import { WelcomeBar } from "@/components/dashboard/welcome-bar";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentOrders } from "@/components/recent-orders";
import { TopMenuItems } from "@/components/top-menu-items";

export default function DashboardPage() {
  const { restaurant, isLoading, error } = useRestaurantProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
        <PageHeader title="Dashboard" description="Loading..." />
        <div className="h-32 rounded-xl bg-slate-200 animate-pulse" />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview" />
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50 py-12">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm font-semibold text-red-700">
            {error?.message || "Failed to load restaurant profile"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeBar restaurant={restaurant} />
      <PageHeader title="Dashboard" description={`Overview of ${restaurant.name} today`} />
      <QuickActions />
      <DashboardStats />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <TopMenuItems />
      </div>
    </div>
  );
}
