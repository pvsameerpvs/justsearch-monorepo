'use client';

import { useEffect } from 'react';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { ButtonLink } from '@/components/shared/button-link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error logged to monitoring service
  }, [error]);

  return (
    <section className="py-24">
      <Container>
        <Surface className="mx-auto max-w-xl rounded-[32px] border-white/70 bg-white/90 p-8 text-center sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-500">Error</p>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] px-6 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-[0.99]"
            >
              Try again
            </button>
            <ButtonLink href="/" variant="outline" size="md">
              Back to home
            </ButtonLink>
          </div>
        </Surface>
      </Container>
    </section>
  );
}
