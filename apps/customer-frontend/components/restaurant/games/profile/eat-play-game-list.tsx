import type { Game } from '@/lib/restaurant-types';
import type { GameStat } from '@/components/restaurant/use-user-game-stats';
import { EatPlayGameStatCard } from './eat-play-game-stat-card';

interface GameSnapshot {
  game: Game;
  stat: GameStat;
}

interface EatPlayGameListProps {
  snapshots: GameSnapshot[];
}

export function EatPlayGameList({ snapshots }: EatPlayGameListProps) {
  return (
    <div className="space-y-4 px-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-4 w-1 rounded-full bg-[rgb(var(--brand))]" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-[rgb(var(--muted))]">Available Games</h2>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[rgb(var(--brand))] shadow-sm ring-1 ring-black/[0.05]">{snapshots.length} Challenges</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-1">
        {snapshots.map((snapshot) => (
          <EatPlayGameStatCard key={snapshot.game.id} game={snapshot.game} stat={snapshot.stat} />
        ))}
      </div>
    </div>
  );
}
