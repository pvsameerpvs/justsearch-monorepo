import type { ReferralRecord } from '@/lib/stores/referral-store';

interface ReferralListProps {
  referrals: ReferralRecord[];
}

export function ReferralList({ referrals }: ReferralListProps) {
  if (referrals.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="font-bold text-slate-900">Your Referrals</h4>
      {referrals.map((ref) => (
        <div key={ref.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{ref.refereeName}</p>
            <p className="text-xs text-slate-500">{ref.refereePhone}</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-xs font-bold ${ref.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {ref.status === 'completed' ? `+${ref.rewardPoints} pts` : 'Pending'}
          </span>
        </div>
      ))}
    </div>
  );
}
