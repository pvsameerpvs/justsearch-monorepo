import type { Restaurant } from '@justsearch/utils';
import { Info, UtensilsCrossed } from 'lucide-react';

export function SettingsInfoCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Info className="h-5 w-5 text-emerald-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Restaurant Details</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Cuisine</p>
          <div className="flex flex-wrap gap-2">
            {restaurant.cuisine.map((c) => (
              <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Slug</p>
          <p className="text-sm font-mono text-slate-700">{restaurant.slug}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Subdomain</p>
          <p className="text-sm font-mono text-slate-700">{restaurant.subdomain}.js-restorant.com</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Google Place ID</p>
          <p className="text-sm font-mono text-slate-700">{restaurant.googlePlaceId ?? 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}
