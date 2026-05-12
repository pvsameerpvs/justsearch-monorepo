import type { Restaurant } from '@justsearch/utils';
import { updateRestaurant } from '@justsearch/utils';

interface SettingsBrandingFieldsProps {
  restaurant: Restaurant;
  isEditing: boolean;
  category: string;
  description: string;
  onCategoryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function SettingsBrandingFields({
  restaurant,
  isEditing,
  category,
  description,
  onCategoryChange,
  onDescriptionChange,
}: SettingsBrandingFieldsProps) {
  return (
    <>
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Category</p>
        {isEditing ? (
          <input value={category} onChange={(e) => onCategoryChange(e.target.value)} className="elegant-input w-full" />
        ) : (
          <p className="text-sm text-slate-700">{restaurant.category}</p>
        )}
      </div>

      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</p>
        {isEditing ? (
          <textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} className="elegant-input w-full min-h-[80px]" />
        ) : (
          <p className="text-sm text-slate-700">{restaurant.description}</p>
        )}
      </div>

      {restaurant.heroImageUrl && (
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Hero Image URL</p>
          {isEditing ? (
            <input value={restaurant.heroImageUrl} onChange={(e) => {
              updateRestaurant(restaurant.slug, { heroImageUrl: e.target.value });
            }} className="elegant-input w-full text-xs" />
          ) : (
            <img src={restaurant.heroImageUrl} alt="Hero" className="w-full h-32 object-cover rounded-lg" />
          )}
        </div>
      )}
    </>
  );
}
