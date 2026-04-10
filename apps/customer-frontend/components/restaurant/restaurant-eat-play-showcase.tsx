import { Joystick, ScanLine, Soup, Trophy } from 'lucide-react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantGamePreviewCard } from './restaurant-game-preview-card';
import { RestaurantJourneyStepCard } from './restaurant-journey-step-card';
import { RestaurantPageHero } from './restaurant-page-hero';

type RestaurantEatPlayShowcaseProps = {
  restaurant: Restaurant;
};

const journeySteps = [
  {
    step: '01',
    title: 'Discover',
    description:
      'Guests land on the restaurant subdomain and immediately see branded content.',
    icon: ScanLine,
  },
  {
    step: '02',
    title: 'Eat',
    description:
      'Menu, reviews, and social proof help customers decide faster and stay longer.',
    icon: Soup,
  },
  {
    step: '03',
    title: 'Play',
    description:
      'Games, loyalty ideas, and engagement can be switched on per restaurant later.',
    icon: Trophy,
  },
] as const;

export function RestaurantEatPlayShowcase({
  restaurant,
}: RestaurantEatPlayShowcaseProps) {
  const availableGames = restaurant.games.filter((game) => game.isAvailable);

  return (
    <>
      <RestaurantPageHero
        restaurant={restaurant}
        eyebrow="Eat, play"
        title="A single page for dining energy and game-led engagement."
        description="This route is designed for restaurants that want food and fun to sit beside each other. The page stays visually rich now, and backend session rules can be connected later."
        stats={[
          { label: 'Live concepts', value: String(availableGames.length) },
          { label: 'Unlocked by', value: 'Restaurant rules' },
          { label: 'Best for', value: 'In-store discovery' },
        ]}
        action={
          <>
            <ButtonLink href="/menu" variant="primary" size="md">
              View menu
            </ButtonLink>
            <ButtonLink href="/google-reviews" variant="secondary" size="md">
              Read reviews
            </ButtonLink>
          </>
        }
      />

      <section className="pb-14 sm:pb-16">
        <Container>
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Surface className="rounded-[32px] border-white/70 bg-white/88 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft))]">
                  <Joystick className="h-5 w-5 text-[rgb(var(--brand))]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
                    Guest journey
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                    Discover, dine, and play.
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {journeySteps.map((step) => (
                  <RestaurantJourneyStepCard
                    key={step.step}
                    step={step.step}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                  />
                ))}
              </div>
            </Surface>

            <div className="grid gap-6 md:grid-cols-2">
              {availableGames.map((game) => (
                <RestaurantGamePreviewCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
