import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantReviewCard } from './restaurant-review-card';
import { RestaurantReviewSummaryCard } from './restaurant-review-summary-card';
import { Star, ArrowLeft } from 'lucide-react';

type RestaurantReviewsShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantReviewsShowcase({
  restaurant,
}: RestaurantReviewsShowcaseProps) {
  const verifiedCount = restaurant.reviews.filter((review) => review.verified).length;

  return (
    <div className="min-h-screen bg-white pb-24">
      <Container className="pt-12 px-4">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">{restaurant.name}</h2>
            <div className="mt-2 flex items-center justify-center gap-2">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Google Reviews ({restaurant.overallRating.toFixed(1)})</p>
            </div>
        </div>

        {/* REVIEW SUMMARY CARD */}
        <div className="mb-12">
            <RestaurantReviewSummaryCard
                restaurant={restaurant}
                verifiedCount={verifiedCount}
            />
        </div>

        {/* REVIEWS GRID (Single Column for Mobile/Table) */}
        <div className="grid gap-4 sm:gap-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 text-center mb-4">
                Guest Feedback
            </h2>
            {restaurant.reviews.map((review) => (
                <RestaurantReviewCard key={review.id} review={review} />
            ))}
        </div>

        
      </Container>
    </div>
  );
}
