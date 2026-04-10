import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-dashed border-[rgba(var(--border),0.88)] bg-[rgba(var(--card-surface),0.74)] p-8 text-center backdrop-blur-sm',
        className
      )}
    >
      <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[rgb(var(--ink))]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
