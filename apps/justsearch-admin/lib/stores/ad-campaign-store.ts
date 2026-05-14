"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdCampaign, AdCampaignFormData, AdCampaignStats } from './ad-campaign-types';

const BASE_DATE = new Date();
const d = (days: number) => new Date(BASE_DATE.getTime() + days * 86400000).toISOString().split('T')[0];

const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'ad-1',
    title: 'Summer Fragrance Collection',
    clientName: 'Ahmed Al-Rashid',
    companyName: 'Desert Bloom Perfumes',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=300&fit=crop',
    duration: 15,
    type: 'restaurant_brought',
    restaurantId: 'mosaic-table',
    restaurantName: 'Mosaic Table',
    assignedGames: ['1', '2'],
    isActive: true,
    impressions: 3420,
    skips: 890,
    completions: 2530,
    revenue: 12650,
    createdAt: d(-30),
  },
  {
    id: 'ad-2',
    title: 'Luxury Watch Flash Sale',
    clientName: 'Fatima Hassan',
    companyName: 'Golden Hour Watches',
    mediaType: 'gif',
    mediaUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2x1Y3JkZ3Q1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1ZzZ1Zw/giphy.gif',
    duration: 20,
    type: 'restaurant_brought',
    restaurantId: 'mosaic-table',
    restaurantName: 'Mosaic Table',
    assignedGames: ['1'],
    isActive: true,
    impressions: 2150,
    skips: 520,
    completions: 1630,
    revenue: 8150,
    createdAt: d(-20),
  },
  {
    id: 'ad-3',
    title: 'Organic Skincare Launch',
    clientName: 'Priya Nair',
    companyName: 'Glow Naturally',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 12,
    type: 'restaurant_brought',
    restaurantId: 'spice-route',
    restaurantName: 'Spice Route',
    assignedGames: ['2', '3'],
    isActive: true,
    impressions: 1890,
    skips: 430,
    completions: 1460,
    revenue: 5840,
    createdAt: d(-15),
  },
  {
    id: 'ad-4',
    title: 'Coca-Cola Summer Vibes',
    clientName: 'Coca-Cola ME',
    companyName: 'Coca-Cola Middle East',
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop',
    duration: 10,
    type: 'platform',
    restaurantId: null,
    restaurantName: null,
    assignedGames: ['1', '2', '3', '4', '5'],
    isActive: true,
    impressions: 12500,
    skips: 3100,
    completions: 9400,
    revenue: 47000,
    createdAt: d(-45),
  },
  {
    id: 'ad-5',
    title: 'Dubai Fitness Challenge',
    clientName: 'Fitness First UAE',
    companyName: 'Fitness First',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: 18,
    type: 'platform',
    restaurantId: null,
    restaurantName: null,
    assignedGames: ['3', '4'],
    isActive: false,
    impressions: 8900,
    skips: 2400,
    completions: 6500,
    revenue: 32500,
    createdAt: d(-60),
  },
];

interface AdCampaignStore {
  campaigns: AdCampaign[];
  addCampaign: (data: AdCampaignFormData) => void;
  updateCampaign: (id: string, data: Partial<AdCampaignFormData>) => void;
  deleteCampaign: (id: string) => void;
  toggleActive: (id: string) => void;
  getStats: () => AdCampaignStats;
  getCampaignsByRestaurant: (restaurantId: string) => AdCampaign[];
  getCampaignsByGame: (gameId: string) => AdCampaign[];
}

export const useAdCampaignStore = create<AdCampaignStore>()(
  persist(
    (set, get) => ({
      campaigns: INITIAL_CAMPAIGNS,
      addCampaign: (data) =>
        set((state) => ({
          campaigns: [
            ...state.campaigns,
            {
              id: `ad-${Date.now()}`,
              ...data,
              isActive: true,
              impressions: 0,
              skips: 0,
              completions: 0,
              revenue: 0,
              createdAt: new Date().toISOString().split('T')[0],
            },
          ],
        })),
      updateCampaign: (id, data) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
      deleteCampaign: (id) =>
        set((state) => ({
          campaigns: state.campaigns.filter((c) => c.id !== id),
        })),
      toggleActive: (id) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) =>
            c.id === id ? { ...c, isActive: !c.isActive } : c
          ),
        })),
      getStats: () => {
        const campaigns = get().campaigns;
        return {
          total: campaigns.length,
          active: campaigns.filter((c) => c.isActive).length,
          restaurantBrought: campaigns.filter((c) => c.type === 'restaurant_brought').length,
          platform: campaigns.filter((c) => c.type === 'platform').length,
          totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
          totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
          totalCompletions: campaigns.reduce((sum, c) => sum + c.completions, 0),
        };
      },
      getCampaignsByRestaurant: (restaurantId) => {
        return get().campaigns.filter(
          (c) => c.restaurantId === restaurantId || c.type === 'platform'
        );
      },
      getCampaignsByGame: (gameId) => {
        return get().campaigns.filter(
          (c) => c.isActive && c.assignedGames.includes(gameId)
        );
      },
    }),
    { name: 'ad-campaign-store' }
  )
);
