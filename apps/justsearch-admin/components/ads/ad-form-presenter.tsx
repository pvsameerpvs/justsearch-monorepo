import { AdMediaUpload } from "./ad-media-upload";
import { AdCampaignTypeSelect } from "./ad-campaign-type-select";
import { AdRestaurantSelect } from "./ad-restaurant-select";
import { AdGameSelector } from "./ad-game-selector";
import { AdFormDetails } from "./ad-form-details";
import type { AdCampaignFormData } from "@/lib/stores/ad-campaign-types";

interface RestaurantOption {
  id: string;
  name: string;
}

interface AdFormPresenterProps {
  form: AdCampaignFormData;
  isEdit: boolean;
  restaurants: RestaurantOption[];
  onSetField: <K extends keyof AdCampaignFormData>(key: K, value: AdCampaignFormData[K]) => void;
  onToggleGame: (gameId: string) => void;
  onSetRestaurant: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function AdFormPresenter({
  form,
  isEdit,
  restaurants,
  onSetField,
  onToggleGame,
  onSetRestaurant,
  onSave,
  onCancel,
}: AdFormPresenterProps) {
  return (
    <div className="space-y-6">
      <section>
        <h4 className="mb-3 text-sm font-bold text-slate-900">Ad Media</h4>
        <AdMediaUpload
          mediaType={form.mediaType}
          mediaUrl={form.mediaUrl}
          onChange={(type, url) => {
            onSetField("mediaType", type);
            onSetField("mediaUrl", url);
          }}
        />
      </section>

      <section>
        <h4 className="mb-3 text-sm font-bold text-slate-900">Revenue Split</h4>
        <AdCampaignTypeSelect value={form.type} onChange={(v) => onSetField("type", v)} />
      </section>

      <section>
        <h4 className="mb-3 text-sm font-bold text-slate-900">Campaign Details</h4>
        <AdFormDetails form={form} onSetField={onSetField} />
      </section>

      {form.type === "restaurant_brought" && (
        <section>
          <h4 className="mb-3 text-sm font-bold text-slate-900">Restaurant</h4>
          <AdRestaurantSelect value={form.restaurantId} restaurants={restaurants} onChange={onSetRestaurant} />
        </section>
      )}

      <section>
        <h4 className="mb-3 text-sm font-bold text-slate-900">Target Games</h4>
        <AdGameSelector assignedGames={form.assignedGames} onToggle={onToggleGame} />
      </section>

      <div className="flex gap-3 pt-2 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="elegant-btn-secondary flex-1 py-2.5">
          Cancel
        </button>
        <button type="button" onClick={onSave} className="elegant-btn-primary flex-1 py-2.5">
          {isEdit ? "Save Changes" : "Create Campaign"}
        </button>
      </div>
    </div>
  );
}
