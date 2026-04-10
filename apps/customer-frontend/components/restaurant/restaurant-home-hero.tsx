import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { getRestaurantDomain } from '@/lib/restaurant-utils';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantLogoBadge } from './restaurant-logo-badge';

type RestaurantHomeHeroProps = {
  restaurant: Restaurant;
};

export function RestaurantHomeHero({ restaurant }: RestaurantHomeHeroProps) {
  const domain = getRestaurantDomain(restaurant);

  return (
    <section className="pt-6 pb-4 sm:pt-8 sm:pb-6 lg:pt-5 lg:pb-3">
      <Container>
        <Surface className="mx-auto max-w-5xl rounded-[32px] border-[rgba(var(--card-border),0.9)] bg-[linear-gradient(145deg,rgba(var(--brand-soft),0.45),rgba(var(--card-surface),0.96),rgba(var(--accent-soft),0.48))] p-6 sm:p-8 lg:p-5">
          <div className="flex flex-col items-center gap-5 text-center sm:gap-6 lg:gap-4">
            <RestaurantLogoBadge restaurant={restaurant} size="lg" />
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                Restaurant Logo
              </p>
              <h2 className="font-display text-4xl font-semibold tracking-[-0.08em] text-[rgb(var(--ink))] sm:text-5xl lg:text-4xl xl:text-5xl">
                {restaurant.name}
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 sm:text-base lg:text-sm lg:leading-5">
                {restaurant.tagline}
              </p>
              <p className="text-xs text-slate-500 sm:text-sm">{domain}</p>
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}
