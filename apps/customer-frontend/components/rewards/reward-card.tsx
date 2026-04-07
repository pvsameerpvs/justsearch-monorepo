import { Badge } from '@justsearch/ui';
import { Surface } from '@/components/shared/surface';
import { formatPoints } from '@/lib/format';
import type { Reward } from '@/lib/demo-data';
import { cn } from '@/lib/cn';

type RewardCardProps = Reward & {
  className?: string;
};

const statusTone = {
  Active: 'success',
  Limited: 'warning',
  Claimed: 'default',
} as const;

export function RewardCard({ name, description, points, scope, status, className }: RewardCardProps) {
  return (
    <Surface className={cn('p-6', className)}>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge variant={statusTone[status]}>{scope}</Badge>
            <h4 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
              {name}
            </h4>
          </div>
          <div className="rounded-2xl bg-[rgb(var(--brand-soft))] px-3 py-2 text-right">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Points</p>
            <p className="font-display text-xl font-semibold tracking-[-0.03em] text-[rgb(var(--ink))]">
              {formatPoints(points)}
            </p>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </Surface>
  );
}

