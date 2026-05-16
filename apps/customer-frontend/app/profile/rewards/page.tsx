"use client";

import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';

export default function ProfileRewardsPage() {
  const { points } = useLoyaltyPoints();

  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Surface className="rounded-[32px] border-white/70 bg-white/90 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
              Rewards
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))]">
              Your points
            </h1>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              Total points: <span className="font-semibold text-[rgb(var(--ink))]">{points}</span>
            </p>
          </Surface>

          <Surface className="rounded-[28px] border-white/70 bg-white/90 p-8 text-center">
            <p className="font-display text-lg font-semibold text-[rgb(var(--ink))]">
              Rewards coming soon
            </p>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Play games to earn points. Rewards will be available here once the restaurant configures them.
            </p>
          </Surface>
        </div>
      </Container>
    </section>
  );
}

