import { PageHeader } from '@justsearch/ui';
import { DashboardStats } from '@/components/dashboard-stats';
import { RecentOrders } from '@/components/recent-orders';
import { OrderAssignment } from '@/components/orders/order-assignment';
import { TopMenuItems } from '@/components/top-menu-items';
import { RestaurantHero } from '@/components/restaurant-hero';
import { RestaurantInfoCard } from '@/components/restaurant-info-card';
import { OpeningHoursSection } from '@/components/opening-hours-section';
import { SocialLinksSection } from '@/components/social-links-section';
import { getCurrentRestaurant } from '@/lib/get-current-restaurant';

export default async function DashboardPage() {
  const restaurant = await getCurrentRestaurant();

  return (
    <div className="space-y-6">
      <RestaurantHero restaurant={restaurant} />
      <PageHeader title="Dashboard" description={`Overview of ${restaurant.name} today`} />
      <DashboardStats restaurant={restaurant} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RestaurantInfoCard restaurant={restaurant} />
        <div className="space-y-6">
          <OpeningHoursSection restaurant={restaurant} />
          <SocialLinksSection restaurant={restaurant} />
        </div>
      </div>

      <OrderAssignment />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders />
        <TopMenuItems />
      </div>
    </div>
  );
}
