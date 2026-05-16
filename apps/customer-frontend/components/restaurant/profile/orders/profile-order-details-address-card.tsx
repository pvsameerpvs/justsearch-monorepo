import { MapPin } from 'lucide-react';
import { Surface } from '@/components/shared/surface';

type Props = {
  addressLines: string[];
};

export function ProfileOrderDetailsAddressCard({ addressLines }: Props) {
  return (
    <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.92] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--accent-soft)/0.42)] text-[rgb(var(--accent))]">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
            Deliver to
          </p>
          {addressLines.map((line) => (
            <p
              key={line}
              className="mt-1 text-sm leading-5 text-[rgb(var(--ink))] first:font-semibold first:text-[rgb(var(--ink))]"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </Surface>
  );
}
