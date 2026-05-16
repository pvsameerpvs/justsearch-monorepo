import { RestaurantEatPlayShowcase } from '@/components/restaurant/restaurant-eat-play-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { PLATFORM_GAMES } from '@/lib/constants/games.constants';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getActiveGameNames(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/games/active`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json() as { games: { id: string; name: string }[] };
    return data.games.map((g) => g.name);
  } catch {
    return [];
  }
}

export default async function EatPlayPage() {
  const restaurant = await getCurrentRestaurant();
  const activeGameNames = await getActiveGameNames();

  const games = PLATFORM_GAMES.map((g) => ({
    ...g,
    isAvailable: activeGameNames.length > 0 ? activeGameNames.includes(g.name) : g.isAvailable,
  }));

  return <RestaurantEatPlayShowcase restaurant={{ ...restaurant, games }} />;
}
