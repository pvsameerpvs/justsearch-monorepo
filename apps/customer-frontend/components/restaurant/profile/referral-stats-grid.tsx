import { Users, Check, Gift } from 'lucide-react';

interface ReferralStatsGridProps {
  totalReferrals: number;
  completedCount: number;
}

export function ReferralStatsGrid({ totalReferrals, completedCount }: ReferralStatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
        <Users className="mx-auto h-5 w-5 text-slate-400" />
        <p className="mt-1 text-xl font-bold text-slate-900">{totalReferrals}</p>
        <p className="text-xs text-slate-500">Total Invited</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
        <Check className="mx-auto h-5 w-5 text-green-500" />
        <p className="mt-1 text-xl font-bold text-slate-900">{completedCount}</p>
        <p className="text-xs text-slate-500">Joined</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
        <Gift className="mx-auto h-5 w-5 text-amber-500" />
        <p className="mt-1 text-xl font-bold text-slate-900">{completedCount * 500}</p>
        <p className="text-xs text-slate-500">Points Earned</p>
      </div>
    </div>
  );
}
