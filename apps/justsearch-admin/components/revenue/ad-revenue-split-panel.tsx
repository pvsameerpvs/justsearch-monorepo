import { SplitBar } from './split-bar';

interface AdRevenueSplitPanelProps {
  restaurantAdShare: number;
  justsearchAdShare: number;
  adRevenue: number;
}

export function AdRevenueSplitPanel({
  restaurantAdShare,
  justsearchAdShare,
  adRevenue,
}: AdRevenueSplitPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900">Ad Revenue Split</h3>
      <div className="mt-4 space-y-4">
        <SplitBar
          label="Restaurant (60%)"
          value={restaurantAdShare}
          total={adRevenue}
          color="bg-amber-500"
        />
        <SplitBar
          label="JustSearch (40%)"
          value={justsearchAdShare}
          total={adRevenue}
          color="bg-slate-500"
        />
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center">
        <p className="text-xs text-slate-500">Your Share (40%)</p>
        <p className="text-xl font-bold text-slate-900">
          AED {justsearchAdShare.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
