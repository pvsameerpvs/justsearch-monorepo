import type { Restaurant } from "@justsearch/utils";
import { ImagePlus, Type, Tag, Clock, Calendar } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { SectionCard, FormField } from "@/components/ui/form-field";
import { MenuHeroPreview } from "./menu-hero-preview";
import { EditorActions } from "./editor-actions";
import { useHomepageEditor } from "./use-homepage-editor";

export function HomepageEditorForm({ restaurant, onUpdate }: {
  restaurant: Restaurant;
  onUpdate: (updates: Partial<Restaurant>) => void;
}) {
  const t = restaurant.theme;
  const { heroUrl, setHeroUrl, logoUrl, setLogoUrl, name, setName, tagline, setTagline, category, setCategory, cuisine, setCuisine, hours, setHours, hasChanges, buildUpdate, reset } = useHomepageEditor(restaurant);

  return (
    <div className="space-y-5">
      <MenuHeroPreview heroUrl={heroUrl} logoUrl={logoUrl} name={name} tagline={tagline} category={category} cuisine={cuisine} hours={hours} theme={t} />

      <SectionCard icon={ImagePlus} title="Menu Background Image" accent={`rgb(${t.brandColor})`}>
        <ImageUpload value={heroUrl} onChange={setHeroUrl} label="Menu Hero" aspect="landscape" />
        <p className="mt-1.5 text-[11px] text-slate-400">This image appears behind your restaurant name on the menu page</p>
      </SectionCard>

      <SectionCard icon={ImagePlus} title="Logo" accent={`rgb(${t.brandColor})`}>
        <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Restaurant Logo" aspect="square" size="compact" />
      </SectionCard>

      <SectionCard icon={Type} title="Restaurant Name & Tagline" accent={`rgb(${t.brandColor})`}>
        <div className="space-y-3">
          <FormField label="Name" value={name} onChange={setName} placeholder="e.g. Mosaic Table" />
          <FormField label="Tagline" value={tagline} onChange={setTagline} placeholder="e.g. Where every meal becomes a memory" />
        </div>
      </SectionCard>

      <SectionCard icon={Tag} title="Menu Header Labels" accent={`rgb(${t.accentColor})`}>
        <div className="space-y-3">
          <FormField label="Category Eyebrow" value={category} onChange={setCategory} placeholder="e.g. Fine Dining" />
          <p className="text-[11px] text-slate-400">Small text above restaurant name on menu page</p>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cuisine Tags (comma separated)</label>
            <input value={cuisine} onChange={(e) => setCuisine(e.target.value)} placeholder="Mediterranean, Middle Eastern, Modern European" className="elegant-input w-full mt-1" />
          </div>
          <p className="text-[11px] text-slate-400">Shown as pills below tagline on menu page</p>
        </div>
      </SectionCard>

      <SectionCard icon={Clock} title="Opening Today" accent={`rgb(${t.brandColor})`}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600 shrink-0">
            <Calendar className="h-4 w-4" />
          </div>
          <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="09:00 – 00:00" className="elegant-input flex-1" />
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">Displayed in &quot;Opening Today&quot; card on menu page</p>
      </SectionCard>

      <EditorActions hasChanges={hasChanges} onReset={reset} onSave={() => onUpdate(buildUpdate())} />
    </div>
  );
}
