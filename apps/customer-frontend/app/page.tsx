import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';
import { Surface } from '@/components/shared/surface';
import { ButtonLink } from '@/components/shared/button-link';
import { RestaurantHero } from '@/components/restaurant/hero';
import { MenuPreview } from '@/components/restaurant/menu-preview';
import { WalletBanner } from '@/components/rewards/wallet-banner';
import { GameLobby } from '@/components/games/game-lobby';
import { ActivityFeed } from '@/components/shared/activity-feed';
import { OpeningHours } from '@/components/restaurant/opening-hours';
import { ContactCard } from '@/components/restaurant/contact-card';
import { demoRestaurant } from '@/lib/demo-data';
import { Pill } from '@/components/shared/pill';

export default function Home() {
  return (
    <>
      <RestaurantHero />
      <MenuPreview />
      <WalletBanner />
      <GameLobby />

      <section className="py-8 sm:py-12">
        <Container>
          <SectionHeading
            eyebrow="Live pulse"
            title="A quick glance at activity inside the restaurant."
            description="This area helps guests see how the restaurant is using check-ins, games, and rewards without needing to visit the dashboard."
            action={<ButtonLink href="/live" variant="secondary">Open live route</ButtonLink>}
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <ActivityFeed items={demoRestaurant.activity} />
            <Surface className="p-8">
              <div className="space-y-5">
                <Pill tone="success">Session summary</Pill>
                <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                  A QR-led flow that keeps the guest informed.
                </h3>
                <p className="text-sm leading-6 text-slate-600">
                  Public browsing stays open, while protected actions only work inside the active
                  restaurant session.
                </p>

                <div className="grid gap-3 rounded-3xl bg-[rgb(var(--brand-soft))] p-5">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500">Check-in state</span>
                    <span className="font-semibold text-[rgb(var(--ink))]">Active</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500">Expires in</span>
                    <span className="font-semibold text-[rgb(var(--ink))]">{demoRestaurant.session.expiresIn}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-500">Customer</span>
                    <span className="font-semibold text-[rgb(var(--ink))]">{demoRestaurant.customer.name}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/games" variant="primary">
                    Play now
                  </ButtonLink>
                  <ButtonLink href="/rewards" variant="outline">
                    View rewards
                  </ButtonLink>
                </div>
              </div>
            </Surface>
          </div>
        </Container>
      </section>

      <OpeningHours />
      <ContactCard />
    </>
  );
}

