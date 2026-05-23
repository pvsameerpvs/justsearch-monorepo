import { RestaurantEatPlayShowcase } from '@/components/restaurant/restaurant-eat-play-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { headers } from 'next/headers';
import { PLATFORM_GAMES } from '@/lib/constants/games.constants';
import { fetchActiveGames } from '@/lib/api/games.api';

export default async function EatPlayPage() {
  const restaurant = await getCurrentRestaurant();
  const headerStore = await headers();
  const host = headerStore.get('host') ?? '';
  const { names: activeGameNames, ok } = await fetchActiveGames(host);

  const games = PLATFORM_GAMES.map((g) => ({
    ...g,
    // If API call succeeded, use whatever it returned (even if empty = no games active)
    // If API call failed, fall back to hardcoded isAvailable
    isAvailable: ok ? activeGameNames.includes(g.name) : g.isAvailable,
  }));

  return <RestaurantEatPlayShowcase restaurant={{ ...restaurant, games }} />;
}
