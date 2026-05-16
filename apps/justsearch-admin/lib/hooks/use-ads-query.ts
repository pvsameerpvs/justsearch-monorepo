'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { AdCampaign, AdCampaignFormData } from '@/lib/stores/ad-campaign-types';
import { type DbAd, mapDbToCampaign, mapFormToDb } from './ad-query-mappers';

const ADS_KEY = ['advertisements'] as const;

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
