"use client";

import { create } from 'zustand';
import { markAdShown } from '@/lib/ad-shown-tracker';
import { useAdAnalyticsStore } from '@/lib/stores/ad-analytics-store';
import { fetchActiveAds, preloadMedia } from './ad-fetcher';
import type { CampaignItem } from './ad-fetcher';

export type AdStatus = 'idle' | 'prefetching' | 'ready' | 'completed';

interface AdStore {
  ads: CampaignItem[];
  status: AdStatus;
  currentIndex: number;
  isMuted: boolean;

  prefetch: (gameId: string, restaurantId: string) => Promise<void>;
  advance: () => void;
  skipAll: (adId: string, gameId: string) => void;
  setMuted: (muted: boolean) => void;
  reset: () => void;
}

export const useAdStore = create<AdStore>((set, get) => ({
  ads: [],
  status: 'idle',
  currentIndex: 0,
  isMuted: true,

  prefetch: async (gameId, restaurantId) => {
    const { status } = get();
    if (status === 'prefetching' || status === 'ready') return;

    set({ status: 'prefetching' });

    const ads = await fetchActiveAds(gameId, restaurantId);
    if (ads.length > 1) {
      const shuffled = [...ads].sort(() => Math.random() - 0.5);
      preloadMedia(shuffled);
      set({ ads: shuffled, status: 'ready' });
    } else {
      set({ ads, status: 'ready' });
    }
  },

  advance: () => {
    const { ads, currentIndex } = get();

    if (currentIndex >= ads.length - 1) {
      set({ status: 'completed' });
      return;
    }

    set({ currentIndex: currentIndex + 1 });
  },

  skipAll: (adId, gameId) => {
    if (adId) {
      markAdShown(adId);
      useAdAnalyticsStore.getState().recordSkip(adId, gameId);
    }
    set({ status: 'completed' });
  },

  setMuted: (muted) => set({ isMuted: muted }),

  reset: () => set({ ads: [], status: 'idle', currentIndex: 0, isMuted: true }),
}));
