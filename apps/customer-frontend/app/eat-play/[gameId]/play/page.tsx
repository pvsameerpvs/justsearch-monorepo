import { RestaurantGameScreen } from '@/components/restaurant/restaurant-game-screen';
import { getGameByIdOrNotFound } from '../_lib/get-game-by-id';

type GamePlayPageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GamePlayPage({ params }: GamePlayPageProps) {
  const { gameId } = await params;
  const game = await getGameByIdOrNotFound(gameId);

  return <RestaurantGameScreen game={game} mode="play" />;
}
