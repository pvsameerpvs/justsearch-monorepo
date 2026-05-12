import { PageHeader } from '@justsearch/ui';
import { AdminStats } from '@/components/admin-stats';
import { RestaurantManager } from '@/components/restaurant/restaurant-manager';
import { GameManager } from '@/components/game/game-manager';

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
        <GameManager />
      </div>
    </div>
  );
}
