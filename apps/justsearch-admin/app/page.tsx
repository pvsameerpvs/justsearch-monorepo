import { PageHeader } from '@justsearch/ui';
import { AdminStats } from '@/components/admin-stats';
import { RestaurantManager } from '@/components/restaurant/restaurant-manager';
import { GameContainer } from '@/components/game';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Dashboard"
        description="JustSearch super admin control center"
      />
      <AdminStats />
      <div className="grid gap-6 lg:grid-cols-2">
        <RestaurantManager />
        <GameContainer />
      </div>
    </div>
  );
}
