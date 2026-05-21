"use client";

interface SettingsDeliveryEnableToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function SettingsDeliveryEnableToggle({ enabled, onChange }: SettingsDeliveryEnableToggleProps) {
  return (
    <div className={`rounded-xl border p-4 transition-colors ${enabled ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/40'}`}>
      <label className="flex cursor-pointer items-center gap-3">
        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors" style={{ backgroundColor: enabled ? '#10b981' : '#cbd5e1' }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onChange(e.target.checked)}
            className="sr-only"
          />
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">{enabled ? 'Delivery Enabled' : 'Delivery Disabled'}</p>
          <p className="text-[11px] text-slate-500">
            {enabled
              ? 'Customers will see delivery option at checkout'
              : 'Delivery option will be hidden from customers'}
          </p>
        </div>
      </label>
    </div>
  );
}
