import { RestaurantEatPlayShowcase } from '@/components/restaurant/restaurant-eat-play-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function getActiveGames(): Promise<string[]> {
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
  const activeGameNames = await getActiveGames();

  const games = activeGameNames.length > 0
    ? restaurant.games.map((g) => ({ ...g, isAvailable: activeGameNames.includes(g.name) }))
    : restaurant.games;

  return <RestaurantEatPlayShowcase restaurant={{ ...restaurant, games }} />;
}
