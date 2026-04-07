'use client';

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';

const outcomes = [
  { title: '60 bonus points', detail: 'Added to the customer wallet instantly.' },
  { title: 'Free dessert', detail: 'Redeem at the counter during this visit.' },
  { title: '10% off next order', detail: 'Valid on the next checkout.' },
  { title: 'Signature mocktail', detail: 'Staff can confirm the offer at the table.' },
] as const;

export function ScratchCard() {
  const [revealed, setRevealed] = useState(false);
  const [outcome] = useState(() => outcomes[Math.floor(Math.random() * outcomes.length)]);

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="space-y-4">
              <Pill tone="brand">Scratch card</Pill>
              <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                One reveal, one reward, fully tied to the current session.
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                This is the visual reward moment that follows a game or check-in. The backend
                should still enforce eligibility and daily limits.
              </p>
              <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-4 text-sm text-slate-600">
                If the session expires, the reveal action should be blocked until the guest scans
                the in-store QR again.
              </div>
            </div>

            <div className="rounded-[2rem] border border-dashed border-[rgb(var(--border))] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(223,247,243,0.92))] p-6">
              <div className="rounded-[1.75rem] border border-[rgb(var(--border))] bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Reveal area
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                      {revealed ? outcome.title : 'Scratch to reveal'}
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-3xl bg-[rgb(var(--brand-soft))]" />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {revealed
                    ? outcome.detail
                    : 'The reward is hidden until the guest chooses to reveal it.'}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setRevealed(true)} className="w-full">
                    {revealed ? 'Reveal complete' : 'Scratch now'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

