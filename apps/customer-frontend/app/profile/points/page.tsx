"use client";

import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { ButtonLink } from '@/components/shared/button-link';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';

export default function ProfilePointsPage() {
  const { points } = useLoyaltyPoints();

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Surface className="rounded-[32px] border-white/70 bg-white/90 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
              Loyalty points
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))]">
              {points.toLocaleString()}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              Points are earned by playing games. Each game awards points based on your performance using a scoring formula.
            </p>
          </Surface>

          <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(140deg,rgb(var(--brand-soft)/0.25),rgba(255,255,255,0.92),rgb(var(--accent-soft)/0.22))] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--brand))]">
              Earn more
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Play a game to increase your points.
            </p>
            <div className="mt-4">
              <ButtonLink href="/eat-play" variant="primary" size="md">
                Go to games
              </ButtonLink>
            </div>
          </Surface>
        </div>
      </Container>
    </section>
  );
}
