"use client";

import { Controller } from "react-hook-form";
import { FileText, User, Building, Timer, Link } from "lucide-react";
import { AdFormField } from "./ad-form-field";
import { VisibilityOption } from "./visibility-option";
import type { Control, FieldErrors } from "react-hook-form";
import type { AdCampaignSchema } from "@/lib/validations/ad-campaign.schema";

interface AdFormDetailsProps {
  control: Control<AdCampaignSchema>;
  errors: FieldErrors<AdCampaignSchema>;
}

export function AdFormDetails({ control, errors }: AdFormDetailsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller name="title" control={control} render={({ field }) => (
        <AdFormField label="Ad Title" value={field.value} onChange={field.onChange} icon={FileText} placeholder="e.g. Summer Fragrance Collection" error={errors.title?.message} />
      )} />
      <Controller name="clientName" control={control} render={({ field }) => (
        <AdFormField label="Client Name" value={field.value} onChange={field.onChange} icon={User} placeholder="e.g. Ahmed Al-Rashid" error={errors.clientName?.message} />
      )} />
      <Controller name="companyName" control={control} render={({ field }) => (
        <AdFormField label="Company Name" value={field.value} onChange={field.onChange} icon={Building} placeholder="e.g. Desert Bloom Perfumes" error={errors.companyName?.message} />
      )} />
      <Controller name="duration" control={control} render={({ field }) => (
        <AdFormField label="Duration (seconds)" value={String(field.value)} onChange={(v) => field.onChange(Number(v))} type="number" icon={Timer} placeholder="15" error={errors.duration?.message} />
      )} />
      <div className="sm:col-span-2">
        <Controller name="linkUrl" control={control} render={({ field }) => (
          <AdFormField label="Click Link (URL)" value={field.value ?? ''} onChange={field.onChange} icon={Link} placeholder="https://example.com/offer" error={errors.linkUrl?.message} />
        )} />
      </div>

      <div className="sm:col-span-2 mt-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Frontend Display Settings
        </p>
        <Controller name="visibility" control={control} render={({ field }) => (
          <div className="space-y-2">
            <VisibilityOption label="Ad Title" fieldKey="title" value={field.value ?? {}} onChange={field.onChange} />
            <VisibilityOption label="Description" fieldKey="description" value={field.value ?? {}} onChange={field.onChange} />
            <VisibilityOption label="Clickable Link" fieldKey="linkUrl" value={field.value ?? {}} onChange={field.onChange} />
          </div>
        )} />
      </div>
    </div>
  );
}
