"use client";

import { Banknote, CreditCard } from 'lucide-react';
import { cn } from '@/lib/cn';

type CheckoutPaymentMethodProps = {
  value: 'cash' | 'card';
  onChange: (value: 'cash' | 'card') => void;
};

const OPTIONS = [
  {
    value: 'cash' as const,
    label: 'Cash on Delivery',
    description: 'Pay cash when your order arrives',
    icon: Banknote,
  },
  {
    value: 'card' as const,
    label: 'Card on Delivery',
    description: 'Pay by card at your doorstep',
    icon: CreditCard,
  },
];

export function CheckoutPaymentMethod({ value, onChange }: CheckoutPaymentMethodProps) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
        Payment Method
      </p>
      <div className="mt-3 space-y-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all',
                isActive
                  ? 'border-[rgb(var(--brand))] bg-[rgb(var(--brand-soft)/0.2)]'
                  : 'border-slate-100 bg-white hover:border-slate-200',
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                  isActive
                    ? 'bg-[rgb(var(--brand))] text-white'
                    : 'bg-slate-100 text-slate-400',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p
                  className={cn(
                    'text-sm font-bold',
                    isActive ? 'text-[rgb(var(--brand))]' : 'text-[rgb(var(--ink))]',
                  )}
                >
                  {option.label}
                </p>
                <p className="text-[11px] font-medium text-slate-400">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
