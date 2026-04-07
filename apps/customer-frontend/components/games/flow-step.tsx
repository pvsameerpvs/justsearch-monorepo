import { Surface } from '@/components/shared/surface';
import { cn } from '@/lib/cn';

type FlowStepProps = {
  step: string;
  title: string;
  description: string;
  active?: boolean;
};

export function FlowStep({ step, title, description, active = false }: FlowStepProps) {
  return (
    <Surface
      className={cn(
        'p-5 transition-all',
        active && 'border-[rgb(var(--brand))] shadow-[0_18px_45px_rgba(15,118,110,0.16)]'
      )}
    >
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
          Step {step}
        </p>
        <h4 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
          {title}
        </h4>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </Surface>
  );
}

