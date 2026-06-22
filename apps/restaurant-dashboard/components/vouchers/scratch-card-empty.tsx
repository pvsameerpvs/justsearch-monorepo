import { Info } from "lucide-react";

export function ScratchCardEmpty() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Reward Rules</h3>
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
        <Info className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-900 mb-1">No Rewards Configured</p>
        <p className="text-xs text-slate-500 mb-4">Create a voucher above first, then configure reward rules for your customers.</p>
      </div>
    </div>
  );
}
