import { DollarSign, Percent, Receipt } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsInputField } from "./settings-input-field";
import type { SettingsStore } from "@/lib/stores/settings-store";

interface SettingsRevenueProps {
  settings: SettingsStore;
}

export function SettingsRevenue({ settings }: SettingsRevenueProps) {
  const { revenue, updateRevenue } = settings;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={DollarSign} title="Revenue Split" description="Ad revenue share and pricing" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsInputField label="Restaurant Ad Split (%)" value={String(revenue.restaurantAdSplit)} icon={Percent} onChange={(v) => updateRevenue({ restaurantAdSplit: Number(v) })} />
        <SettingsInputField label="Platform Ad Split (%)" value={String(revenue.platformAdSplit)} icon={Percent} onChange={(v) => updateRevenue({ platformAdSplit: Number(v) })} />
        <SettingsInputField label="Subscription Price (AED)" value={String(revenue.subscriptionPriceAED)} icon={Receipt} onChange={(v) => updateRevenue({ subscriptionPriceAED: Number(v) })} />
        <SettingsInputField label="Tax Rate (%)" value={String(revenue.taxPercent)} icon={Percent} onChange={(v) => updateRevenue({ taxPercent: Number(v) })} />
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs font-bold text-amber-700">Restaurant + Platform split must equal 100%</p>
      </div>
    </div>
  );
}
