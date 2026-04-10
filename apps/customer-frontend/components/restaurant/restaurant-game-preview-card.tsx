import Link from 'next/link';
import { Surface } from '@/components/shared/surface';
import type { Game } from '@/lib/restaurant-types';

type RestaurantGamePreviewCardProps = { game: Game };

const defaultGameCovers: Record<string, string> = {
  'spin-wheel': '/games/spin-wheel.svg',
  'scratch-card': '/games/scratch-card.svg',
  'tap-challenge': '/games/tap-challenge.svg',
  'quick-quiz': '/games/quick-quiz.svg',
};

export function RestaurantGamePreviewCard({
  game,
}: RestaurantGamePreviewCardProps) {
  const coverImageUrl = game.coverImageUrl ?? defaultGameCovers[game.id];

  return (
    <Link
      href={`/eat-play/${game.id}`}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label={`Play ${game.name}`}
    >
      <Surface className="flex h-full flex-col overflow-hidden rounded-[18px] border-[rgba(var(--border),0.9)] bg-white/90 p-0 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_46px_rgba(15,23,42,0.10)]">
        <div className="bg-white p-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] border border-[rgba(var(--border),0.9)] bg-[rgba(var(--card-surface-muted),0.9)]">
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt={game.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(140deg,rgba(var(--brand-soft),0.55),rgba(var(--accent-soft),0.45))] text-6xl">
                <span aria-hidden="true">{game.icon}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-4 pt-1">
          <h3 className="text-base font-semibold tracking-tight text-[rgb(var(--ink))] group-hover:text-[rgb(var(--brand))]">
            {game.name}
          </h3>
        </div>
      </Surface>
    </Link>
  );
}
