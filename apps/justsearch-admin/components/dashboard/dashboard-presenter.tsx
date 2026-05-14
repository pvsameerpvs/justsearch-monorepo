import { DashboardStatsRow } from "./dashboard-stats-row";
import { DashboardRevenueChart } from "./dashboard-revenue-chart";
import { DashboardRestaurantsSnapshot } from "./dashboard-restaurants-snapshot";
import { DashboardCampaignSnapshot } from "./dashboard-campaign-snapshot";
import { DashboardActivityFeed } from "./dashboard-activity-feed";

import type { DashboardData } from "@/components/dashboard/types/dashboard-types";

export function DashboardPresenter({
  stats,
  monthlyData,
  topRestaurants,
  activeCampaigns,
  recentUsers,
}: DashboardData) {
  return (
    <div className="space-y-5">
      <DashboardStatsRow stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <DashboardRevenueChart data={monthlyData} />
        </div>
        <DashboardActivityFeed users={recentUsers} totalPoints={stats.totalPoints} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DashboardRestaurantsSnapshot restaurants={topRestaurants} />
        <DashboardCampaignSnapshot campaigns={activeCampaigns} />
      </div>
    </div>
  );
}
