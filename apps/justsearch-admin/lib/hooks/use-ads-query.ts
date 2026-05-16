'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { uploadImage } from '@/lib/api/upload.api';
import type { AdCampaign, AdCampaignFormData } from '@/lib/stores/ad-campaign-types';
import { type DbAd, mapDbToCampaign, mapFormToDb, mapPartialFormToDb } from './ad-query-mappers';

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
    mutationFn: async (data: AdCampaignFormData) => {
      let mediaUrl = data.mediaUrl;
      if (mediaUrl && mediaUrl.startsWith('data:')) {
        mediaUrl = await uploadImage(mediaUrl, 'ads');
      }
      const payload = mapFormToDb({ ...data, mediaUrl });
      return apiClient<DbAd>('/advertisements', { method: 'POST', body: JSON.stringify(payload) });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADS_KEY }),
  });
}

export function useUpdateAdMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdCampaignFormData> }) => {
      let mediaUrl = data.mediaUrl;
      if (mediaUrl && mediaUrl.startsWith('data:')) {
        mediaUrl = await uploadImage(mediaUrl, 'ads');
      }

      // Full edit (has title) → map to DB shape; partial (toggle) → pass through
      const payload = 'title' in data && data.title !== undefined
        ? mapPartialFormToDb({ ...data, mediaUrl })
        : mediaUrl !== undefined ? { ...data, mediaUrl } : data;

      return apiClient<DbAd>(`/advertisements/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
    },
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
