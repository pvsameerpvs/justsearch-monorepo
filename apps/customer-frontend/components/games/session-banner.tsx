import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { Pill } from '@/components/shared/pill';
import { Surface } from '@/components/shared/surface';
import { demoRestaurant } from '@/lib/demo-data';
import { ShieldCheck, TimerReset } from 'lucide-react';

type SessionBannerProps = {
  title?: string;
  description?: string;
};

export function SessionBanner({
  title = 'Session active',
  description = 'The active session allows the customer to play games, claim points, and redeem rewards.',
}: SessionBannerProps) {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
            <div className="bg-[linear-gradient(135deg,rgba(15,118,110,0.96),rgba(11,79,73,0.96))] p-8 text-white sm:p-10">
              <div className="space-y-4">
                <Pill tone="success">{title}</Pill>
                <h3 className="font-display text-3xl font-semibold tracking-[-0.05em]">
                  {demoRestaurant.session.restaurant}
                </h3>
                <p className="max-w-xl text-sm leading-6 text-white/80">{description}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/scratch" variant="secondary">
                  Reveal scratch card
                </ButtonLink>
                <ButtonLink href="/redeem" variant="outline">
                  Redeem rewards
                </ButtonLink>
              </div>
            </div>

            <div className="grid gap-4 p-8">
              <div className="rounded-3xl border border-[rgb(var(--border))] bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-3 text-[rgb(var(--brand))]">
                    <TimerReset className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Expires in
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                      {demoRestaurant.session.expiresIn}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-[rgb(var(--border))] bg-[rgb(var(--brand-soft))] p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[rgb(var(--brand))]" />
                  <p className="font-medium text-[rgb(var(--ink))]">Session rules are enforced server-side.</p>
                </div>
              </div>
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

