import type { Restaurant } from '@justsearch/utils';
import { Clock } from 'lucide-react';

export function OpeningHoursSection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Clock className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Opening Hours</h3>
          <p className="text-sm text-slate-500">Shown on customer menu page</p>
        </div>
      </div>

      <div className="space-y-2">
        {restaurant.openingHours.map((oh) => (
          <div
            key={oh.day}
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${
              oh.isToday ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${oh.isToday ? 'text-amber-800' : 'text-slate-700'}`}>
                {oh.day}
              </span>
              {oh.isToday && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  TODAY
                </span>
              )}
            </div>
            <span className={`text-sm font-medium ${oh.isToday ? 'text-amber-700' : 'text-slate-600'}`}>
              {oh.hours}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
