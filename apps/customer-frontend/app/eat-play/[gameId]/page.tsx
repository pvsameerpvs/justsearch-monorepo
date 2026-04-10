import { notFound } from 'next/navigation';
import { RestaurantGameScreen } from '@/components/restaurant/restaurant-game-screen';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';

type GamePageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const restaurant = await getCurrentRestaurant();
  const game = restaurant.games.find((item) => item.id === gameId);

  if (!game) {
    notFound();
  }

  return <RestaurantGameScreen restaurant={restaurant} game={game} />;
}
