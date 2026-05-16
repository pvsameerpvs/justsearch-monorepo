'use client';

import { useAdsQuery, useCreateAdMutation, useUpdateAdMutation, useDeleteAdMutation } from '@/lib/hooks/use-ads-query';
import { useRestaurantsQuery } from '@/lib/hooks/use-restaurants-query';
import { useGamesQuery } from '@/lib/hooks/use-games-query';
import { AdCampaignPresenter } from './ad-campaign-presenter';

export function AdCampaignContainer() {
  const { ads: campaigns, isLoading: adsLoading } = useAdsQuery();
  const { restaurants, isLoading: restaurantsLoading } = useRestaurantsQuery();
  const { games, isLoading: gamesLoading } = useGamesQuery();
  const createAd = useCreateAdMutation();
  const updateAd = useUpdateAdMutation();
  const deleteAd = useDeleteAdMutation();

  if (adsLoading || restaurantsLoading || gamesLoading) return <div>Loading...</div>;

  const restaurantOptions = restaurants.map((r) => ({ id: r.id, name: r.name }));
  const gameOptions = games.map((g) => ({ id: g.id, name: g.name, icon: g.icon }));

  return (
    <AdCampaignPresenter
      campaigns={campaigns}
      restaurants={restaurantOptions}
      games={gameOptions}
      onAdd={(data) => createAd.mutateAsync(data)}
      onUpdate={(id, data) => updateAd.mutateAsync({ id, data })}
      onDelete={(id) => deleteAd.mutate(id)}
      isCreatePending={createAd.isPending}
      isUpdatePending={updateAd.isPending}
      createError={createAd.error}
      updateError={updateAd.error}
      onToggle={(id) => {
        const campaign = campaigns.find((c) => c.id === id);
        if (campaign) {
          updateAd.mutate({ id, data: { isActive: !campaign.isActive } });
        }
      }}
    />
  );
}
