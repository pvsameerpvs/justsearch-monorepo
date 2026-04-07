import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';
import { demoRestaurant } from '@/lib/demo-data';
import { formatPoints } from '@/lib/format';
import { User, Trophy, TimerReset, MapPin } from 'lucide-react';

export function ProfileSummary() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Surface className="p-8">
            <div className="space-y-5">
              <Pill tone="brand">Profile</Pill>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Guest name
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                    {demoRestaurant.customer.name}
                  </h3>
                </div>
                <User className="h-10 w-10 text-[rgb(var(--brand))]" />
              </div>
              <p className="text-sm leading-6 text-slate-600">
                This profile view keeps the customer aware of wallet balance, visit history, and
                the active restaurant session.
              </p>
            </div>
          </Surface>

          <div className="grid gap-4">
            <Surface className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Wallet
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                    {formatPoints(demoRestaurant.customer.points)} points
                  </p>
                </div>
                <Trophy className="h-6 w-6 text-[rgb(var(--brand))]" />
              </div>
            </Surface>
            <Surface className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Visit streak
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                    {demoRestaurant.customer.visits} visits
                  </p>
                </div>
                <MapPin className="h-6 w-6 text-[rgb(var(--brand))]" />
              </div>
            </Surface>
            <Surface className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Session
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                    {demoRestaurant.session.state === 'active' ? 'Checked in' : 'Needs QR scan'}
                  </p>
                </div>
                <TimerReset className="h-6 w-6 text-[rgb(var(--brand))]" />
              </div>
            </Surface>
          </div>
        </div>
      </Container>
    </section>
  );
}
