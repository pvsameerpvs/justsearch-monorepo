"use client";

import { useRegistration } from '@/components/auth/registration-context';
import { useReferralStore } from '@/lib/stores/referral-store';
import { Gift } from 'lucide-react';
import { ReferralCodeDisplay } from './referral-code-display';
import { ReferralShareActions } from './referral-share-actions';
import { ReferralStatsGrid } from './referral-stats-grid';
import { ReferralList } from './referral-list';

export function ReferralSystem() {
  const { user } = useRegistration();
  const { generateReferralLink, getReferralsByUser, totalReferrals } = useReferralStore();
  const phone = user?.mobile ?? 'guest';
  const link = generateReferralLink('mosaic-table', phone);
  const myReferrals = getReferralsByUser(phone);
  const completedCount = myReferrals.filter((r) => r.status === 'completed').length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Refer & Earn</h3>
            <p className="text-sm text-slate-600">Get 500 points per friend who joins</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-700">Your Referral Link</p>
        <ReferralCodeDisplay link={link} />
        <ReferralShareActions link={link} />
      </div>

      <ReferralStatsGrid totalReferrals={totalReferrals} completedCount={completedCount} />
      <ReferralList referrals={myReferrals} />
    </div>
  );
}
