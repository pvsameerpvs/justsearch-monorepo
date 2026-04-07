import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { Surface } from '@/components/shared/surface';
import { ShieldAlert } from 'lucide-react';

export function SessionExpiredBanner() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-red-700">
                <ShieldAlert className="h-3.5 w-3.5" />
                Session expired
              </div>
              <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                Your game session has expired.
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Public pages still work, but the protected rewards flow needs a fresh QR check-in to
                continue.
              </p>
            </div>

            <ButtonLink href="/live" variant="primary">
              Rescan QR
            </ButtonLink>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

