import { PageHeader } from '@justsearch/ui';
import { WelcomeBar } from '@/components/dashboard/welcome-bar';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { DashboardStats } from '@/components/dashboard-stats';
import { RecentOrders } from '@/components/recent-orders';
import { TopMenuItems } from '@/components/top-menu-items';
import { getCurrentRestaurant } from '@/lib/get-current-restaurant';

export default async function DashboardPage() {
  const restaurant = await getCurrentRestaurant();

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
