"use client";

import { useState } from 'react';
import type { Restaurant } from '@justsearch/utils';
import { updateRestaurant } from '@justsearch/utils';
import { Check, X, Palette } from 'lucide-react';
import { SettingsBrandingLogo } from './settings-branding-logo';
import { SettingsBrandingFields } from './settings-branding-fields';

export function SettingsBrandingCard({ restaurant }: { restaurant: Restaurant }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(restaurant.name);
  const [tagline, setTagline] = useState(restaurant.tagline);
  const [description, setDescription] = useState(restaurant.description);
  const [category, setCategory] = useState(restaurant.category);

  const handleSave = () => {
    updateRestaurant(restaurant.slug, { name, tagline, description, category });
    setIsEditing(false);
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <Palette className="h-5 w-5 text-amber-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Branding</h3>
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

      <div className="space-y-4">
        <SettingsBrandingLogo
          restaurant={restaurant}
          isEditing={isEditing}
          name={name}
          tagline={tagline}
          onNameChange={setName}
          onTaglineChange={setTagline}
        />
        <SettingsBrandingFields
          restaurant={restaurant}
          isEditing={isEditing}
          category={category}
          description={description}
          onCategoryChange={setCategory}
          onDescriptionChange={setDescription}
        />
      </div>
    </div>
  );
}
