"use client";

import { create } from 'zustand';

interface AdEvent {
  campaignId: string;
  type: 'impression' | 'skip' | 'complete';
  timestamp: string;
  gameId: string;
}

interface AdAnalyticsStore {
  events: AdEvent[];
  recordImpression: (campaignId: string, gameId: string) => void;
  recordSkip: (campaignId: string, gameId: string) => void;
  recordComplete: (campaignId: string, gameId: string) => void;
}

export const useAdAnalyticsStore = create<AdAnalyticsStore>((set) => ({
  events: [],
  recordImpression: (campaignId, gameId) =>
    set((state) => ({
      events: [...state.events, { campaignId, type: 'impression', timestamp: new Date().toISOString(), gameId }],
    })),
  recordSkip: (campaignId, gameId) =>
    set((state) => ({
      events: [...state.events, { campaignId, type: 'skip', timestamp: new Date().toISOString(), gameId }],
    })),
  recordComplete: (campaignId, gameId) =>
    set((state) => ({
      events: [...state.events, { campaignId, type: 'complete', timestamp: new Date().toISOString(), gameId }],
    })),
}));
