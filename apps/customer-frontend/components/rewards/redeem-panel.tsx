'use client';

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';
import { demoRestaurant } from '@/lib/demo-data';

export function RedeemPanel() {
  const [message, setMessage] = useState('Select a reward to prepare the redemption.');

  const handleRedeem = (rewardName: string) => {
    setMessage(`${rewardName} is ready for staff confirmation at the counter.`);
  };

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="p-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <Pill tone="brand">Redeem flow</Pill>
              <h3 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
                Confirm rewards, then let staff finish the last step.
              </h3>
              <p className="text-sm leading-6 text-slate-600">{message}</p>
              <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-4 text-sm text-slate-600">
                High-value redemptions can be routed through staff approval without changing the
                customer-facing wallet experience.
              </div>
            </div>

            <div className="grid gap-3">
              {demoRestaurant.rewards.map((reward) => (
                <div
                  key={reward.name}
                  className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[rgb(var(--brand))]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[rgb(var(--ink))]">{reward.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{reward.description}</p>
                    </div>
                    <Pill tone={reward.status === 'Claimed' ? 'warning' : 'success'}>
                      {reward.status}
                    </Pill>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-[rgb(var(--brand))]">{reward.points} pts</p>
                    <Button size="sm" onClick={() => handleRedeem(reward.name)}>
                      Redeem
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}
