import { Clock3 } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { OpeningHour } from '@/lib/restaurant-types';

type RestaurantOpeningHoursPanelProps = {
  openingHours: readonly OpeningHour[];
};

export function RestaurantOpeningHoursPanel({
  openingHours,
}: RestaurantOpeningHoursPanelProps) {
  return (
    <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(var(--accent-soft),0.3))] p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <Clock3 className="mt-1 h-5 w-5 text-[rgb(var(--brand))]" />
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
            Opening hours
          </p>
          <div className="mt-5 space-y-3">
            {openingHours.map((openingHour) => (
              <div
                key={openingHour.day}
                className="flex items-center justify-between rounded-[20px] border border-[rgba(var(--card-border),0.86)] bg-[rgba(var(--card-surface),0.82)] px-4 py-3 text-sm text-[rgb(var(--muted))]"
              >
                <span className="font-medium text-[rgb(var(--ink))]">
                  {openingHour.day}
                </span>
                <span>{openingHour.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Surface>
  );
}
