import { CheckCircle2, XCircle, MapPin, Navigation, Crown, Banknote, Bike } from "lucide-react";
import type { DeliveryConfig } from "@justsearch/types";

function StatusBadge({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
      <CheckCircle2 className="h-3.5 w-3.5" /> Delivery Enabled
    </div>
  ) : (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
      <XCircle className="h-3.5 w-3.5" /> Delivery Disabled
    </div>
  );
}

function InfoBlock({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-amber-500" />
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      </div>
      <div className="text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

interface SettingsDeliveryCardViewProps {
  delivery?: DeliveryConfig;
}

export function SettingsDeliveryCardView({ delivery }: SettingsDeliveryCardViewProps) {
  if (!delivery) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <Bike className="mx-auto h-8 w-8 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-400">Delivery not configured yet.</p>
        <p className="text-xs text-slate-400 mt-1">Click Edit to set up delivery zones and pricing.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <StatusBadge enabled={delivery.enabled} />

      {!delivery.enabled && (
        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-500">Delivery is disabled. Customers will only see dine-in and pickup options.</p>
        </div>
      )}

      {delivery.enabled && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InfoBlock icon={MapPin} label="Location" value={`${delivery.restaurantLat.toFixed(5)}, ${delivery.restaurantLng.toFixed(5)}`} />
            <InfoBlock icon={Navigation} label="Max Radius" value={`${delivery.maxRadiusKm} km`} />
            <InfoBlock icon={Crown} label="Emirates" value={delivery.emirates.join(", ")} />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Banknote className="h-4 w-4 text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pricing Tiers</p>
            </div>
            <div className="space-y-2">
              {delivery.tiers.map((tier, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-xs font-black text-amber-700">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-500">{tier.minKm} – {tier.maxKm} km</p>
                  </div>
                  <div className="text-sm font-bold text-slate-900">AED {tier.fee.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
