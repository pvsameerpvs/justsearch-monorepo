"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adCampaignSchema, type AdCampaignSchema } from "@/lib/validations/ad-campaign.schema";
import type { AdCampaign, AdCampaignFormData } from "@/lib/stores/ad-campaign-types";
import type { GameOption, RestaurantOption } from "./ad-campaign.types";
import { AdFormPresenter } from "./ad-form-presenter";
import { useAdCategoriesQuery, useCreateAdCategoryMutation, getCreateCategoryErrorMessage } from "@/lib/hooks/use-ad-categories-query";

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
  const { categories, isLoading: categoriesLoading } = useAdCategoriesQuery();
  const createCategory = useCreateAdCategoryMutation();
  const [categoryError, setCategoryError] = useState<string | null>(null);

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
      category: campaign?.category ?? "",
      budget: campaign?.budget ?? 0,
      costPerView3s: campaign?.costPerView3s ?? 0.30,
      costPerViewFull: campaign?.costPerViewFull ?? 1.00,
      costPerClick: campaign?.costPerClick ?? 5.00,
      startDate: campaign?.startDate ? campaign.startDate.slice(0, 16) : "",
      endDate: campaign?.endDate ? campaign.endDate.slice(0, 16) : "",
      visibility: campaign?.visibility ?? { title: true, description: false, linkUrl: true },
    },
  });

  useEffect(() => {
    if (campaign) {
      const matchedRestaurant = campaign.restaurantId
        ? restaurants.find((r) => r.id === campaign.restaurantId)
        : undefined;

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
        restaurantName: matchedRestaurant?.name ?? firstRestaurant?.name ?? null,
        assignedGames: campaign.assignedGames,
        isActive: campaign.isActive,
        category: campaign.category ?? "",
        budget: campaign.budget ?? 0,
        costPerView3s: campaign.costPerView3s ?? 0.30,
        costPerViewFull: campaign.costPerViewFull ?? 1.00,
        costPerClick: campaign.costPerClick ?? 5.00,
        startDate: campaign.startDate ? campaign.startDate.slice(0, 16) : "",
        endDate: campaign.endDate ? campaign.endDate.slice(0, 16) : "",
        visibility: campaign.visibility,
      });
    }
  }, [campaign, form, firstRestaurant, restaurants]);

  const handleSave = async (values: AdCampaignSchema) => {
    await onSave(values);
  };

  const handleAddCategory = async (name: string) => {
    setCategoryError(null);
    try {
      await createCategory.mutateAsync(name);
    } catch (err) {
      const reason = getCreateCategoryErrorMessage(err);
      setCategoryError(`Could not add "${name}" to category list: ${reason} The category name will still be saved with this campaign.`);
    }
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
      categories={categories}
      categoriesLoading={categoriesLoading}
      onAddCategory={handleAddCategory}
      categoryError={categoryError}
    />
  );
}
