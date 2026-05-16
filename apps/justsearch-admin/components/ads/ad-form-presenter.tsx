import { AdMediaUpload } from "./ad-media-upload";
import { AdCampaignTypeSelect } from "./ad-campaign-type-select";
import { AdRestaurantSelect } from "./ad-restaurant-select";
import { AdGameSelector } from "./ad-game-selector";
import { AdFormDetails } from "./ad-form-details";
import type { AdCampaignFormData } from "@/lib/stores/ad-campaign-types";
import type { GameOption, RestaurantOption } from "./ad-campaign.types";

interface AdFormPresenterProps {
  form: AdCampaignFormData;
  isEdit: boolean;
  restaurants: RestaurantOption[];
  games: GameOption[];
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
  games,
  onSetField,
  onToggleGame,
  onSetRestaurant,
  onSave,
  onCancel,
}: AdFormPresenterProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">🎬 Ad Media</h4>
        <AdMediaUpload
          mediaType={form.mediaType}
          mediaUrl={form.mediaUrl}
          onChange={(type, url) => { onSetField("mediaType", type); onSetField("mediaUrl", url); }}
        />
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">💰 Revenue Split</h4>
        <AdCampaignTypeSelect value={form.type} onChange={(v) => onSetField("type", v)} />
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">📝 Campaign Details</h4>
        <AdFormDetails form={form} onSetField={onSetField} />
      </section>

      {form.type === "restaurant_brought" && (
        <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">🏪 Restaurant</h4>
          <AdRestaurantSelect value={form.restaurantId} restaurants={restaurants} onChange={onSetRestaurant} />
        </section>
      )}

      <section className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="mb-3 text-sm font-bold text-slate-900 flex items-center gap-2">🎮 Target Games</h4>
        <AdGameSelector games={games} assignedGames={form.assignedGames} onToggle={onToggleGame} />
      </section>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="elegant-btn-secondary flex-1 py-2.5 rounded-xl font-bold text-sm">
          Cancel
        </button>
        <button type="button" onClick={onSave} className="elegant-btn-primary flex-1 py-2.5 rounded-xl font-bold text-sm">
          {isEdit ? "Save Changes" : "Create Campaign"}
        </button>
      </div>
    </div>
  );
}
