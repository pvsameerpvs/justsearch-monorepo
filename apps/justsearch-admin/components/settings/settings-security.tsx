import { Shield, Lock, Timer } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsToggleRow } from "./settings-toggle-row";
import { SettingsSelectField } from "./settings-select-field";
import type { SettingsStore } from "@/lib/stores/settings-store";

interface SettingsSecurityProps {
  settings: SettingsStore;
}

export function SettingsSecurity({ settings }: SettingsSecurityProps) {
  const { security, updateSecurity } = settings;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={Shield} title="Security" description="Login and session controls" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
      <SettingsToggleRow
        label="Require 2FA for Admin Login"
        description="All admins must use two-factor authentication"
        icon={Lock}
        checked={security.require2FA}
        onChange={(v) => updateSecurity({ require2FA: v })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsSelectField label="Session Timeout (min)" value={String(security.sessionTimeoutMinutes)} icon={Timer} options={["30", "60", "120", "240"]} onChange={(v) => updateSecurity({ sessionTimeoutMinutes: Number(v) })} />
      </div>
    </div>
  );
}
