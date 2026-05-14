import { Plus } from "lucide-react";
import { AdCampaignRow } from "./ad-campaign-row";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

interface AdCampaignTableProps {
  campaigns: AdCampaign[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onAdd: () => void;
}

export function AdCampaignTable({ campaigns, onEdit, onDelete, onToggle, onAdd }: AdCampaignTableProps) {
  return (
    <div className="elegant-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-bold text-slate-900">Ad Campaigns</p>
          <p className="text-xs text-slate-500">Upload image, video, or GIF ads for games</p>
        </div>
        <button onClick={onAdd} className="elegant-btn-primary flex items-center gap-1.5 text-xs py-2 px-3">
          <Plus className="h-3.5 w-3.5" /> Add Campaign
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Media</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Company</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Restaurant</th>
              <th className="px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Games</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Revenue</th>
              <th className="px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-4 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400"></th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <AdCampaignRow key={c.id} campaign={c} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
