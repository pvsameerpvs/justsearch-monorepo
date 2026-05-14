import { RevenueSplitPanel } from './revenue-split-panel';
import type { AdSplitData } from './types/revenue.types';

interface RevenueAdSplitProps {
  splitData: AdSplitData;
}

export function RevenueAdSplit({ splitData }: RevenueAdSplitProps) {
  return (
    <div className="space-y-4">
      <RevenueSplitPanel
        title="Restaurant Partner Ads"
        subtitle="Advertiser brought by restaurant"
        total={splitData.restaurantBrought.total}
        primaryLabel="Restaurant (60%)"
        primaryValue={splitData.restaurantBrought.restaurantShare}
        secondaryLabel="JustSearch (40%)"
        secondaryValue={splitData.restaurantBrought.platformShare}
        primaryColor="bg-amber-500"
        secondaryColor="bg-slate-500"
        highlightLabel="Restaurant gets"
        highlightValue={splitData.restaurantBrought.restaurantShare}
      />
      <RevenueSplitPanel
        title="Platform Partner Ads"
        subtitle="Advertiser brought by JustSearch"
        total={splitData.platformBrought.total}
        primaryLabel="JustSearch (60%)"
        primaryValue={splitData.platformBrought.platformShare}
        secondaryLabel="Restaurant (40%)"
        secondaryValue={splitData.platformBrought.restaurantShare}
        primaryColor="bg-emerald-500"
        secondaryColor="bg-slate-400"
        highlightLabel="JustSearch gets"
        highlightValue={splitData.platformBrought.platformShare}
      />
    </div>
  );
}
