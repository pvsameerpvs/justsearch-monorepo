import { cn } from '@/lib/cn';

interface DeliveryTimelineStepProps {
  index: number;
  isComplete: boolean;
  stepLabel: string;
  description: string;
}

export function DeliveryTimelineStep({
  index,
  isComplete,
  stepLabel,
  description,
}: DeliveryTimelineStepProps) {
  return (
    <div
      className={cn(
        'flex gap-4 rounded-2xl border px-4 py-4',
        isComplete
          ? 'border-emerald-200 bg-emerald-50/80'
          : 'border-slate-200 bg-slate-50'
      )}
    >
      <div
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
          isComplete
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-500 border border-slate-200'
        )}
      >
        {index + 1}
      </div>
      <div>
        <p className="font-semibold capitalize text-slate-950">{stepLabel}</p>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
