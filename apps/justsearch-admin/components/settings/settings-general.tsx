"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Globe } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsGeneralFields } from "./settings-general-fields";
import type { SettingsStore, PlatformSettings } from "@/lib/stores/settings-store";

const platformSchema = z.object({
  platformName: z.string().min(1, "Platform name is required"),
  supportEmail: z.string().email("Valid email required"),
  supportPhone: z.string().min(5, "Valid phone number required"),
  defaultCurrency: z.string().min(1, "Currency is required"),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Valid hex color required"),
});

interface SettingsGeneralProps {
  settings: SettingsStore;
}

export function SettingsGeneral({ settings }: SettingsGeneralProps) {
  const { platform, updatePlatform } = settings;

  const form = useForm<PlatformSettings>({
    resolver: zodResolver(platformSchema),
    defaultValues: platform,
    mode: "onChange",
  });

  const handleChange = (field: keyof PlatformSettings) => (value: string) => {
    form.setValue(field, value, { shouldValidate: true });
    updatePlatform({ [field]: value } as Partial<PlatformSettings>);
  };

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={Globe} title="Platform Identity" description="Name, contact, and branding" iconBg="bg-indigo-100" iconColor="text-indigo-600" />
      <SettingsGeneralFields values={platform} errors={form.formState.errors as Partial<Record<keyof PlatformSettings, string>>} onChange={handleChange} />
    </div>
  );
}
