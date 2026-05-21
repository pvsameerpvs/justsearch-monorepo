"use client";

import type { DeliveryConfig } from "@justsearch/types";

interface SettingsDeliveryCardViewProps {
  delivery?: DeliveryConfig;
}

export function SettingsDeliveryCardView({ delivery }: SettingsDeliveryCardViewProps) {
  if (!delivery) {
    return <p className="text-xs text-slate-400">Not configured yet. Click Edit to set up delivery pricing.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className={`inline-flex h-2 w-2 rounded-full ${delivery.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
        <span className="font-bold text-slate-700">{delivery.enabled ? 'Delivery Enabled' : 'Delivery Disabled'}</span>
      </div>
      {delivery.enabled && (
        <>
          <p className="text-xs text-slate-500">Emirates: {delivery.emirates.join(', ')}</p>
          <p className="text-xs text-slate-500">Max radius: {delivery.maxRadiusKm} km</p>
          <p className="text-xs text-slate-500">Location: {delivery.restaurantLat}, {delivery.restaurantLng}</p>
          <div className="mt-2 space-y-1">
            {delivery.tiers.map((t, i) => (
              <p key={i} className="text-xs font-medium text-slate-600">{t.minKm}-{t.maxKm} km = AED {t.fee}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
