import { MapPin, Phone, Store } from 'lucide-react';
import type { DeliveryPortalRestaurant } from '@/lib/delivery-types';

type PortalMetaStripProps = {
  restaurant: DeliveryPortalRestaurant;
};

export function PortalMetaStrip({ restaurant }: PortalMetaStripProps) {
  return (
    <div className="grid gap-4 px-6 py-4 text-sm text-slate-600 md:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Store className="h-4 w-4 text-orange-500" />
          Restaurant tenant
        </div>
        <p className="mt-2">{restaurant.slug}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <MapPin className="h-4 w-4 text-orange-500" />
          Delivery zone
        </div>
        <p className="mt-2">{restaurant.zoneLabel}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Phone className="h-4 w-4 text-orange-500" />
          Dispatch hotline
        </div>
        <p className="mt-2">{restaurant.supportPhone}</p>
      </div>
    </div>
  );
}
