"use client";

import { useState } from 'react';
import { updateRestaurant } from '@justsearch/utils';
import { Camera, Plus, Check, X } from 'lucide-react';
import { SocialCard } from './social-card';
import { SocialsHeader } from './socials-header';
import type { Restaurant } from '@justsearch/utils';

export function SettingsSocialsCard({ restaurant }: { restaurant: Restaurant }) {
  const [socials, setSocials] = useState(restaurant.socials);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateRestaurant(restaurant.slug, { socials });
    setIsEditing(false);
  };

  const updateSocial = (index: number, field: 'platform' | 'url' | 'handle', value: string) => {
    const next = [...socials];
    next[index] = { ...next[index], [field]: value };
    setSocials(next);
  };

  const removeSocial = (index: number) => setSocials(socials.filter((_, i) => i !== index));
  const addSocial = () => setSocials([...socials, { platform: 'Instagram', url: '', handle: '' }]);

  return (
    <div className="space-y-6">
      <SocialsHeader restaurant={restaurant} />

      {/* Edit Toggle */}
      <div className="flex justify-end">
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
              <Check className="h-4 w-4" /> Save
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="elegant-btn-secondary text-xs">
            Edit Social Links
          </button>
        )}
      </div>

      {/* Social Cards - Same format as customer-frontend */}
      {socials.length === 0 && !isEditing ? (
        <div className="text-center py-12 text-slate-400">
          <Camera className="mx-auto h-10 w-10 mb-3 opacity-50" />
          <p className="text-sm">No social links configured</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((social, i) => (
            <SocialCard
              key={i}
              social={social}
              isEditing={isEditing}
              onUpdate={(field, value) => updateSocial(i, field, value)}
              onRemove={() => removeSocial(i)}
            />
          ))}
          {isEditing && (
            <button onClick={addSocial} className="flex flex-col items-center justify-center gap-2 rounded-[40px] border-2 border-dashed border-slate-200 p-5 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all min-h-[120px]">
              <Plus className="h-6 w-6" />
              <span className="text-sm font-semibold">Add Link</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
