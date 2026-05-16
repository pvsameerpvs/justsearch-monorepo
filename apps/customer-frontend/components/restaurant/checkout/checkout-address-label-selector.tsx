"use client";

import { cn } from '@/lib/cn';

type Props = {
  value: 'Home' | 'Work' | 'Other';
  onChange: (label: 'Home' | 'Work' | 'Other') => void;
};

export function CheckoutAddressLabelSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
        Label
      </p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {(['Home', 'Work', 'Other'] as const).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            className={cn(
              'rounded-2xl border px-3 py-3 text-[12px] font-semibold transition-all',
              value === label
                ? 'border-[rgb(var(--brand))] bg-[rgb(var(--brand))] text-white'
                : 'border-[rgb(var(--border)/0.72)] bg-white text-[rgb(var(--muted))]',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
