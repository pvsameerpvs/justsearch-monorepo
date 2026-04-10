import { RestaurantReviewsShowcase } from '@/components/restaurant/restaurant-reviews-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function GoogleReviewsPage() {
  const restaurant = await getCurrentRestaurant();

  return <RestaurantReviewsShowcase restaurant={restaurant} />;
}
