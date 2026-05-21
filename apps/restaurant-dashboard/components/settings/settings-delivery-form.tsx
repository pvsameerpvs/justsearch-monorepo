"use client";

import type { DeliveryConfig, UaeEmirate } from "@justsearch/types";
import { SettingsDeliveryEnableToggle } from "./settings-delivery-enable-toggle";
import { SettingsDeliveryEmirates } from "./settings-delivery-emirates";
import { SettingsDeliveryLocationInputs } from "./settings-delivery-location-inputs";
import { SettingsDeliveryRadiusInput } from "./settings-delivery-radius-input";
import { SettingsDeliveryTierList } from "./settings-delivery-tier-list";

interface Props {
  config: DeliveryConfig;
  onChange: (config: DeliveryConfig) => void;
}

export function SettingsDeliveryForm({ config, onChange }: Props) {
  const set = <K extends keyof DeliveryConfig>(key: K, value: DeliveryConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const updateTier = (index: number, field: 'minKm' | 'maxKm' | 'fee', value: number) => {
    const tiers = config.tiers.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    set('tiers', tiers);
  };

  const addTier = () => {
    const last = config.tiers[config.tiers.length - 1];
    const min = last ? last.maxKm : 0;
    set('tiers', [...config.tiers, { minKm: min, maxKm: min + 1, fee: 0 }]);
  };

  const removeTier = (index: number) => {
    set('tiers', config.tiers.filter((_, i) => i !== index));
  };

  const toggleEmirate = (emirate: UaeEmirate) => {
    const has = config.emirates.includes(emirate);
    const next = has
      ? config.emirates.filter((e) => e !== emirate)
      : [...config.emirates, emirate];
    set('emirates', next);
  };

  return (
    <div className="space-y-6">
      <SettingsDeliveryEnableToggle enabled={config.enabled} onChange={(v) => set('enabled', v)} />

      <SettingsDeliveryEmirates selected={config.emirates} onToggle={toggleEmirate} />

      <SettingsDeliveryLocationInputs
        lat={config.restaurantLat}
        lng={config.restaurantLng}
        onLatChange={(v) => set('restaurantLat', v)}
        onLngChange={(v) => set('restaurantLng', v)}
      />

      <SettingsDeliveryRadiusInput
        value={config.maxRadiusKm}
        onChange={(v) => set('maxRadiusKm', v)}
      />

      <SettingsDeliveryTierList
        tiers={config.tiers}
        maxRadiusKm={config.maxRadiusKm}
        onUpdate={updateTier}
        onAdd={addTier}
        onRemove={removeTier}
      />

      <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <span className="font-bold text-slate-600">Where is this saved?</span> When you click Save, this delivery configuration is stored inside your restaurant&apos;s <code className="rounded bg-slate-200 px-1 py-0.5 text-[10px] font-mono text-slate-700">settings</code> column in the database (as JSON). No separate table or migration is needed. Customer checkout reads this data in real-time to calculate distance and delivery fees.
        </p>
      </div>
    </div>
  );
}
