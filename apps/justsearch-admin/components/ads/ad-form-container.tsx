"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adCampaignSchema, type AdCampaignSchema } from "@/lib/validations/ad-campaign.schema";
import type { AdCampaign, AdCampaignFormData } from "@/lib/stores/ad-campaign-types";
import type { GameOption, RestaurantOption } from "./ad-campaign.types";
import { AdFormPresenter } from "./ad-form-presenter";

interface AdFormContainerProps {
  campaign: AdCampaign | null;
  restaurants: RestaurantOption[];
  games: GameOption[];
  onSave: (data: AdCampaignFormData) => Promise<unknown>;
  onCancel: () => void;
  isPending: boolean;
  serverError: string | null;
}

export function AdFormContainer({ campaign, restaurants, games, onSave, onCancel, isPending, serverError }: AdFormContainerProps) {
  const firstRestaurant = restaurants[0];

  const form = useForm<AdCampaignSchema>({
    resolver: zodResolver(adCampaignSchema),
    defaultValues: {
      title: campaign?.title ?? "",
      clientName: campaign?.clientName ?? "",
      companyName: campaign?.companyName ?? "",
      mediaType: campaign?.mediaType ?? "image",
      mediaUrl: campaign?.mediaUrl ?? "",
      mediaUrlLow: campaign?.mediaUrlLow ?? "",
      linkUrl: campaign?.linkUrl ?? "",
      duration: campaign?.duration ?? 15,
      type: campaign?.type ?? "restaurant_brought",
      restaurantId: campaign?.restaurantId ?? firstRestaurant?.id ?? null,
      restaurantName: campaign?.restaurantName ?? firstRestaurant?.name ?? null,
      assignedGames: campaign?.assignedGames ?? [],
      isActive: campaign?.isActive ?? true,
      category: campaign?.category ?? "Restaurant",
      budget: campaign?.budget ?? 0,
      costPerImpression: campaign?.costPerImpression ?? 5,
      startDate: campaign?.startDate ? campaign.startDate.slice(0, 16) : "",
      endDate: campaign?.endDate ? campaign.endDate.slice(0, 16) : "",
      visibility: campaign?.visibility ?? { title: true, description: false, linkUrl: true },
    },
  });

  useEffect(() => {
    if (campaign) {
      form.reset({
        title: campaign.title,
        clientName: campaign.clientName,
        companyName: campaign.companyName,
        mediaType: campaign.mediaType,
        mediaUrl: campaign.mediaUrl,
        mediaUrlLow: campaign.mediaUrlLow ?? "",
        linkUrl: campaign.linkUrl ?? "",
        duration: campaign.duration,
        type: campaign.type,
        restaurantId: campaign.restaurantId ?? firstRestaurant?.id ?? null,
        restaurantName: campaign.restaurantName ?? firstRestaurant?.name ?? null,
        assignedGames: campaign.assignedGames,
        isActive: campaign.isActive,
        category: campaign.category ?? "Restaurant",
        budget: campaign.budget ?? 0,
        costPerImpression: campaign.costPerImpression ?? 5,
        startDate: campaign.startDate ? campaign.startDate.slice(0, 16) : "",
        endDate: campaign.endDate ? campaign.endDate.slice(0, 16) : "",
        visibility: campaign.visibility,
      });
    }
  }, [campaign, form, firstRestaurant]);

  const handleSave = async (values: AdCampaignSchema) => {
    await onSave(values);
  };

  return (
    <AdFormPresenter
      control={form.control}
      formState={form.formState}
      watch={form.watch}
      setValue={form.setValue}
      isEdit={!!campaign}
      restaurants={restaurants}
      games={games}
      onSubmit={form.handleSubmit(handleSave)}
      onCancel={onCancel}
      isPending={isPending}
      serverError={serverError}
    />
  );
}
