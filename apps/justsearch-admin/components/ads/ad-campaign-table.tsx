import { Pencil, Trash2, Plus, Eye, EyeOff, Image, Video, FileImage, Gamepad2 } from "lucide-react";
import { AdCampaignTypeBadge } from "./ad-campaign-type-badge";
import type { AdCampaign } from "@/lib/stores/ad-campaign-types";

const MEDIA_ICONS = {
  image: Image,
  video: Video,
  gif: FileImage,
};

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
            {campaigns.map((c) => {
              const MediaIcon = MEDIA_ICONS[c.mediaType];
              return (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 overflow-hidden">
                        {c.mediaType === 'video' ? (
                          <Video className="h-4 w-4 text-slate-500" />
                        ) : (
                          <img src={c.mediaUrl} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <MediaIcon className="h-3 w-3 text-slate-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-slate-900">{c.companyName}</p>
                    <p className="text-[10px] text-slate-500">{c.clientName}</p>
                  </td>
                  <td className="px-4 py-3"><AdCampaignTypeBadge type={c.type} /></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{c.restaurantName ?? "All"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Gamepad2 className="h-3 w-3" />
                      {c.assignedGames.length} games
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs font-mono text-slate-700">{c.duration}s</td>
                  <td className="px-4 py-3 text-right text-xs font-mono font-bold text-amber-600">AED {c.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => onToggle(c.id)} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {c.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {c.isActive ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => onEdit(c.id)} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"><Pencil className="h-3 w-3" /></button>
                      <button onClick={() => onDelete(c.id)} className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
