"use client";

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { useReferralStore } from '@/lib/stores/referral-store';
import { useRegistration } from '@/components/auth/registration-context';
import { Share2, Copy, Check, Gift, Users } from 'lucide-react';

export function ReferralSystem() {
  const { user } = useRegistration();
  const { generateReferralLink, getReferralsByUser, totalReferrals } = useReferralStore();
  const [copied, setCopied] = useState(false);

  const phone = user?.mobile ?? 'guest';
  const link = generateReferralLink('mosaic-table', phone);
  const myReferrals = getReferralsByUser(phone);
  const completedCount = myReferrals.filter((r: { status: string }) => r.status === 'completed').length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join me at Mosaic Table!',
          text: 'Scan the QR code and get 500 bonus points!',
          url: link,
        });
      }
    } catch {
      // ignore
    }
  };

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
        <div className="mt-2 flex gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:bg-slate-200"
          >
            {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={handleShare} className="flex-1 bg-amber-500 hover:bg-amber-600">
            <Share2 className="mr-2 h-4 w-4" />
            Share Link
          </Button>
        </div>
      </div>

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

      {myReferrals.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900">Your Referrals</h4>
          {myReferrals.map((ref) => (
            <div key={ref.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{ref.refereeName}</p>
                <p className="text-xs text-slate-500">{ref.refereePhone}</p>
              </div>
              <span
                className={`rounded-full px-2 py-1 text-xs font-bold ${
                  ref.status === 'completed'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {ref.status === 'completed' ? `+${ref.rewardPoints} pts` : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
