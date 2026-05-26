"use client";

import { useState, useEffect } from 'react';
import { Camera, Plus } from 'lucide-react';
import { SocialCard } from './social-card';
import { SocialsHeader } from './socials-header';
import { SettingsSocialsToolbar } from './settings-socials-toolbar';
import type { AdminRestaurant, SocialLink } from '@/lib/types/admin-restaurant';

interface Props {
  restaurant: AdminRestaurant;
  onUpdate?: (updates: Partial<AdminRestaurant>) => void;
}

export function SettingsSocialsCard({ restaurant, onUpdate }: Props) {
  const [socials, setSocials] = useState<SocialLink[]>(restaurant.socials);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEditing) setSocials(restaurant.socials);
  }, [restaurant.socials, isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onUpdate?.({ socials });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save social links");
    } finally {
      setIsSaving(false);
    }
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
      <SettingsSocialsToolbar
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={() => { setError(null); setIsEditing(true); }}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
      />
      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}
      {socials.length === 0 && !isEditing ? (
        <div className="text-center py-12 text-slate-400">
          <Camera className="mx-auto h-10 w-10 mb-3 opacity-50" />
          <p className="text-sm">No social links configured</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {socials.map((social, i) => (
            <SocialCard
              key={`${social.platform}-${i}`}
              social={social}
              isEditing={isEditing}
              onUpdate={(field, value) => updateSocial(i, field, value)}
              onRemove={() => removeSocial(i)}
            />
          ))}
          {isEditing && (
            <button onClick={addSocial} className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-5 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all min-h-[120px]">
              <Plus className="h-6 w-6" />
              <span className="text-sm font-semibold">Add Link</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
