"use client";

import { PageHeader } from "@justsearch/ui";
import { useRestaurantProfile } from "@/lib/hooks/use-restaurant-profile";
import { WelcomeBar } from "@/components/dashboard/welcome-bar";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentOrders } from "@/components/recent-orders";
import { TopMenuItems } from "@/components/top-menu-items";

export default function DashboardPage() {
  const { restaurant, isLoading } = useRestaurantProfile();

  if (isLoading || !restaurant) {
    return (
      <div className="space-y-6">
        <div className="h-20 rounded-2xl bg-slate-200 animate-pulse" />
        <PageHeader title="Dashboard" description="Loading..." />
        <div className="h-32 rounded-xl bg-slate-200 animate-pulse" />
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
