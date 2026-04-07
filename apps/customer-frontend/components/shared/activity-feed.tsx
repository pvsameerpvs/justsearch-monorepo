import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';
import { cn } from '@/lib/cn';
import type { Activity } from '@/lib/demo-data';

type ActivityFeedProps = {
  items: Activity[];
  title?: string;
  description?: string;
  className?: string;
};

const toneClasses = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-sky-100 text-sky-700',
} as const;

export function ActivityFeed({
  items,
  title = 'Recent activity',
  description = 'The backend can surface customer activity across check-ins, games, and reward claims.',
  className,
}: ActivityFeedProps) {
  return (
    <Surface className={cn('p-8', className)}>
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
            Activity
          </p>
          <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
            {title}
          </h3>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={`${item.title}-${item.time}`}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={cn('inline-flex h-2.5 w-2.5 rounded-full', toneClasses[item.tone])} />
                  <p className="font-medium text-[rgb(var(--ink))]">{item.title}</p>
                </div>
                <p className="text-sm text-slate-500">{item.detail}</p>
              </div>
              <Pill tone="neutral">{item.time}</Pill>
            </div>
          ))}
        </div>
      </div>
    </Surface>
  );
}

