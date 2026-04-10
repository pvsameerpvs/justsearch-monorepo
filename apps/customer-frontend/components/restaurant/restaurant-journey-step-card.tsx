import type { LucideIcon } from 'lucide-react';

type RestaurantJourneyStepCardProps = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function RestaurantJourneyStepCard({
  step,
  title,
  description,
  icon: Icon,
}: RestaurantJourneyStepCardProps) {
  return (
    <div className="rounded-[24px] border border-[rgba(var(--border),0.72)] bg-[rgba(var(--card-surface-muted),0.88)] p-4">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon className="h-5 w-5 text-[rgb(var(--brand))]" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Step {step}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[rgb(var(--ink))]">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
