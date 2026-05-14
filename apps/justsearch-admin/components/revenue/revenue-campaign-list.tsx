import { Megaphone } from 'lucide-react';
import { RevenueCampaignRow } from './revenue-campaign-row';
import type { AdCampaign } from '@/lib/stores/ad-campaign-types';

interface RevenueCampaignListProps {
  campaigns: AdCampaign[];
}

export function RevenueCampaignList({ campaigns }: RevenueCampaignListProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-blue-500" />
        <h3 className="font-bold text-slate-900">Top Campaigns</h3>
      </div>
      <div className="mt-4 space-y-3">
        {campaigns.map((c) => (
          <RevenueCampaignRow key={c.id} campaign={c} />
        ))}
      </div>
    </div>
  );
}
