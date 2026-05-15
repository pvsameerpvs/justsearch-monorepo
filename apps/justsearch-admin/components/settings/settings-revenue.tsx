"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, Percent, Receipt } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsInputField } from "./settings-input-field";
import type { SettingsStore, RevenueSettings } from "@/lib/stores/settings-store";

const revenueSchema = z.object({
  restaurantAdSplit: z.coerce.number().min(0, "Must be at least 0%").max(100, "Must be at most 100%"),
  platformAdSplit: z.coerce.number().min(0, "Must be at least 0%").max(100, "Must be at most 100%"),
  subscriptionPriceAED: z.coerce.number().min(0, "Price must be positive"),
  taxPercent: z.coerce.number().min(0, "Must be at least 0%").max(100, "Must be at most 100%"),
}).refine((data) => data.restaurantAdSplit + data.platformAdSplit === 100, {
  message: "Restaurant + Platform split must equal 100%",
  path: ["platformAdSplit"],
});

interface SettingsRevenueProps {
  settings: SettingsStore;
}

export function SettingsRevenue({ settings }: SettingsRevenueProps) {
  const { revenue, updateRevenue } = settings;

  const form = useForm<RevenueSettings>({
    resolver: zodResolver(revenueSchema),
    defaultValues: revenue,
    mode: "onChange",
  });

  const handleChange = (field: keyof RevenueSettings) => (value: string) => {
    const num = Number(value);
    form.setValue(field, num, { shouldValidate: true });
    updateRevenue({ [field]: num } as Partial<RevenueSettings>);
  };

  const crossError = form.formState.errors.platformAdSplit?.message;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={DollarSign} title="Revenue Split" description="Ad revenue share and pricing" iconBg="bg-emerald-100" iconColor="text-emerald-600" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsInputField label="Restaurant Ad Split (%)" value={String(form.watch("restaurantAdSplit"))} icon={Percent} onChange={handleChange("restaurantAdSplit")} error={form.formState.errors.restaurantAdSplit?.message} />
        <SettingsInputField label="Platform Ad Split (%)" value={String(form.watch("platformAdSplit"))} icon={Percent} onChange={handleChange("platformAdSplit")} error={form.formState.errors.platformAdSplit?.message} />
        <SettingsInputField label="Subscription Price (AED)" value={String(form.watch("subscriptionPriceAED"))} icon={Receipt} onChange={handleChange("subscriptionPriceAED")} error={form.formState.errors.subscriptionPriceAED?.message} />
        <SettingsInputField label="Tax Rate (%)" value={String(form.watch("taxPercent"))} icon={Percent} onChange={handleChange("taxPercent")} error={form.formState.errors.taxPercent?.message} />
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs font-bold text-amber-700">
          {crossError ?? "Restaurant + Platform split must equal 100%"}
        </p>
      </div>
    </div>
  );
}
