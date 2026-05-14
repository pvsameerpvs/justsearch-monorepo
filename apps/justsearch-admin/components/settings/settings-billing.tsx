import { CreditCard, KeyRound } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsInputField } from "./settings-input-field";
import type { SettingsStore } from "@/lib/stores/settings-store";

interface SettingsBillingProps {
  settings: SettingsStore;
}

export function SettingsBilling({ settings }: SettingsBillingProps) {
  const { billing, updateBilling } = settings;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={CreditCard} title="Stripe Keys" description="Payment gateway credentials" iconBg="bg-rose-100" iconColor="text-rose-600" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsInputField label="Stripe Public Key" value={billing.stripePublicKey} icon={KeyRound} onChange={(v) => updateBilling({ stripePublicKey: v })} />
        <SettingsInputField label="Stripe Secret Key" value={billing.stripeSecretKey} icon={KeyRound} onChange={(v) => updateBilling({ stripeSecretKey: v })} />
      </div>
      <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-3">
        <p className="text-xs font-bold text-indigo-700">Secret keys are encrypted at rest. Never share them.</p>
      </div>
    </div>
  );
}
