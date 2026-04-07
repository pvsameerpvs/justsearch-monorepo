import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { Pill } from '@/components/shared/pill';
import { Surface } from '@/components/shared/surface';
import { demoRestaurant } from '@/lib/demo-data';
import { formatPoints } from '@/lib/format';
import { Coins, Gift, Trophy } from 'lucide-react';

export function WalletBanner() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(15,118,110,0.96),rgba(11,79,73,0.96))] p-8 text-white sm:p-10">
              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-white/10 blur-3xl" />
              <div className="relative space-y-6">
                <Pill tone="success">Customer wallet</Pill>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                    Current points
                  </p>
                  <p className="font-display text-5xl font-semibold tracking-[-0.06em]">
                    {formatPoints(demoRestaurant.customer.points)}
                  </p>
                  <p className="max-w-xl text-sm leading-6 text-white/80">
                    Points can be earned through games, check-ins, and special promotions. They
                    unlock restaurant-exclusive rewards and global platform offers.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/games" variant="secondary">
                    <span className="inline-flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Play games
                    </span>
                  </ButtonLink>
                  <ButtonLink href="/redeem" variant="outline">
                    <span className="inline-flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Redeem now
                    </span>
                  </ButtonLink>
                </div>
              </div>
            </div>

            <div className="grid gap-4 bg-white/70 p-8">
              <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Tier
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                      {demoRestaurant.customer.level}
                    </p>
                  </div>
                  <Coins className="h-6 w-6 text-[rgb(var(--brand))]" />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {demoRestaurant.customer.visits} tracked visits and a strong repeat-guest signal.
                </p>
              </div>

              <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--brand-soft))] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Redemption ready
                </p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                  3 active rewards
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Restaurant-exclusive rewards and global offers are shown separately to keep the
                  wallet easy to understand.
                </p>
              </div>
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

