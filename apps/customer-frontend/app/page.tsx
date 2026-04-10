import { RestaurantFeatureGrid } from '@/components/restaurant/restaurant-feature-grid';
import { RestaurantHomeHero } from '@/components/restaurant/restaurant-home-hero';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function Home() {
  const restaurant = await getCurrentRestaurant();

  return (
    <div className="min-h-screen lg:h-[100svh] lg:overflow-hidden">
      <div className="flex min-h-screen flex-col justify-center lg:h-full">
        <RestaurantHomeHero restaurant={restaurant} />
        <RestaurantFeatureGrid />
      </div>
    </div>
  );
}
