import { Surface } from '@/components/shared/surface';
import type { Game } from '@/lib/restaurant-types';

type RestaurantGamePreviewCardProps = {
  game: Game;
};

function getAccessLabel(accessLevel: Game['accessLevel']) {
  if (accessLevel === 'public') {
    return 'Public';
  }

  if (accessLevel === 'login_required') {
    return 'Login required';
  }

  return 'Session required';
}

export function RestaurantGamePreviewCard({
  game,
}: RestaurantGamePreviewCardProps) {
  return (
    <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(var(--accent-soft),0.34))] p-6">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-[22px] bg-white text-2xl shadow-sm">
        <span aria-hidden="true">{game.icon}</span>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
        {getAccessLabel(game.accessLevel)}
      </p>
      <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
        {game.name}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
        {game.description}
      </p>

      <div className="mt-5 rounded-[22px] border border-[rgba(var(--card-border),0.86)] bg-[rgba(var(--card-surface),0.8)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Prize preview
        </p>
        <p className="mt-2 text-lg font-semibold text-[rgb(var(--ink))]">
          {game.prize}
        </p>
      </div>
    </Surface>
  );
}
