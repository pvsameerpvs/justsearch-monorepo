import { Globe, Mail, Phone } from "lucide-react";
import { SettingsInputField } from "./settings-input-field";
import { SettingsSelectField } from "./settings-select-field";
import { SettingsColorField } from "./settings-color-field";
import type { PlatformSettings } from "@/lib/stores/settings-store";

interface SettingsGeneralFieldsProps {
  values: PlatformSettings;
  errors: Partial<Record<keyof PlatformSettings, string>>;
  onChange: (field: keyof PlatformSettings) => (value: string) => void;
}

export function SettingsGeneralFields({ values, errors, onChange }: SettingsGeneralFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SettingsInputField label="Platform Name" value={values.platformName} icon={Globe} onChange={onChange("platformName")} error={errors.platformName} />
      <SettingsInputField label="Support Email" value={values.supportEmail} icon={Mail} onChange={onChange("supportEmail")} error={errors.supportEmail} />
      <SettingsInputField label="Support Phone" value={values.supportPhone} icon={Phone} onChange={onChange("supportPhone")} error={errors.supportPhone} />
      <SettingsSelectField label="Currency" value={values.defaultCurrency} icon={Globe} options={["AED", "USD", "EUR"]} onChange={onChange("defaultCurrency")} error={errors.defaultCurrency} />
      <SettingsColorField label="Primary Color" value={values.primaryColor} onChange={onChange("primaryColor")} error={errors.primaryColor} />
    </div>
  );
}
