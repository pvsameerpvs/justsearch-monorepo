'use client';

import { useAdsQuery, useCreateAdMutation, useUpdateAdMutation, useDeleteAdMutation } from '@/lib/hooks/use-ads-query';
import { AdCampaignPresenter } from './ad-campaign-presenter';

export function AdCampaignContainer() {
  const { ads: campaigns, isLoading } = useAdsQuery();
  const createAd = useCreateAdMutation();
  const updateAd = useUpdateAdMutation();
  const deleteAd = useDeleteAdMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <AdCampaignPresenter
      campaigns={campaigns}
      onAdd={(data) => createAd.mutate(data)}
      onUpdate={(id, data) => updateAd.mutate({ id, data })}
      onDelete={(id) => deleteAd.mutate(id)}
      onToggle={(id) => {
        const campaign = campaigns.find((c) => c.id === id);
        if (campaign) {
          updateAd.mutate({ id, data: { isActive: !campaign.isActive } });
        }
      }}
    />
  );
}
