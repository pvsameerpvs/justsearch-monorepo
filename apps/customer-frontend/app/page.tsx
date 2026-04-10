import { RestaurantFeatureGrid } from '@/components/restaurant/restaurant-feature-grid';
import { RestaurantHomeHero } from '@/components/restaurant/restaurant-home-hero';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function Home() {
  const restaurant = await getCurrentRestaurant();

  return (
    <div className="min-h-screen">
      <RestaurantHomeHero restaurant={restaurant} />
      <RestaurantFeatureGrid />
    </div>
  );
}
