import { RestaurantSocialMediaShowcase } from '@/components/restaurant/restaurant-social-media-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export default async function SocialMediaPage() {
  const restaurant = await getCurrentRestaurant();

  return <RestaurantSocialMediaShowcase restaurant={restaurant} />;
}
