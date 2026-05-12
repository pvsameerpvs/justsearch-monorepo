import { ChefHat } from 'lucide-react';
import type { Restaurant } from '@justsearch/utils';

interface SettingsBrandingLogoProps {
  restaurant: Restaurant;
  isEditing: boolean;
  name: string;
  tagline: string;
  onNameChange: (value: string) => void;
  onTaglineChange: (value: string) => void;
}

export function SettingsBrandingLogo({
  restaurant,
  isEditing,
  name,
  tagline,
  onNameChange,
  onTaglineChange,
}: SettingsBrandingLogoProps) {
  return (
    <div className="flex items-center gap-4">
      {restaurant.logoUrl ? (
        <img src={restaurant.logoUrl} alt="Logo" className="h-16 w-16 rounded-xl object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100">
          <ChefHat className="h-8 w-8 text-slate-400" />
        </div>
      )}
      <div className="flex-1">
        {isEditing ? (
          <>
            <input value={name} onChange={(e) => onNameChange(e.target.value)} className="elegant-input w-full mb-1" placeholder="Restaurant Name" />
            <input value={tagline} onChange={(e) => onTaglineChange(e.target.value)} className="elegant-input w-full text-xs" placeholder="Tagline" />
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-900">{restaurant.name}</p>
            <p className="text-xs text-slate-500">{restaurant.tagline}</p>
          </>
        )}
      </div>
    </div>
  );
}
