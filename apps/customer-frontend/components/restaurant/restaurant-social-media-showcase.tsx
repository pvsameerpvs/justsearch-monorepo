import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantContactPanel } from './restaurant-contact-panel';
import { RestaurantOpeningHoursPanel } from './restaurant-opening-hours-panel';
import { RestaurantPageHero } from './restaurant-page-hero';
import { RestaurantSocialLinkCard } from './restaurant-social-link-card';

type RestaurantSocialMediaShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantSocialMediaShowcase({
  restaurant,
}: RestaurantSocialMediaShowcaseProps) {
  return (
    <>
      <RestaurantPageHero
        restaurant={restaurant}
        eyebrow="Social media links"
        title="A social links page that feels like part of the restaurant brand."
        description="This page keeps all public channels in one polished place so each restaurant can swap handles, links, and contact info without redesigning the experience."
        stats={[
          { label: 'Platforms', value: String(restaurant.socials.length) },
          { label: 'City', value: restaurant.city },
          { label: 'Reach path', value: 'Public profile' },
        ]}
        action={
          <>
            <ButtonLink href="/google-reviews" variant="primary" size="md">
              Read reviews
            </ButtonLink>
            <ButtonLink href="/" variant="secondary" size="md">
              Back to home
            </ButtonLink>
          </>
        }
      />

      <section className="pb-14 sm:pb-16">
        <Container>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-6 md:grid-cols-2">
              {restaurant.socials.map((social) => (
                <RestaurantSocialLinkCard
                  key={social.platform}
                  social={social}
                />
              ))}
            </div>

            <div className="space-y-6">
              <RestaurantContactPanel restaurant={restaurant} />
              <RestaurantOpeningHoursPanel
                openingHours={restaurant.openingHours}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
