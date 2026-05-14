import { AdFormField } from "./ad-form-field";
import { FileText, User, Building, Timer } from "lucide-react";
import type { AdCampaignFormData } from "@/lib/stores/ad-campaign-types";

interface AdFormDetailsProps {
  form: AdCampaignFormData;
  onSetField: <K extends keyof AdCampaignFormData>(key: K, value: AdCampaignFormData[K]) => void;
}

export function AdFormDetails({ form, onSetField }: AdFormDetailsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <AdFormField
        label="Ad Title"
        value={form.title}
        onChange={(v) => onSetField("title", v)}
        icon={FileText}
        placeholder="e.g. Summer Fragrance Collection"
      />
      <AdFormField
        label="Client Name"
        value={form.clientName}
        onChange={(v) => onSetField("clientName", v)}
        icon={User}
        placeholder="e.g. Ahmed Al-Rashid"
      />
      <AdFormField
        label="Company Name"
        value={form.companyName}
        onChange={(v) => onSetField("companyName", v)}
        icon={Building}
        placeholder="e.g. Desert Bloom Perfumes"
      />
      <AdFormField
        label="Duration (seconds)"
        value={String(form.duration)}
        onChange={(v) => onSetField("duration", Number(v))}
        type="number"
        icon={Timer}
        placeholder="15"
      />
    </div>
  );
}
