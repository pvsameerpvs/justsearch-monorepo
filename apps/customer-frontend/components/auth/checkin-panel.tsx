'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Input } from '@justsearch/ui';
import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';
import { ButtonLink } from '@/components/shared/button-link';
import { demoRestaurant } from '@/lib/demo-data';
import { FlowStep } from '@/components/games/flow-step';
import type { FormEvent } from 'react';

export function CheckinPanel() {
  const searchParams = useSearchParams();
  const initialToken = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const [token, setToken] = useState(initialToken);
  const [message, setMessage] = useState('Paste the QR token from the live check-in route.');
  const [active, setActive] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (token.toLowerCase().includes('expired')) {
      setActive(false);
      setMessage('This token has expired. Scan the in-store QR code again.');
      return;
    }

    if (token.trim().length < 6) {
      setActive(false);
      setMessage('Enter a valid check-in token to continue.');
      return;
    }

    setActive(true);
    setMessage(`Active session created for ${demoRestaurant.name}. Game and rewards are unlocked.`);
  };

  return (
    <Surface className="p-8">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Pill tone={active ? 'success' : 'warning'}>{active ? 'Session active' : 'Session pending'}</Pill>
          <Pill tone="brand">{demoRestaurant.session.expiresIn} window</Pill>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Check-in token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="abc123 or demo-checkin-token"
          />
          <Button type="submit" className="w-full">
            Validate token
          </Button>
        </form>

        <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-4 text-sm text-slate-600">
          {message}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FlowStep
            step="1"
            title="Scan"
            description="Customer opens the live route or QR entry point."
            active={!active}
          />
          <FlowStep
            step="2"
            title="Validate"
            description="Backend confirms the token and creates the session."
            active={active}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/games" variant={active ? 'primary' : 'secondary'}>
            Open games
          </ButtonLink>
          <ButtonLink href="/session-expired" variant="outline">
            Session expired view
          </ButtonLink>
        </div>
      </div>
    </Surface>
  );
}
