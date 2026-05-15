import { ImagePlus, Type, Tag, Clock, Calendar } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { SectionCard, FormField } from "@/components/ui/form-field";
import { MenuHeroPreview } from "./menu-hero-preview";
import { EditorActions } from "./editor-actions";
import { useHomepageEditor } from "./use-homepage-editor";
import type { Restaurant } from "@justsearch/utils";

interface HomepageEditorFormProps {
  restaurant: Restaurant;
  onUpdate: (updates: Partial<Restaurant>) => void;
  isSaving?: boolean;
}

export function HomepageEditorForm({ restaurant, onUpdate, isSaving }: HomepageEditorFormProps) {
  const { watch, setValue, handleSubmit, formState, reset, buildUpdate } = useHomepageEditor(restaurant);
  const t = restaurant.theme;
  const onSubmit = () => onUpdate(buildUpdate());
  const hero = watch("heroImageUrl") || "", logo = watch("logoUrl") || "", name = watch("name"), tagline = watch("tagline"), category = watch("category"), cuisine = watch("cuisine"), hours = watch("hours");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <MenuHeroPreview heroUrl={hero} logoUrl={logo} name={name} tagline={tagline} category={category} cuisine={cuisine} hours={hours} theme={t} />
      <SectionCard icon={ImagePlus} title="Menu Background Image" accent={`rgb(${t.brandColor})`}>
        <ImageUpload value={hero} onChange={(v) => setValue("heroImageUrl", v, { shouldDirty: true })} label="Menu Hero" aspect="landscape" />
      </SectionCard>
      <SectionCard icon={ImagePlus} title="Logo" accent={`rgb(${t.brandColor})`}>
        <ImageUpload value={logo} onChange={(v) => setValue("logoUrl", v, { shouldDirty: true })} label="Restaurant Logo" aspect="square" size="compact" />
      </SectionCard>
      <SectionCard icon={Type} title="Restaurant Name & Tagline" accent={`rgb(${t.brandColor})`}>
        <div className="space-y-3">
          <FormField label="Name" value={name} onChange={(v) => setValue("name", v, { shouldDirty: true })} placeholder="e.g. Mosaic Table" />
          {formState.errors.name && <p className="text-xs text-red-500">{formState.errors.name.message}</p>}
          <FormField label="Tagline" value={tagline} onChange={(v) => setValue("tagline", v, { shouldDirty: true })} placeholder="e.g. Where every meal becomes a memory" />
          {formState.errors.tagline && <p className="text-xs text-red-500">{formState.errors.tagline.message}</p>}
        </div>
      </SectionCard>
      <SectionCard icon={Tag} title="Menu Header Labels" accent={`rgb(${t.accentColor})`}>
        <div className="space-y-3">
          <FormField label="Category Eyebrow" value={category} onChange={(v) => setValue("category", v, { shouldDirty: true })} placeholder="e.g. Fine Dining" />
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cuisine Tags (comma separated)</label>
            <input value={cuisine} onChange={(e) => setValue("cuisine", e.target.value, { shouldDirty: true })} placeholder="Mediterranean, Middle Eastern, Modern European" className="elegant-input w-full mt-1" />
          </div>
        </div>
      </SectionCard>
      <SectionCard icon={Clock} title="Opening Today" accent={`rgb(${t.brandColor})`}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shrink-0"><Calendar className="h-4 w-4" /></div>
          <input value={hours} onChange={(e) => setValue("hours", e.target.value, { shouldDirty: true })} placeholder="09:00 – 00:00" className="elegant-input flex-1" />
        </div>
      </SectionCard>
      <EditorActions hasChanges={formState.isDirty} onReset={reset} onSave={handleSubmit(onSubmit)} isSaving={isSaving} />
    </form>
  );
}
