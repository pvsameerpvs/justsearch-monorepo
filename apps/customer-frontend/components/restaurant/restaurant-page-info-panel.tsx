import { getRestaurantDomain } from '@/lib/restaurant-resolver';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantLogoBadge } from './restaurant-logo-badge';

type RestaurantPageInfoPanelProps = {
  restaurant: Restaurant;
};

export function RestaurantPageInfoPanel({
  restaurant,
}: RestaurantPageInfoPanelProps) {
  const domain = getRestaurantDomain(restaurant);

  return (
    <div className="rounded-[32px] border border-[rgb(var(--card-border)/0.86)] bg-[rgb(var(--card-surface)/0.82)] p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-4">
        <RestaurantLogoBadge restaurant={restaurant} size="lg" />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
            Restaurant
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
            {restaurant.name}
          </h2>
          <p className="text-sm text-[rgb(var(--muted))]">{restaurant.city}</p>
        </div>
      </div>

      <div className="mt-6 rounded-[24px] border border-[rgb(var(--border)/0.75)] bg-[rgb(var(--card-surface-muted)/0.92)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Subdomain route
        </p>
        <p className="mt-2 font-display text-lg font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
          {domain}
        </p>
        <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
          Every page under this route keeps the same URL structure: home, menu,
          eat-play, reviews, and social media.
        </p>
      </div>
    </div>
  );
}
