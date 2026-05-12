"use client";

import { useState } from 'react';
import type { Restaurant } from '@justsearch/utils';
import { updateRestaurant } from '@justsearch/utils';
import { Camera, Plus, Check, X } from 'lucide-react';
import { SocialRow } from './social-row';

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
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
            <Camera className="h-5 w-5 text-violet-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Social Media</h3>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
            <button onClick={handleSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="elegant-btn-secondary text-xs">
            Edit
          </button>
        )}
      </div>

      {socials.length === 0 && !isEditing ? (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">No social links configured</p>
        </div>
      ) : (
        <div className="space-y-2">
          {socials.map((social, i) => (
            <SocialRow
              key={i}
              social={social}
              isEditing={isEditing}
              onUpdate={(field, value) => updateSocial(i, field, value)}
              onRemove={() => removeSocial(i)}
            />
          ))}
          {isEditing && (
            <button onClick={addSocial} className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-2 px-4 text-sm font-medium text-slate-400 hover:border-slate-300 hover:text-slate-600 w-full justify-center">
              <Plus className="h-4 w-4" /> Add Social Link
            </button>
          )}
        </div>
      )}
    </div>
  );
}
