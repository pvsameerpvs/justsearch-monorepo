"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ReferralRecord = {
  id: string;
  referrerPhone: string;
  refereePhone: string;
  refereeName: string;
  status: 'pending' | 'completed';
  rewardPoints: number;
  createdAt: string;
  completedAt?: string;
};

interface ReferralStore {
  referrals: ReferralRecord[];
  myReferralCode: string;
  totalReferrals: number;
  addReferral: (referrerPhone: string, refereePhone: string, refereeName: string) => void;
  completeReferral: (id: string) => void;
  generateReferralLink: (restaurantSlug: string, userPhone: string) => string;
  getReferralsByUser: (phone: string) => ReferralRecord[];
}

function generateReferralCode(phone: string): string {
  const hash = phone.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `REF${hash.toString(36).toUpperCase().slice(0, 6)}`;
}

export const useReferralStore = create<ReferralStore>()(
  persist(
    (set, get) => ({
      referrals: [],
      myReferralCode: '',
      totalReferrals: 0,
      addReferral: (referrerPhone, refereePhone, refereeName) => {
        const code = generateReferralCode(referrerPhone);
        set((state) => ({
          referrals: [
            ...state.referrals,
            {
              id: crypto.randomUUID(),
              referrerPhone,
              refereePhone,
              refereeName,
              status: 'pending',
              rewardPoints: 500,
              createdAt: new Date().toISOString(),
            },
          ],
          myReferralCode: code,
          totalReferrals: state.totalReferrals + 1,
        }));
      },
      completeReferral: (id) =>
        set((state) => ({
          referrals: state.referrals.map((r) =>
            r.id === id
              ? { ...r, status: 'completed' as const, completedAt: new Date().toISOString() }
              : r
          ),
        })),
      generateReferralLink: (restaurantSlug, userPhone) => {
        const code = generateReferralCode(userPhone);
        return `https://${restaurantSlug}-booking.js-restorant.com/?ref=${code}`;
      },
      getReferralsByUser: (phone) =>
        get().referrals.filter((r) => r.referrerPhone === phone),
    }),
    { name: 'justsearch-referrals' }
  )
);
