import { Surface } from '@/components/shared/surface';
import { Pill } from '@/components/shared/pill';
import type { Game } from '@/lib/demo-data';

type GameCardProps = Game;

export function GameCard({ name, description, prize, access }: GameCardProps) {
  return (
    <Surface className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Pill tone="brand">{access}</Pill>
            <h4 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
              {name}
            </h4>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
        <div className="rounded-2xl bg-[rgb(var(--brand-soft))] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Prize</p>
          <p className="mt-2 text-sm font-medium text-[rgb(var(--ink))]">{prize}</p>
        </div>
      </div>
    </Surface>
  );
}

