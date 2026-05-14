import { Eye, CheckCircle } from 'lucide-react';
import type { AdCampaign } from '@/lib/stores/ad-campaign-types';

interface RevenueCampaignRowProps {
  campaign: AdCampaign;
}

export function RevenueCampaignRow({ campaign }: RevenueCampaignRowProps) {
  const ctr = campaign.impressions > 0 ? Math.round((campaign.completions / campaign.impressions) * 100) : 0;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <span className="text-xs font-bold text-blue-600">{campaign.companyName.charAt(0)}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{campaign.title}</p>
        <p className="truncate text-xs text-slate-500">{campaign.companyName}</p>
        <div className="mt-1 flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{campaign.impressions.toLocaleString()}</span>
          <span className="flex items-center gap-0.5"><CheckCircle className="h-3 w-3" />{ctr}% CTR</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">AED {campaign.revenue.toLocaleString()}</p>
        <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${campaign.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {campaign.isActive ? 'Active' : 'Paused'}
        </span>
      </div>
    </div>
  );
}
