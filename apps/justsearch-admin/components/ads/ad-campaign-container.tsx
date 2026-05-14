"use client";

import { useAdCampaignStore } from "@/lib/stores/ad-campaign-store";
import { AdCampaignPresenter } from "./ad-campaign-presenter";

export function AdCampaignContainer() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, toggleActive } = useAdCampaignStore();

  return (
    <AdCampaignPresenter
      campaigns={campaigns}
      onAdd={addCampaign}
      onUpdate={updateCampaign}
      onDelete={deleteCampaign}
      onToggle={toggleActive}
    />
  );
}
