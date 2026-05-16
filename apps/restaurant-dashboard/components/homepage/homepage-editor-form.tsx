import { Controller } from "react-hook-form";
import { ImagePlus, Type, Tag, Clock } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { SectionCard } from "@/components/ui/form-field";
import { HomepageTextField } from "./homepage-text-field";
import { HomepageLivePreview } from "./homepage-live-preview";
import { OpeningHoursEditorForm } from "./opening-hours-editor-form";
import { EditorActions } from "./editor-actions";
import { useHomepageEditor } from "./use-homepage-editor";
import type { RestaurantProfile } from "@/lib/hooks/use-restaurant-query";

interface HomepageEditorFormProps {
  restaurant: RestaurantProfile;
  onUpdate: (updates: Partial<RestaurantProfile>) => void;
  isSaving?: boolean;
}

export function HomepageEditorForm({ restaurant, onUpdate, isSaving }: HomepageEditorFormProps) {
  const { control, handleSubmit, formState, reset, buildUpdate, setValue, watch } = useHomepageEditor(restaurant);
  const onSubmit = () => onUpdate(buildUpdate());
  const t = restaurant.theme;

  const openingHours = watch("openingHours");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <HomepageLivePreview control={control} theme={t} />
      <SectionCard icon={ImagePlus} title="Menu Background Image" accent={`rgb(${t.brandColor})`}>
        <Controller name="heroImageUrl" control={control} render={({ field }) => (
          <ImageUpload value={field.value || ""} onChange={field.onChange} label="Menu Hero" aspect="landscape" folder="restaurants" />
        )} />
      </SectionCard>
      <SectionCard icon={ImagePlus} title="Logo" accent={`rgb(${t.brandColor})`}>
        <Controller name="logoUrl" control={control} render={({ field }) => (
          <ImageUpload value={field.value || ""} onChange={field.onChange} label="Restaurant Logo" aspect="square" size="compact" folder="restaurants" />
        )} />
      </SectionCard>
      <SectionCard icon={Type} title="Restaurant Name & Tagline" accent={`rgb(${t.brandColor})`}>
        <div className="space-y-3">
          <HomepageTextField control={control} name="name" label="Name" placeholder="e.g. Mosaic Table" />
          <HomepageTextField control={control} name="tagline" label="Tagline" placeholder="e.g. Where every meal becomes a memory" />
          <HomepageTextField control={control} name="description" label="Description" placeholder="Short description shown on homepage and menu hero" />
        </div>
      </SectionCard>
      <SectionCard icon={Tag} title="Menu Header Labels" accent={`rgb(${t.accentColor})`}>
        <div className="space-y-3">
          <HomepageTextField control={control} name="category" label="Category Eyebrow" placeholder="e.g. Fine Dining" />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cuisine Tags (comma separated)</label>
            <Controller name="cuisine" control={control} render={({ field }) => (
              <input {...field} placeholder="Mediterranean, Middle Eastern, Modern European" className="elegant-input w-full mt-1" />
            )} />
          </div>
        </div>
      </SectionCard>
      <SectionCard icon={Clock} title="Opening Hours" accent={`rgb(${t.brandColor})`}>
        <Controller
          name="openingHours"
          control={control}
          render={({ field }) => (
            <OpeningHoursEditorForm
              hours={field.value}
              onChange={(v: import("./opening-hours-editor").OpeningHourRow[]) => setValue("openingHours", v, { shouldDirty: true })}
              accent={`rgb(${t.brandColor})`}
            />
          )}
        />
      </SectionCard>
      <EditorActions hasChanges={formState.isDirty} onReset={reset} onSave={handleSubmit(onSubmit)} isSaving={isSaving} />
    </form>
  );
}
