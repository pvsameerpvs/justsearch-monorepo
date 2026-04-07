import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type PillProps = {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning';
  className?: string;
};

const tones = {
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  brand: 'bg-[rgb(var(--brand-soft))] text-[rgb(var(--brand))] border-transparent',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
} as const;

export function Pill({ children, tone = 'neutral', className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

