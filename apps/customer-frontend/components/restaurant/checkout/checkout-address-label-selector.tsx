"use client";

import { cn } from '@/lib/cn';

type AddressLabel = 'Home' | 'Work' | 'Hotel' | 'Other';

type Props = {
  value: AddressLabel;
  onChange: (label: AddressLabel) => void;
};

export function CheckoutAddressLabelSelector({ value, onChange }: Props) {
  return (
    <div>
      <p className="text-sm font-medium text-[rgb(var(--muted))]">
        Save address as <span className="text-red-500">*</span>
      </p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {(['Home', 'Work', 'Hotel', 'Other'] as const).map((label) => (
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
