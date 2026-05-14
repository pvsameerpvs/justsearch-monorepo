import { Megaphone, Building2 } from "lucide-react";
import type { AdCampaignType } from "@/lib/stores/ad-campaign-types";

const OPTIONS: { value: AdCampaignType; label: string; desc: string; icon: typeof Building2 }[] = [
  {
    value: "restaurant_brought",
    label: "Restaurant Brought Client",
    desc: "Restaurant gets 60% of ad revenue",
    icon: Building2,
  },
  {
    value: "platform",
    label: "Platform Advertiser",
    desc: "JustSearch gets 60% of ad revenue",
    icon: Megaphone,
  },
];

interface AdCampaignTypeSelectProps {
  value: AdCampaignType;
  onChange: (type: AdCampaignType) => void;
}

export function AdCampaignTypeSelect({ value, onChange }: AdCampaignTypeSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-700">Campaign Type</label>
      <div className="grid grid-cols-2 gap-3">
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
                active
                  ? "border-indigo-500 bg-indigo-50 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className={`flex items-center gap-2 ${active ? "text-indigo-700" : "text-slate-700"}`}>
                <Icon className="h-4 w-4" />
                <span className="text-sm font-bold">{opt.label}</span>
              </div>
              <span className="text-[11px] text-slate-500">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
