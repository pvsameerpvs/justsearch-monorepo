'use client';

import { useState } from 'react';
import { Button, Input } from '@justsearch/ui';
import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';
import type { FormEvent } from 'react';

export function LoginForm() {
  const [mode, setMode] = useState<'otp' | 'password'>('otp');
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState('Use your phone or email to continue.');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(
      mode === 'otp'
        ? `Demo OTP sent to ${identifier || 'your contact method'}.`
        : `Demo password login prepared for ${identifier || 'your account'}.`
    );
  };

  return (
    <Surface className="p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-2">
          <Pill tone={mode === 'otp' ? 'brand' : 'neutral'}>OTP login</Pill>
          <Pill tone={mode === 'password' ? 'brand' : 'neutral'}>Password login</Pill>
        </div>

        <div className="grid gap-4">
          <Input
            label="Phone number or email"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="+971 50 000 0000 or name@example.com"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="button" variant={mode === 'otp' ? 'primary' : 'secondary'} onClick={() => setMode('otp')}>
            OTP
          </Button>
          <Button
            type="button"
            variant={mode === 'password' ? 'primary' : 'secondary'}
            onClick={() => setMode('password')}
          >
            Password
          </Button>
        </div>

        <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-4 text-sm text-slate-600">
          {status}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </Surface>
  );
}
