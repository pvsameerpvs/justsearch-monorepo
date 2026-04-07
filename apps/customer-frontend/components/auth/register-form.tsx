'use client';

import { useState } from 'react';
import { Button, Input } from '@justsearch/ui';
import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';
import type { FormEvent } from 'react';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState('Create a customer profile in seconds.');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(`Demo registration prepared for ${name || 'new guest'} using ${contact || 'your contact details'}.`);
  };

  return (
    <Surface className="p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Pill tone="brand">Create account</Pill>
        <div className="grid gap-4">
          <Input label="Full name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Amina Hassan" />
          <Input
            label="Phone or email"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="+971 50 000 0000 or name@example.com"
          />
        </div>

        <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-4 text-sm text-slate-600">
          {status}
        </div>

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Surface>
  );
}
