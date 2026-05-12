import { Card, CardContent } from '@justsearch/ui';
import { cn } from '@/lib/cn';
import type { DeliveryMetric } from '@/lib/delivery-types';

function getToneClasses(tone: DeliveryMetric['tone']): string {
  switch (tone) {
    case 'success':
      return 'border-emerald-200 bg-emerald-50/80';
    case 'warning':
      return 'border-amber-200 bg-amber-50/80';
    default:
      return 'border-slate-200 bg-white/90';
  }
}

export function DeliveryMetricCard({ metric }: { metric: DeliveryMetric }) {
  return (
    <Card
      className={cn(
        'rounded-3xl shadow-[0_20px_60px_-38px_rgba(15,23,42,0.38)]',
        getToneClasses(metric.tone)
      )}
    >
      <CardContent className="p-5">
        <p className="text-sm font-medium text-slate-500">{metric.label}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {metric.value}
        </p>
        <p className="mt-2 text-sm text-slate-600">{metric.hint}</p>
      </CardContent>
    </Card>
  );
}
