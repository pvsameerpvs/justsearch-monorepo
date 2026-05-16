'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { AdCampaign, AdCampaignFormData } from '@/lib/stores/ad-campaign-types';

const ADS_KEY = ['advertisements'] as const;

type DbAd = {
  id: string;
  name: string;
  type: string;
  mediaType: string;
  content: string | null;
  imageUrl: string | null;
  duration: number;
  assignedGames: string[];
  targetRestaurants: string[];
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

function mapDbToCampaign(db: DbAd): AdCampaign {
  const nameParts = db.name.split(' — ');
  return {
    id: db.id,
    title: nameParts[0] || db.name,
    clientName: db.content ?? '',
    companyName: nameParts[1] || '',
    mediaType: db.mediaType as 'image' | 'video' | 'gif',
    mediaUrl: db.imageUrl ?? '',
    duration: db.duration ?? 15,
    type: db.type as 'restaurant_brought' | 'platform',
    restaurantId: db.targetRestaurants?.[0] ?? null,
    restaurantName: null,
    assignedGames: db.assignedGames ?? [],
    isActive: db.isActive,
    impressions: 0,
    skips: 0,
    completions: 0,
    revenue: 0,
    createdAt: db.createdAt,
  };
}

function mapFormToDb(data: AdCampaignFormData) {
  return {
    name: `${data.title} — ${data.companyName}`,
    type: data.type,
    mediaType: data.mediaType,
    content: data.clientName,
    imageUrl: data.mediaUrl,
    duration: data.duration,
    assignedGames: data.assignedGames,
    targetRestaurants: data.restaurantId ? [data.restaurantId] : [],
    isActive: data.isActive ?? true,
  };
}

async function fetchAds(): Promise<AdCampaign[]> {
  const res = await apiClient<{ advertisements: DbAd[] }>('/advertisements');
  return res.advertisements.map(mapDbToCampaign);
}

export function useAdsQuery() {
  const { data: ads = [], isLoading, error } = useQuery({
    queryKey: ADS_KEY,
    queryFn: fetchAds,
  });
  return { ads, isLoading, error };
}

export function useCreateAdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdCampaignFormData) =>
      apiClient<DbAd>('/advertisements', { method: 'POST', body: JSON.stringify(mapFormToDb(data)) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADS_KEY }),
  });
}

export function useUpdateAdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdCampaignFormData> }) =>
      apiClient<DbAd>(`/advertisements/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADS_KEY }),
  });
}

export function useDeleteAdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient<void>(`/advertisements/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADS_KEY }),
  });
}
