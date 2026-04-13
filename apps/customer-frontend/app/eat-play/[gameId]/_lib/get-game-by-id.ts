import { notFound } from 'next/navigation';
import type { Game } from '@/lib/restaurant-types';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

export async function getGameByIdOrNotFound(gameId: string): Promise<Game> {
  const restaurant = await getCurrentRestaurant();
  const game = restaurant.games.find((item) => item.id === gameId);

  if (!game) {
    notFound();
  }

  return game;
}
