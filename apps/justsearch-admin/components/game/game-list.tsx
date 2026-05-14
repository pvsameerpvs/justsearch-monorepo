import { GameCard } from './game-card';
import { GameEmpty } from './game-empty';
import type { AdminGame } from '@/lib/stores/game-store';

interface GameListProps {
  games: AdminGame[];
  onToggleAvailability: (id: string) => void;
}

export function GameList({ games, onToggleAvailability }: GameListProps) {
  if (games.length === 0) return <GameEmpty />;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onToggleAvailability={onToggleAvailability} />
      ))}
    </div>
  );
}
