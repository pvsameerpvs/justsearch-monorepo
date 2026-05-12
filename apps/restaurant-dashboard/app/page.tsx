import { PageHeader } from '@justsearch/ui';
import { DashboardStats } from '@/components/dashboard-stats';
import { RecentOrders } from '@/components/recent-orders';
import { OrderAssignment } from '@/components/orders/order-assignment';
import { TopMenuItems } from '@/components/top-menu-items';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your restaurant today" />
      <DashboardStats />
      <OrderAssignment />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <TopMenuItems />
      </div>
    </div>
  );
}
