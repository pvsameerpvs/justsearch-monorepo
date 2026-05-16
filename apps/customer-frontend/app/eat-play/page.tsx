import { RestaurantEatPlayShowcase } from '@/components/restaurant/restaurant-eat-play-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { PLATFORM_GAMES } from '@/lib/constants/games.constants';
import { fetchActiveGames } from '@/lib/api/games.api';

export default async function EatPlayPage() {
  const restaurant = await getCurrentRestaurant();
  const activeGameNames = await fetchActiveGames();

  const games = PLATFORM_GAMES.map((g) => ({
    ...g,
    isAvailable: activeGameNames.length > 0 ? activeGameNames.includes(g.name) : g.isAvailable,
  }));

  return <RestaurantEatPlayShowcase restaurant={{ ...restaurant, games }} />;
}
