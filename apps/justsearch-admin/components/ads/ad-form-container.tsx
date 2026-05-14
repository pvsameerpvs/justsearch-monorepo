"use client";

import { useState } from "react";
import type { AdCampaign, AdCampaignFormData } from "@/lib/stores/ad-campaign-types";
import { AdFormPresenter } from "./ad-form-presenter";

interface AdFormContainerProps {
  campaign: AdCampaign | null;
  onSave: (data: AdCampaignFormData) => void;
  onCancel: () => void;
}

const DEMO_RESTAURANTS = [
  { id: "mosaic-table", name: "Mosaic Table" },
  { id: "spice-route", name: "Spice Route" },
  { id: "golden-spoon", name: "Golden Spoon" },
];

export function AdFormContainer({ campaign, onSave, onCancel }: AdFormContainerProps) {
  const [form, setForm] = useState<AdCampaignFormData>({
    title: campaign?.title ?? "",
    clientName: campaign?.clientName ?? "",
    companyName: campaign?.companyName ?? "",
    mediaType: campaign?.mediaType ?? "image",
    mediaUrl: campaign?.mediaUrl ?? "",
    duration: campaign?.duration ?? 15,
    type: campaign?.type ?? "restaurant_brought",
    restaurantId: campaign?.restaurantId ?? "mosaic-table",
    restaurantName: campaign?.restaurantName ?? "Mosaic Table",
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
    const r = DEMO_RESTAURANTS.find((x) => x.id === id);
    setForm((prev) => ({ ...prev, restaurantId: id, restaurantName: r?.name ?? "" }));
  };

  const handleSave = () => onSave(form);

  return (
    <AdFormPresenter
      form={form}
      isEdit={!!campaign}
      restaurants={DEMO_RESTAURANTS}
      onSetField={setField}
      onToggleGame={toggleGame}
      onSetRestaurant={setRestaurant}
      onSave={handleSave}
      onCancel={onCancel}
    />
  );
}
