import { Container } from '@/components/shared/container';
import { Pill } from '@/components/shared/pill';
import { Surface } from '@/components/shared/surface';
import { demoRestaurant } from '@/lib/demo-data';

export function RestaurantStory() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Surface className="p-8">
            <div className="space-y-5">
              <Pill tone="brand">About the restaurant</Pill>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                A branded dining journey built for repeat visits.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {demoRestaurant.name} uses the JustSearch platform to blend discovery, loyalty,
                and gameplay into one mobile-first restaurant experience. Guests can browse the
                menu, check in with a QR scan, collect points, and redeem rewards without losing
                the public browsing experience.
              </p>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                The customer view stays open for everyone, while games and reward actions unlock
                only during a valid restaurant session. That keeps the experience welcoming for new
                visitors and secure for ongoing reward flows.
              </p>
            </div>
          </Surface>

          <Surface className="p-8">
            <div className="space-y-5">
              <Pill tone="warning">Brand promise</Pill>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Signature line
                  </p>
                  <p className="mt-2 text-lg text-[rgb(var(--ink))]">{demoRestaurant.tagline}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Cuisine
                  </p>
                  <p className="mt-2 text-lg text-[rgb(var(--ink))]">{demoRestaurant.category}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Experience
                  </p>
                  <p className="mt-2 text-lg text-[rgb(var(--ink))]">
                    Public menu, check-in session, games, rewards, and redeem flows.
                  </p>
                </div>
              </div>
            </div>
          </Surface>
        </div>
      </Container>
    </section>
  );
}

