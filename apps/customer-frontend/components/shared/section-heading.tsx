import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-end md:justify-between', className)}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[rgb(var(--brand))]">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))] sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

