import { Star } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { Restaurant } from '@/lib/restaurant-types';

type RestaurantReviewSummaryCardProps = {
  restaurant: Restaurant;
  verifiedCount: number;
};

export function RestaurantReviewSummaryCard({
  restaurant,
  verifiedCount,
}: RestaurantReviewSummaryCardProps) {
  return (
    <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(var(--brand-soft),0.42),rgba(255,255,255,0.96))] p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
        Reputation snapshot
      </p>
      <h2 className="mt-3 font-display text-5xl font-semibold tracking-[-0.08em] text-[rgb(var(--ink))]">
        {restaurant.overallRating.toFixed(1)}
      </h2>
      <div className="mt-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className="h-5 w-5 fill-amber-400 text-amber-400"
          />
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-[rgb(var(--muted))]">
        {restaurant.totalReviews}+ Google reviews for {restaurant.name}. This
        area can later connect to a live Google review feed.
      </p>

      <div className="mt-6 rounded-[24px] border border-[rgba(var(--card-border),0.86)] bg-[rgba(var(--card-surface),0.82)] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Verified voices
        </p>
        <p className="mt-2 text-lg font-semibold text-[rgb(var(--ink))]">
          {verifiedCount} highlighted guest reviews
        </p>
      </div>
    </Surface>
  );
}
