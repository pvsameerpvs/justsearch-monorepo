"use client";

import { Controller } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { AdMediaUpload } from "./ad-media-upload";
import { AdCampaignTypeSelect } from "./ad-campaign-type-select";
import { AdRestaurantSelect } from "./ad-restaurant-select";
import { AdGameSelector } from "./ad-game-selector";
import { AdFormDetails } from "./ad-form-details";
import type { GameOption, RestaurantOption } from "./ad-campaign.types";
import type { AdCampaignSchema } from "@/lib/validations/ad-campaign.schema";
import type { Control, FormState, UseFormWatch, UseFormSetValue } from "react-hook-form";

interface AdFormPresenterProps {
  control: Control<AdCampaignSchema>;
  formState: FormState<AdCampaignSchema>;
  watch: UseFormWatch<AdCampaignSchema>;
  setValue: UseFormSetValue<AdCampaignSchema>;
  isEdit: boolean;
  restaurants: RestaurantOption[];
  games: GameOption[];
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
  serverError: string | null;
}

export function AdFormPresenter({ control, formState, watch, setValue, isEdit, restaurants, games, onSubmit, onCancel, isPending, serverError }: AdFormPresenterProps) {
  const type = watch("type");
  const { errors } = formState;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {serverError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">🎬 Ad Media</h4>
        <Controller name="mediaUrl" control={control} render={({ field }) => (
          <AdMediaUpload mediaType={watch("mediaType")} mediaUrl={field.value} onChange={(t, u) => { setValue("mediaType", t); field.onChange(u); }} />
        )} />
        {errors.mediaUrl && <p className="mt-1 text-xs text-red-500">{errors.mediaUrl.message}</p>}
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">💰 Revenue Split</h4>
        <Controller name="type" control={control} render={({ field }) => (
          <AdCampaignTypeSelect value={field.value} onChange={field.onChange} />
        )} />
        {errors.type && <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>}
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">📝 Campaign Details</h4>
        <AdFormDetails control={control} errors={errors} />
      </section>

      {type === "restaurant_brought" && (
        <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">🏪 Restaurant</h4>
          <Controller name="restaurantId" control={control} render={({ field }) => (
            <AdRestaurantSelect value={field.value} restaurants={restaurants} onChange={(id) => { field.onChange(id); setValue("restaurantName", restaurants.find(r => r.id === id)?.name ?? null); }} />
          )} />
          {errors.restaurantId && <p className="mt-1 text-xs text-red-500">{errors.restaurantId.message}</p>}
        </section>
      )}

      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">🎮 Target Games</h4>
        <Controller name="assignedGames" control={control} render={({ field }) => (
          <AdGameSelector games={games} assignedGames={field.value} onToggle={(id) => field.onChange(field.value.includes(id) ? field.value.filter(g => g !== id) : [...field.value, id])} />
        )} />
        {errors.assignedGames && <p className="mt-1 text-xs text-red-500">{errors.assignedGames.message}</p>}
      </section>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isPending} className="elegant-btn-secondary flex-1 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={isPending} className="elegant-btn-primary flex-1 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50">
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Campaign"}
        </button>
      </div>
    </form>
  );
}
