"use client";

import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { useLoyaltyPoints } from '@/components/restaurant/use-loyalty-points';

const rewards = [
  { title: 'Free dessert', cost: 600, note: 'Unlock after your next visit (demo)' },
  { title: '10% off main dish', cost: 1200, note: 'Valid once (demo)' },
  { title: 'Chef’s surprise', cost: 2000, note: 'Limited offer (demo)' },
] as const;

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
              Your offers (demo)
            </h1>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              Total points: <span className="font-semibold text-[rgb(var(--ink))]">{points}</span>
            </p>
          </Surface>

          <div className="grid gap-4">
            {rewards.map((reward) => {
              const unlocked = points >= reward.cost;
              return (
                <Surface
                  key={reward.title}
                  className="rounded-[28px] border-white/70 bg-white/90 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-xl font-semibold text-[rgb(var(--ink))]">
                        {reward.title}
                      </p>
                      <p className="mt-2 text-sm text-[rgb(var(--muted))]">{reward.note}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        unlocked
                          ? 'bg-[rgba(16,185,129,0.14)] text-emerald-700'
                          : 'bg-[rgba(148,163,184,0.18)] text-slate-600'
                      }`}
                    >
                      {unlocked ? 'Unlocked' : `Need ${reward.cost}`}
                    </span>
                  </div>

                  {!unlocked ? (
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[rgb(var(--brand))]"
                        style={{
                          width: `${Math.min(100, (points / reward.cost) * 100)}%`,
                        }}
                      />
                    </div>
                  ) : null}
                </Surface>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

