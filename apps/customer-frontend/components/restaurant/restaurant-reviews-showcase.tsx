import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantReviewCard } from './restaurant-review-card';
import { RestaurantReviewSummaryCard } from './restaurant-review-summary-card';
import { Star } from 'lucide-react';

type RestaurantReviewsShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantReviewsShowcase({
  restaurant,
}: RestaurantReviewsShowcaseProps) {
  const verifiedCount = restaurant.reviews.filter((review) => review.verified).length;

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <Surface className="rounded-[32px] border-white/70 bg-white/90 p-6 text-center sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
              Google reviews
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))] sm:text-4xl">
              {restaurant.name}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-[rgb(var(--muted))]">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{restaurant.overallRating.toFixed(1)} rating</span>
              <span className="text-slate-300">•</span>
              <span>{restaurant.totalReviews} reviews</span>
            </div>
          </Surface>

          <RestaurantReviewSummaryCard restaurant={restaurant} verifiedCount={verifiedCount} />

          <div className="grid gap-4 sm:gap-6">
            <p className="px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Guest feedback
            </p>
            {restaurant.reviews.map((review) => (
              <RestaurantReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
