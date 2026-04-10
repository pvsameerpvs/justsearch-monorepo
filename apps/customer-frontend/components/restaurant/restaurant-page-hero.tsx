import type { ReactNode } from 'react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantPageInfoPanel } from './restaurant-page-info-panel';
import {
  RestaurantPageStats,
  type RestaurantPageStat,
} from './restaurant-page-stats';

type RestaurantPageHeroProps = {
  restaurant: Restaurant;
  eyebrow: string;
  title: string;
  description: string;
  stats: readonly RestaurantPageStat[];
  action?: ReactNode;
};

export function RestaurantPageHero({
  restaurant,
  eyebrow,
  title,
  description,
  stats,
  action,
}: RestaurantPageHeroProps) {
  return (
    <section className="pt-8 pb-6 sm:pt-10 sm:pb-8">
      <Container>
        <Surface className="overflow-hidden rounded-[32px] border-[rgba(var(--card-border),0.9)] bg-[linear-gradient(140deg,rgba(var(--brand-soft),0.34),rgba(var(--card-surface),0.95),rgba(var(--accent-soft),0.42))] p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-[rgba(var(--card-border),0.86)] bg-[rgba(var(--card-surface),0.84)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand))]">
                  {eyebrow}
                </span>
                <h1 className="font-display text-4xl font-semibold tracking-[-0.08em] text-[rgb(var(--ink))] sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[rgb(var(--muted))]">
                  {description}
                </p>
              </div>

              <RestaurantPageStats stats={stats} />

              {action ? (
                <div className="flex flex-wrap gap-3">{action}</div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/" variant="secondary" size="md">
                    Back to home
                  </ButtonLink>
                </div>
              )}
            </div>

            <RestaurantPageInfoPanel restaurant={restaurant} />
          </div>
        </Surface>
      </Container>
    </section>
  );
}
