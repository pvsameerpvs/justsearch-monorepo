import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type StatCardProps = {
  label: string;
  value: string;
  note?: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, note, icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="font-display text-3xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-3 text-[rgb(var(--brand))]">{icon}</div>
        ) : null}
      </div>
      {note ? <p className="mt-4 text-sm leading-6 text-slate-600">{note}</p> : null}
    </div>
  );
}

