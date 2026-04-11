import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantSocialLinkCard } from './restaurant-social-link-card';

type RestaurantSocialMediaShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantSocialMediaShowcase({
  restaurant,
}: RestaurantSocialMediaShowcaseProps) {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <Surface className="rounded-[32px] border-white/70 bg-white/90 p-6 text-center sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
              Social media
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))] sm:text-4xl">
              {restaurant.name}
            </h1>
            <p className="mt-3 text-sm font-medium text-[rgb(var(--muted))]">
              Follow the restaurant on your favorite channels.
            </p>
          </Surface>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {restaurant.socials.map((social) => (
              <RestaurantSocialLinkCard key={social.platform} social={social} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
