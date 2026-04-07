import { ArrowRight, Sparkles, TimerReset, UtensilsCrossed } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { Pill } from '@/components/shared/pill';
import { StatCard } from '@/components/shared/stat-card';
import { demoRestaurant } from '@/lib/demo-data';

export function RestaurantHero() {
  return (
    <section className="pt-8 sm:pt-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,255,255,0.76))] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-10">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-[rgb(var(--accent-soft))] blur-3xl" />
            <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-[rgb(var(--brand-soft))] blur-3xl" />

            <div className="relative space-y-8">
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="brand">Restaurant-branded experience</Pill>
                <Pill tone="success">
                  <span className="inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Active session
                  </span>
                </Pill>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[rgb(var(--brand))]">
                  {demoRestaurant.category}
                </p>
                <h1 className="font-display text-4xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))] sm:text-6xl">
                  {demoRestaurant.tagline}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  {demoRestaurant.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/menu" variant="primary" size="lg">
                  <span className="inline-flex items-center gap-2">
                    View Menu <UtensilsCrossed className="h-4 w-4" />
                  </span>
                </ButtonLink>
                <ButtonLink href="/live" variant="secondary" size="lg">
                  <span className="inline-flex items-center gap-2">
                    Start Check-In <ArrowRight className="h-4 w-4" />
                  </span>
                </ButtonLink>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {demoRestaurant.metrics.slice(0, 3).map((metric) => (
                  <StatCard key={metric.label} label={metric.label} value={metric.value} note={metric.note} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(15,118,110,0.96),rgba(10,92,85,0.96))] p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.14)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                    Live session
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em]">
                    {demoRestaurant.session.restaurant}
                  </h2>
                </div>
                <div className="rounded-3xl bg-white/12 p-4">
                  <TimerReset className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">Status</p>
                  <p className="mt-2 text-lg font-medium">Checked in</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">Expires in</p>
                  <p className="mt-2 text-lg font-medium">{demoRestaurant.session.expiresIn}</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-white/60">Last check</p>
                <p className="mt-2 text-sm text-white/90">{demoRestaurant.session.lastCheck}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard
                label="Customer tier"
                value={demoRestaurant.customer.level}
                note={`${demoRestaurant.customer.visits} visits and counting`}
                icon={<Sparkles className="h-5 w-5" />}
              />
              <StatCard
                label="Points balance"
                value={new Intl.NumberFormat('en-US').format(demoRestaurant.customer.points)}
                note="Enough for several rewards"
                icon={<UtensilsCrossed className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

