"use client";

import { useState } from "react";
import type { AdCampaign, AdCampaignFormData } from "@/lib/stores/ad-campaign-types";
import type { GameOption, RestaurantOption } from "./ad-campaign.types";
import { AdFormPresenter } from "./ad-form-presenter";

interface AdFormContainerProps {
  campaign: AdCampaign | null;
  restaurants: RestaurantOption[];
  games: GameOption[];
  onSave: (data: AdCampaignFormData) => void;
  onCancel: () => void;
}

export function AdFormContainer({ campaign, restaurants, games, onSave, onCancel }: AdFormContainerProps) {
  const firstRestaurant = restaurants[0];
  const [form, setForm] = useState<AdCampaignFormData>({
    title: campaign?.title ?? "",
    clientName: campaign?.clientName ?? "",
    companyName: campaign?.companyName ?? "",
    mediaType: campaign?.mediaType ?? "image",
    mediaUrl: campaign?.mediaUrl ?? "",
    duration: campaign?.duration ?? 15,
    type: campaign?.type ?? "restaurant_brought",
    restaurantId: campaign?.restaurantId ?? firstRestaurant?.id ?? "",
    restaurantName: campaign?.restaurantName ?? firstRestaurant?.name ?? "",
    assignedGames: campaign?.assignedGames ?? [],
  });

  const setField = <K extends keyof AdCampaignFormData>(key: K, value: AdCampaignFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleGame = (gameId: string) => {
    setForm((prev) => ({
      ...prev,
      assignedGames: prev.assignedGames.includes(gameId)
        ? prev.assignedGames.filter((g) => g !== gameId)
        : [...prev.assignedGames, gameId],
    }));
  };

  const setRestaurant = (id: string) => {
    const r = restaurants.find((x) => x.id === id);
    setForm((prev) => ({ ...prev, restaurantId: id, restaurantName: r?.name ?? "" }));
  };

  const handleSave = () => {
    const mapped = {
      name: `${form.title} — ${form.companyName}`,
      type: form.type,
      content: form.clientName,
      imageUrl: form.mediaUrl,
      duration: form.duration,
      assignedGames: form.assignedGames,
      targetRestaurants: form.restaurantId ? [form.restaurantId] : [],
      isActive: form.isActive ?? true,
    };
    onSave(mapped as unknown as AdCampaignFormData);
  };

  return (
    <AdFormPresenter
      form={form}
      isEdit={!!campaign}
      restaurants={restaurants}
      games={games}
      onSetField={setField}
      onToggleGame={toggleGame}
      onSetRestaurant={setRestaurant}
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
}
