import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantPageHero } from './restaurant-page-hero';
import { RestaurantReviewCard } from './restaurant-review-card';
import { RestaurantReviewSummaryCard } from './restaurant-review-summary-card';

type RestaurantReviewsShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantReviewsShowcase({
  restaurant,
}: RestaurantReviewsShowcaseProps) {
  const verifiedCount = restaurant.reviews.filter((review) => review.verified).length;

  return (
    <>
      <RestaurantPageHero
        restaurant={restaurant}
        eyebrow="Google reviews"
        title="A review page built for restaurant trust and conversion."
        description="This page gives every restaurant a consistent place to show rating, review count, and the latest guest voice without building a new layout for every tenant."
        stats={[
          { label: 'Rating', value: restaurant.overallRating.toFixed(1) },
          { label: 'Review count', value: `${restaurant.totalReviews}+` },
          { label: 'Verified sample', value: String(verifiedCount) },
        ]}
        action={
          <>
            <ButtonLink href="/social-media" variant="primary" size="md">
              Social media
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" size="md">
              Back to home
            </ButtonLink>
          </>
        }
      />

      <section className="pb-14 sm:pb-16">
        <Container>
          <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
            <RestaurantReviewSummaryCard
              restaurant={restaurant}
              verifiedCount={verifiedCount}
            />

            <div className="grid gap-6">
              {restaurant.reviews.map((review) => (
                <RestaurantReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
