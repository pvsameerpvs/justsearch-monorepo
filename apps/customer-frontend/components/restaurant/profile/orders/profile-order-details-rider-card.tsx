import { Bike } from 'lucide-react';
import { Surface } from '@/components/shared/surface';

type Props = {
  riderName: string;
};

export function ProfileOrderDetailsRiderCard({ riderName }: Props) {
  return (
    <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.92] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.35)] text-[rgb(var(--brand))]">
          <Bike className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
            Delivery partner
          </p>
          <p className="mt-1 text-sm font-semibold text-[rgb(var(--ink))]">
            {riderName}
          </p>
          <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">
            Rider assigned for this order
          </p>
        </div>
      </div>
    </Surface>
  );
}
