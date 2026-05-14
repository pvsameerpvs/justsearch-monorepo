import { Globe, Mail, Phone } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsInputField } from "./settings-input-field";
import { SettingsSelectField } from "./settings-select-field";
import { SettingsColorField } from "./settings-color-field";
import type { SettingsStore } from "@/lib/stores/settings-store";

interface SettingsGeneralProps {
  settings: SettingsStore;
}

export function SettingsGeneral({ settings }: SettingsGeneralProps) {
  const { platform, updatePlatform } = settings;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader
        icon={Globe}
        title="Platform Identity"
        description="Name, contact, and branding"
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsInputField label="Platform Name" value={platform.platformName} icon={Globe} onChange={(v) => updatePlatform({ platformName: v })} />
        <SettingsInputField label="Support Email" value={platform.supportEmail} icon={Mail} onChange={(v) => updatePlatform({ supportEmail: v })} />
        <SettingsInputField label="Support Phone" value={platform.supportPhone} icon={Phone} onChange={(v) => updatePlatform({ supportPhone: v })} />
        <SettingsSelectField label="Currency" value={platform.defaultCurrency} icon={Globe} options={["AED", "USD", "EUR"]} onChange={(v) => updatePlatform({ defaultCurrency: v })} />
        <SettingsColorField label="Primary Color" value={platform.primaryColor} onChange={(v) => updatePlatform({ primaryColor: v })} />
      </div>
    </div>
  );
}
